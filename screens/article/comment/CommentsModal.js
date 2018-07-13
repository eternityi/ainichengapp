import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView, Dimensions, Platform } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { MenuProvider } from "react-native-popup-menu";

import { Iconfont } from "../../../utils/Fonts";
import Colors from "../../../constants/Colors";
import { CustomPopoverMenu, SlideInUpModal } from "../../../components/Modal";
import { CategoryGroup } from "../../../components/MediaGroup";
import { LoadingMore, LoadingError, ContentEnd, Diving } from "../../../components/Pure";
import EmitInput from "../../../components/Native/EmitInput";
import CommentItem from "./CommentItem";

import { Query, Mutation } from "react-apollo";
import { connect } from "react-redux";
import { commentsQuery, addCommentMutation, replyCommentsQuery } from "../../../graphql/comment.graphql";

const { width, height } = Dimensions.get("window");

class CommentsModal extends Component {
	constructor(props) {
		super(props);
		this.body = "";
		this.state = {
			fetchingMore: true,
			order: props.order,
			onlyAuthor: props.onlyAuthor,
			replyingComment: null
		};
	}

	onEmitterReady = emitter => {
		this.thingEmitter = emitter;
		this.thingEmitter.addListener("addCommentModalChanged", text => {
			this.body = text;
		});
	};

	render() {
		let { visible, toggleVisible, article, navigation } = this.props;
		let { replyingComment, order, onlyAuthor, fetchingMore } = this.state;
		let filter = onlyAuthor ? "ONLY_AUTHOR" : "ALL";
		return (
			<SlideInUpModal
				visible={visible}
				toggleVisible={toggleVisible}
				customStyle={{
					borderTopLeftRadius: 8,
					borderTopRightRadius: 8
				}}
			>
				<View style={styles.container}>
					<MenuProvider style={{ flex: 1 }}>
						{this._renderListHeader()}
						<Query query={commentsQuery} variables={{ article_id: article.id, order, filter }}>
							{({ loading, error, data, refetch, fetchMore }) => {
								if (!(data && data.comments)) return null;
								if (data.comments.length < 1) return this.listEmpty();
								return (
									<View style={{ flex: 1 }}>
										<FlatList
											style={{ flex: 1 }}
											data={data.comments}
											keyExtractor={(item, index) => index.toString()}
											renderItem={this._renderCommentItem}
											onEndReachedThreshold={0.3}
											onEndReached={() => {
												if (data.comments) {
													fetchMore({
														variables: {
															offset: data.comments.length
														},
														updateQuery: (prev, { fetchMoreResult }) => {
															if (
																!(fetchMoreResult && fetchMoreResult.comments && fetchMoreResult.comments.length > 0)
															) {
																this.setState({
																	fetchingMore: false
																});
																return prev;
															}
															return Object.assign({}, prev, {
																comments: [...prev.comments, ...fetchMoreResult.comments]
															});
														}
													});
												} else {
													this.setState({
														fetchingMore: false
													});
												}
											}}
											ListFooterComponent={() => {
												return fetchingMore ? <LoadingMore /> : <ContentEnd />;
											}}
										/>
										<View style={styles.addComment}>
											<View style={{ marginLeft: 10, flex: 1 }}>
												<EmitInput
													style={styles.commentInput}
													placeholder="添加一条评论吧~"
													name="addCommentModal"
													defaultValue={this.body}
													onEmitterReady={this.onEmitterReady}
													onFocus={this._focusHandler.bind(this)}
													ref={ref => (this.commentInput = ref)}
												/>
											</View>
											<Mutation mutation={addCommentMutation}>
												{addComment => {
													return (
														<TouchableOpacity
															onPress={() => {
																//验证是否为空
																if (this.body.length > 0) {
																	addComment({
																		variables: {
																			commentable_id: article.id,
																			body: this.body,
																			comment_id: replyingComment ? replyingComment.id : "",
																			at_uid: replyingComment ? replyingComment.user.id : ""
																		},
																		refetchQueries: addComment => [
																			{
																				query: commentsQuery,
																				variables: {
																					article_id: article.id,
																					order,
																					filter
																				}
																			}
																		]
																	});
																	this.changeBody("");
																}
																this.commentInput.input.blur();
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
					</MenuProvider>
				</View>
			</SlideInUpModal>
		);
	}

	_renderListHeader = () => {
		let { onlyAuthor, order } = this.state;
		const { article, toggleVisible } = this.props;
		return (
			<View style={styles.topTitle}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity onPress={toggleVisible}>
						<Iconfont name={"chacha"} size={20} color={Colors.primaryFontColor} />
					</TouchableOpacity>
					<Text style={styles.countCommentText}>评论</Text>
					<Text
						onPress={() => this.setState({ onlyAuthor: !onlyAuthor })}
						style={{
							fontSize: 13,
							color: onlyAuthor ? Colors.themeColor : Colors.tintFontColor
						}}
					>
						只看作者
					</Text>
				</View>
				<CustomPopoverMenu
					width={110}
					selectHandler={index => {
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
		let { navigation, toggleVisible } = this.props;
		let comment = item;
		return (
			<CommentItem
				comment={comment}
				toggleReplyComment={comment => {
					this.setState(prevState => ({
						replyingComment: comment
					}));
					this.changeBody(`@${comment.user.name} `);
					this.commentInput.input.focus();
				}}
				toggleVisible={toggleVisible}
				navigation={navigation}
			/>
		);
	};

	listEmpty = () => {
		return (
			<Diving customStyle={{ paddingVertical: 40, backgroundColor: Colors.skinColor }}>
				<Text style={styles.listEmpty}>作者还没有发表评论哦~</Text>
			</Diving>
		);
	};

	_focusHandler = () => {
		let { replyingComment } = this.state;
		if (this.body.length < 1 && replyingComment) {
			this.setState({
				replyingComment: null
			});
		}
	};

	changeBody = body => {
		this.body = body;
		this.commentInput.changeText(this.body);
	};
}

const styles = StyleSheet.create({
	container: {
		height: height - 24,
		backgroundColor: Colors.skinColor,
		overflow: "hidden"
	},
	listEmpty: {
		fontSize: 14,
		color: Colors.lightFontColor,
		marginTop: 12
	},
	topTitle: {
		padding: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	countCommentText: {
		fontSize: 15,
		color: Colors.primaryFontColor,
		marginLeft: 16,
		marginRight: 10
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
