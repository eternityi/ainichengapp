import React, { Component } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions, Platform } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import EmitInput from "../../components/Native/EmitInput";
import BasicModal from "./BasicModal";
import SearchUserModal from "./SearchUserModal";

import { Query, Mutation } from "react-apollo";
import { commentsQuery, addCommentMutation } from "../../graphql/comment.graphql";

const { width } = Dimensions.get("window");

class AddCommentModal extends Component {
	constructor(props) {
		super(props);
		this.atUser = null;
		this.body = "";
		this.toggleVisible = this.toggleVisible.bind(this);
		this.prevReplyingComment = {};
		this.state = {
			aiteModalVisible: false
		};
	}

	onEmitterReady = emitter => {
		this.thingEmitter = emitter;
		this.thingEmitter.addListener(this.props.emitter + "Changed", text => {
			this.body = text;
		});
	};

	componentWillUpdate(nextProps, nextState) {
		this.prevReplyingComment = this.props.replyingComment ? this.props.replyingComment : {};
	}

	render() {
		const { visible, toggleCommentModal, article, replyingComment, order = "LATEST_FIRST", filter = "ALL", emitter, navigation } = this.props;
		let { aiteModalVisible } = this.state;
		return (
			<Mutation mutation={addCommentMutation}>
				{addComment => {
					return (
						<BasicModal
							visible={visible}
							handleVisible={toggleCommentModal}
							customStyle={{
								width,
								position: "absolute",
								bottom: 0,
								left: 0,
								borderRadius: 0
							}}
						>
							<View>
								<EmitInput
									autoFocus
									onFocus={this._inputFocus.bind(this)}
									style={styles.textInput}
									name={emitter}
									defaultValue={this.body}
									onEmitterReady={this.onEmitterReady}
									ref={ref => {
										this.inputText = ref;
									}}
								/>
								<View style={styles.textBottom}>
									<View style={styles.textBottom}>
										<TouchableOpacity onPress={this.toggleVisible}>
											<Iconfont name="aite" size={22} color={Colors.lightFontColor} style={{ marginHorizontal: 10 }} />
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => {
												this.changeBody(this.body + "😊");
											}}
										>
											<Iconfont name="smile" size={22} color={Colors.lightFontColor} style={{ marginHorizontal: 10 }} />
										</TouchableOpacity>
									</View>
									<TouchableOpacity
										onPress={() => {
											toggleCommentModal();
											if (!this.body) return null;
											addComment({
												variables: {
													commentable_id: article.id,
													body: this.body,
													comment_id: replyingComment ? replyingComment.id : "",
													at_uid: this.atUser ? this.atUser.id : ""
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
										}}
										style={styles.publishComment}
									>
										<Text
											style={{
												fontSize: 14,
												color: Colors.weixinColor,
												textAlign: "center"
											}}
										>
											发表评论
										</Text>
									</TouchableOpacity>
								</View>
							</View>
							<SearchUserModal
								navigation={navigation}
								visible={aiteModalVisible}
								toggleVisible={this.toggleVisible}
								handleSelectedUser={user => {
									this.toggleVisible();
									this.atUser = user;
									this.changeBody(this.body + `@${this.atUser.name} `);
								}}
							/>
						</BasicModal>
					);
				}}
			</Mutation>
		);
	}

	changeBody = body => {
		this.body = body;
		this.inputText.changeText(this.body);
	};

	toggleVisible() {
		this.setState(prevState => ({ aiteModalVisible: !prevState.aiteModalVisible }));
	}

	_inputFocus() {
		let { replyingComment } = this.props;
		if (replyingComment && this.prevReplyingComment.id !== replyingComment.id) {
			this.atUser = replyingComment.user;
			this.changeBody(`@${replyingComment.user.name} `);
		} else if (replyingComment && this.body.indexOf(`@${replyingComment.user.name}`) !== 0) {
			this.atUser = replyingComment.user;
			this.changeBody(`@${replyingComment.user.name} `);
		}
	}

	// sendTextMsg = event => {
	// 	console.log("this.inputText", this.inputText._lastNativeText);
	// 	const { text } = event.nativeEvent;
	// 	if (text === "") {
	// 		return;
	// 	}
	// 	this.setState({ body: text });
	// };
}

const styles = StyleSheet.create({
	textInput: {
		height: 80,
		padding: 10,
		marginBottom: 15,
		borderWidth: 1,
		borderColor: Colors.tintBorderColor,
		borderRadius: 3
	},
	textBottom: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	publishComment: {
		width: 80,
		height: 30,
		borderWidth: 1,
		borderColor: Colors.weixinColor,
		borderRadius: 3,
		justifyContent: "center"
	}
});

export default AddCommentModal;
