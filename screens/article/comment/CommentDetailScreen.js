import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";

import Screen from "../../Screen";
import Colors from "../../../constants/Colors";
import { Header } from "../../../components/Header";
import { Input } from "../../../components/elements";
import CommentItem from "./CommentItem";

import { connect } from "react-redux";
import actions from "../../../store/actions";
import { commentsQuery, addCommentMutation, replyCommentsQuery } from "../../../graphql/comment.graphql";
import { Query, Mutation, withApollo } from "react-apollo";

const { width } = Dimensions.get("window");

class CommentDetailScreen extends Component {
	constructor(props) {
		super(props);
		let comment = props.navigation.getParam("comment", {});
		this.state = {
			value: "",
			comment,
			replyingComment: comment //回复的评论
		};
	}

	componentWillMount() {
		let { comment } = this.state;
		if (!comment.replyComments) {
			this.fetchReplyComments();
		}
	}

	render() {
		let { navigation } = this.props;
		let { value, comment, replyingComment } = this.state;

		return (
			<Screen>
				<View style={styles.container}>
					<Header navigation={navigation} />
					<ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
						<CommentItem
							comment={comment}
							navigation={navigation}
							detail
							toggleReplyComment={replyingComment => this._handleFocus(replyingComment)}
						/>
					</ScrollView>
					<View style={styles.addComment}>
						<View style={{ marginLeft: 10, flex: 1 }}>
							<Input
								style={styles.commentInput}
								value={value}
								changeText={this.changeText}
								onFocus={this._inputFocus.bind(this)}
								inputRef={ref => (this.inputRef = ref)}
							/>
						</View>
						<Mutation mutation={addCommentMutation}>
							{replyComment => {
								return (
									<TouchableOpacity
										onPress={() => {
											this.inputRef.blur();
											//验证是否为空
											if (!(value.length > replyingComment.user.name.length + 2)) {
												this.setState({
													comment
												});
												this.changeText("");
												return null;
											}
											replyComment({
												variables: {
													commentable_id: comment.commentable_id,
													body: value,
													comment_id: replyingComment.id
												},
												refetchQueries: ({ replyComment }) => [
													{
														query: commentsQuery,
														variables: {
															article_id: comment.commentable_id,
															order: "LATEST_FIRST",
															filter: "ALL"
														}
													}
												],
												update: (cache, { data: { addComment } }) => {
													let comment = Object.assign({}, this.state.comment, {
														replyComments: [...this.state.comment.replyComments, addComment]
													});
													this.setState({
														comment
													});
													this.changeText("");
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
					{Platform.OS === "ios" && <KeyboardSpacer />}
				</View>
			</Screen>
		);
	}

	async fetchReplyComments() {
		let { comment } = this.state;
		let { data } = await this.props.client.query({
			query: replyCommentsQuery,
			variables: { comment_id: comment.id }
		});
		this.setState(prevState => ({
			comment: {
				...prevState.comment,
				...{ replyComments: data.comments }
			}
		}));
	}

	// 输入框聚焦自带检测是否应该加上@用户名
	_inputFocus() {
		let { navigation, login } = this.props;
		if (login) {
			let { replyingComment, value } = this.state;
			if (value.indexOf(`@${replyingComment.user.name}`) !== 0) {
				this.changeText(`@${replyingComment.user.name} ` + value);
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
			this.inputRef.focus();
		} else {
			navigation.navigate("登录注册");
		}
	}

	changeText = value => {
		this.setState({ value });
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
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

export default connect(store => ({ login: store.users.login }))(withApollo(CommentDetailScreen));
