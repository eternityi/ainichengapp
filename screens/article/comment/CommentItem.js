import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image, FlatList, Dimensions } from "react-native";
import { Iconfont } from "../../../utils/Fonts";
import Colors from "../../../constants/Colors";

import Avatar from "../../../components/Pure/Avatar";
import Dashed from "../../../components/Pure/Dashed";
import { OperationModal, ReportModal } from "../../../components/Modal";
const { width, height } = Dimensions.get("window");

import { Query, Mutation } from "react-apollo";
import { likeCommentMutation, commentsQuery, replyCommentsQuery } from "../../../graphql/comment.graphql";

class CommentItem extends Component {
	constructor(props) {
		super(props);

		this._renderSubCommentItem = this._renderSubCommentItem.bind(this);
		this.handleOperationModal = this.handleOperationModal.bind(this);
		this.handleReportModal = this.handleReportModal.bind(this);

		this.state = {
			liked: props.comment.liked,
			likes: props.comment.likes,
			operationModalVisible: false,
			reportModalVisible: false,
			subComment: null
		};
	}

	render() {
		//detail决定评论是否显示详细内容
		const { detail = false, comment, toggleReplyComment, navigation } = this.props;
		const { liked, likes, operationModalVisible, reportModalVisible, subComment } = this.state;
		let replyComments = detail ? comment.replyComments : comment.replyComments.slice(0, 3);
		return (
			<View style={styles.commentItem}>
				<View>
					<View style={styles.author}>
						<View style={{ flexDirection: "row" }}>
							<TouchableOpacity
								style={{ marginRight: 10 }}
								onPress={() =>
									navigation.navigate("用户详情", {
										user: comment.user
									})}
							>
								<Avatar size={30} uri={comment.user.avatar} />
							</TouchableOpacity>
							<View>
								<Text style={styles.userName}>{comment.user.name}</Text>
								<Text style={styles.timeAgo}>
									{comment.lou}楼·{comment.time_ago}
								</Text>
							</View>
						</View>
						<View style={styles.operation}>
							<TouchableOpacity
								onPress={() => {
									toggleReplyComment(comment);
								}}
							>
								<Iconfont name={"comment-hollow"} size={22} color={Colors.tintFontColor} />
							</TouchableOpacity>
							<Mutation mutation={likeCommentMutation}>
								{likeComment => {
									return (
										<TouchableOpacity
											style={styles.operation}
											onPress={() => {
												this.setState(prevState => ({
													liked: !prevState.liked,
													likes: prevState.liked ? --prevState.likes : ++prevState.likes
												}));
												likeComment({
													variables: {
														comment_id: comment.id
													}
												});
											}}
										>
											<Iconfont
												name={liked ? "praise" : "praise-outline"}
												size={22}
												color={liked ? Colors.themeColor : Colors.tintFontColor}
											/>
											<Text style={styles.commentLikes}>{likes}</Text>
										</TouchableOpacity>
									);
								}}
							</Mutation>
						</View>
					</View>
					<TouchableOpacity
						style={styles.commentContent}
						onPress={() => {
							this.setState({ subComment: comment });
							this.handleOperationModal();
						}}
					>
						<Text style={styles.commentBody}>{comment.body}</Text>
					</TouchableOpacity>
				</View>

				{comment.replyComments && comment.replyComments.length > 0 && this._renderReplyComments(replyComments)}
				{detail &&
					!comment.replyComments && (
						<Query query={replyCommentsQuery} variables={{ comment_id: comment.id }}>
							{({ data }) => {
								if (!(data && data.comments)) return null;
								return this._renderReplyComments(data.comments);
							}}
						</Query>
					)}

				<OperationModal
					visible={operationModalVisible}
					handleVisible={this.handleOperationModal}
					operation={["回复", "复制", "举报"]}
					handleOperation={index => {
						switch (index) {
							case 0:
								toggleReplyComment(subComment);
								this.handleOperationModal();
								break;
							case 1:
								return "复制";
								break;
							case 2:
								this.handleOperationModal();
								this.handleReportModal();
								break;
						}
					}}
				/>
				<ReportModal visible={reportModalVisible} handleVisible={this.handleReportModal} type={"comment"} report={comment} />
			</View>
		);
	}

	_renderReplyComments(replyComments) {
		const { detail = false, comment, navigation } = this.props;
		return (
			<View style={styles.subComment}>
				{replyComments &&
					replyComments.map((reply, index) => {
						return <View key={index.toString()}>{this._renderSubCommentItem(reply)}</View>;
					})}
				{!detail &&
					comment.replyComments.length > 3 && (
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("评论详情", {
									comment: comment
								})}
						>
							<Text style={styles.unfoldMore}>共{comment.replyComments.length - 3}条回复</Text>
							<Iconfont name={"right"} size={16} color={Colors.linkColor} />
						</TouchableOpacity>
					)}
			</View>
		);
	}

	_renderSubCommentItem(reply) {
		let { navigation } = this.props;
		return (
			<TouchableOpacity
				onPress={() => {
					this.setState({ subComment: reply });
					this.handleOperationModal();
				}}
			>
				<View style={styles.subCommentItem}>
					<Text numberOfLines={3} style={{ fontSize: 15, color: Colors.primaryFontColor }}>
						<Text
							style={{ color: Colors.linkColor, lineHeight: 20 }}
							onPress={() =>
								navigation.navigate("用户详情", {
									user: reply.user
								})}
						>
							{reply.user.name}
						</Text>:
						{reply.atUser && (
							<Text
								style={{
									color: Colors.linkColor,
									lineHeight: 20
								}}
								onPress={() =>
									navigation.navigate("用户详情", {
										user: reply.atUser
									})}
							>
								{" "}
								@{reply.atUser.name}
							</Text>
						)}
						<Text style={{ lineHeight: 20 }}> {reply.body}</Text>
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	handleOperationModal() {
		this.setState(prevState => ({
			operationModalVisible: !prevState.operationModalVisible
		}));
	}

	handleReportModal() {
		this.setState(prevState => ({
			reportModalVisible: !prevState.reportModalVisible
		}));
	}
}

const styles = StyleSheet.create({
	commentItem: {
		paddingHorizontal: 20,
		paddingTop: 20
	},
	userName: {
		fontSize: 15,
		color: Colors.primaryFontColor
	},
	timeAgo: {
		fontSize: 12,
		color: Colors.tintFontColor,
		paddingTop: 6
	},
	operation: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 20
	},
	commentLikes: {
		fontSize: 14,
		color: Colors.primaryFontColor,
		marginLeft: 5
	},
	commentBody: {
		fontSize: 16,
		color: Colors.primaryFontColor,
		lineHeight: 20
	},
	author: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	commentContent: {
		paddingVertical: 18
	},
	subComment: {
		backgroundColor: Colors.lightGray,
		padding: 6
	},
	subCommentItem: {
		paddingVertical: 6
	},
	unfoldMore: {
		fontSize: 15,
		color: Colors.linkColor
	}
});

export default CommentItem;
