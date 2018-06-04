import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from "react-native";

import Colors from "../../../constants/Colors";
import Header from "../../../components/Header/Header";
import CommentItem from "./CommentItem";
import KeyboardSpacer from "react-native-keyboard-spacer";

import { connect } from "react-redux";
import actions from "../../../store/actions";
import Screen from "../../Screen";
import { commentsQuery, addCommentMutation } from "../../../graphql/comment.graphql";
import { Query, Mutation } from "react-apollo";

const { width } = Dimensions.get("window");

class CommentDetailScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			comment: props.navigation.state.params.comment,
			replyingComment: props.navigation.state.params.comment,
			body: ""
		};
	}

	render() {
		let { navigation } = this.props;
		let { comment, replyingComment, body } = this.state;

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
														comment,
														body: ""
													});
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

	// 输入框聚焦自带检测是否应该加上@用户名
	_inputFocus() {
		let { body, replyingComment } = this.state;
		if (body.indexOf(`@${replyingComment.user.name}`) !== 0) {
			body = `@${replyingComment.user.name} ` + body;
			this.setState({ body });
		}
	}

	_handleFocus(replyingComment) {
		this.setState({ replyingComment });
		this.commentInput.focus();
	}
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

export default connect(store => ({ comment: store.articles.comment }))(CommentDetailScreen);
