import React, { Component } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TouchableNativeFeedback,
	Text,
	TextInput,
	FlatList,
	ScrollView,
	Dimensions,
	Platform
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";

import CommentItem from "./CommentItem";

import { Iconfont } from "../../../utils/Fonts";
import Colors from "../../../constants/Colors";
import { CustomPopoverMenu, SlideInUpModal } from "../../../components/Modal";
import { CategoryGroup } from "../../../components/MediaGroup";
import { ContentEnd } from "../../../components/Pure";

import { Query, Mutation } from "react-apollo";
import { connect } from "react-redux";
import { commentsQuery, addCommentMutation, replyCommentsQuery } from "../../../graphql/comment.graphql";

const { width, height } = Dimensions.get("window");

class CommentsModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order: "LATEST_FIRST",
			onlyAuthor: false,
			replyCommentVisible: false,
			replyingComment: null,
			body: ""
		};
	}

	render() {
		let { visible, toggleVisible, article, navigation } = this.props;
		let { replyCommentVisible, replyingComment, order, onlyAuthor, body } = this.state;
		let filter = onlyAuthor ? "ONLY_AUTHOR" : "ALL";
		return (
			<SlideInUpModal visible={visible} toggleVisible={toggleVisible}>
				<View style={styles.container}>
					<Query query={commentsQuery} variables={{ article_id: article.id, order, filter }}>
						{({ loading, error, data, refetch, fetchMore }) => {
							if (!(data && data.comments)) return null;
							return (
								<View style={{ flex: 1 }}>
									<FlatList
										style={{ flex: 1 }}
										data={data.comments}
										keyExtractor={(item, index) => index.toString()}
										renderItem={this._renderCommentItem}
										ListFooterComponent={() => {
											return <ContentEnd />;
										}}
									/>
									<View style={styles.addComment}>
										<View style={{ marginLeft: 10, flex: 1 }}>
											<TextInput
												underlineColorAndroid="transparent"
												style={styles.commentInput}
												placeholder="添加一条评论吧~"
												placeholderText={Colors.lightFontColor}
												onFocus={this._inputFocus.bind(this)}
												onChangeText={body => this.setState({ body })}
												value={body + ""}
												ref={ref => (this.commentInput = ref)}
											/>
										</View>
										<Mutation mutation={addCommentMutation}>
											{replyComment => {
												return (
													<TouchableOpacity
														onPress={() => {
															this.commentInput.blur();
															//验证是否为空
															if (!(body.length > replyingComment.user.name.length + 2)) {
																this.setState({
																	comment,
																	body: ""
																});
																return null;
															}
															replyComment({
																variables: {
																	commentable_id: comment.commentable_id,
																	body: body,
																	comment_id: replyingComment.id,
																	at_uid: replyingComment.user.id
																}
															});
														}}
													>
														<View style={{ marginHorizontal: 20 }}>
															<Text
																style={{
																	fontSize: 16,
																	color: Colors.themeColor
																}}
															>
																发表
															</Text>
														</View>
													</TouchableOpacity>
												);
											}}
										</Mutation>
									</View>
								</View>
							);
						}}
					</Query>
					{Platform.OS === "ios" && <KeyboardSpacer />}
				</View>
			</SlideInUpModal>
		);
	}

	_renderListHeader = () => {
		const { onlyAuthor, order } = this.state;
		const { article } = this.props;
		return (
			<View style={styles.topTitle}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Text
						style={{
							fontSize: 13,
							color: Colors.themeColor,
							marginRight: 8
						}}
					>
						评论 {article.count_comments}
					</Text>
					<TouchableOpacity
						style={[styles.onlyAuthor, onlyAuthor ? styles.onlyAuthored : ""]}
						onPress={() => this.setState({ onlyAuthor: !onlyAuthor })}
					>
						<Text
							style={{
								fontSize: 12,
								color: onlyAuthor ? "#fff" : "#bbb"
							}}
						>
							只看作者
						</Text>
					</TouchableOpacity>
				</View>
				<CustomPopoverMenu
					width={110}
					selectHandler={index => {
						let { order } = this.state;
						switch (index) {
							case 0: {
								order = "LATEST_FIRST";
								break;
							}
							case 1: {
								order = "OLD_FIRST";
								break;
							}
							case 2: {
								order = "LIKED_MOST";
								break;
							}
						}
						this.setState({ order });
					}}
					triggerComponent={
						<Text
							style={{
								fontSize: 13,
								color: Colors.tintFontColor
							}}
						>
							{order == "LATEST_FIRST" && "按时间倒序"}
							{order == "OLD_FIRST" && "按时间正序"}
							{order == "LIKED_MOST" && "按点赞排序"}
							<Iconfont name={"downward-arrow"} size={12} />
						</Text>
					}
					options={["按时间倒序", "按时间正序", "按点赞排序"]}
				/>
			</View>
		);
	};

	_renderCommentItem = ({ item, index }) => {
		let { navigation } = this.props;
		return (
			<CommentItem
				comment={item}
				toggleReplyComment={comment => {
					this.setState(prevState => ({
						replyCommentVisible: !prevState.replyCommentVisible,
						replyingComment: comment
					}));
				}}
				navigation={navigation}
			/>
		);
	};

	// 输入框聚焦自带检测是否应该加上@用户名
	_inputFocus() {
		let { navigation, login } = this.props;
		if (login) {
			let { body, replyingComment } = this.state;
			if (body.indexOf(`@${replyingComment.user.name}`) !== 0) {
				body = `@${replyingComment.user.name} ` + body;
				this.setState({ body });
			}
		} else {
			navigation.navigate("登录注册");
		}
	}

	//点击回复评论  聚焦底部评论框并且set当前回复的该条评论
	_handleFocus(replyingComment) {
		let { navigation, login } = this.props;
		if (login) {
			this.setState({ replyingComment });
			this.commentInput.focus();
		} else {
			navigation.navigate("登录注册");
		}
	}
}

const styles = StyleSheet.create({
	container: {
		height: height * 0.8,
		borderTopLeftRadius: 6,
		borderTopRightRadius: 6,
		backgroundColor: Colors.skinColor,
		overflow: "hidden"
	},
	topTitle: {
		paddingVertical: 6,
		paddingHorizontal: 20,
		backgroundColor: Colors.lightGray,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: Colors.lightBorderColor
	},
	onlyAuthor: {
		padding: 4,
		borderWidth: 1,
		borderColor: "#bbb",
		borderRadius: 4
	},
	onlyAuthored: {
		borderColor: Colors.themeColor,
		backgroundColor: Colors.themeColor
	},
	addComment: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.skinColor
	},
	commentInput: {
		marginVertical: 10,
		height: 40,
		paddingLeft: 10,
		backgroundColor: Colors.tintGray,
		borderRadius: 3,
		fontSize: 16,
		color: Colors.primaryFontColor
	}
});

export default connect(store => ({ login: store.users.login }))(CommentsModal);
