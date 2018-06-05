import React, { Component } from "react";
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, FlatList } from "react-native";
import VideoPlayer from "react-native-video-controls";
import KeyboardSpacer from "react-native-keyboard-spacer";

import { connect } from "react-redux";
import actions from "../../store/actions";
import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

import Screen from "../Screen";

const { width, height } = Dimensions.get("window");

class DetailScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.onLoad = this.onLoad.bind(this);
		this.onProgress = this.onProgress.bind(this);
		this.onBuffer = this.onBuffer.bind(this);
		this.togglePlay = this.togglePlay.bind(this);
		this.state = {
			fullScreen: false,
			rate: 1,
			paused: true,
			volume: 1,
			muted: false,
			duration: 0,
			currentTime: 0,
			isBuffering: false
		};
	}

	onLoad(data) {
		console.log("On load fired!");
		this.setState({ duration: data.duration });
	}

	onProgress(data) {
		this.setState({ currentTime: data.currentTime });
	}

	onBuffer({ isBuffering }: { isBuffering: boolean }) {
		this.setState({ isBuffering });
	}

	render() {
		let { fullScreen, rate, paused, muted, ignoreSilentSwitch } = this.state;
		let { navigation } = this.props;
		return (
			<Screen>
				<ScrollView style={styles.container}>
					<View style={styles.videoWrap}>
						<VideoPlayer
							onPlay={() => {
								this.setState({
									paused: false
								});
							}}
							onPause={() => {
								this.setState({
									paused: true
								});
							}}
							// onEnterFullscreen={()=>{
							// 	navigation.navigate("视频全屏")
							// }}
							navigator={() => {
								navigation.goBack();
							}}
							source={{ uri: "https://www.ainicheng.com/storage/video/236.mp4" }}
							// poster="https://www.ainicheng.com/storage/video/236.jpg"
							// posterResizeMode="cover"
							style={{
								width,
								height: fullScreen ? height : width * 9 / 16
							}}
							ref={ref => {
								this.player = ref;
							}}
							muted={muted}
							volume={1}
							rate={rate}
							paused={paused}
							resizeMode={"contain"}
							onLoad={this.onLoad}
							onBuffer={this.onBuffer}
							onProgress={this.onProgress}
							onEnd={() => {
								return "Done!";
							}}
							repeat={true}
						/>
					</View>
					<View style={styles.videoToolBar}>
						<View style={styles.flexRow}>
							<Iconfont name="browse" size={20} color={Colors.tintFontColor} />
							<Text style={styles.infoText}>15763观看</Text>
						</View>
						<View style={styles.flexRow}>
							<TouchableOpacity style={[styles.flexRow, { marginRight: 20 }]}>
								<Iconfont name="star-outline" size={20} color={Colors.tintFontColor} />
								<Text style={styles.infoText}>收藏</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.flexRow}>
								<Iconfont name="share-square" size={20} color={Colors.tintFontColor} />
								<Text style={styles.infoText}>分享</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.videoInfo}>
						<View style={styles.infoTop}>
							<Text style={styles.title}>标题</Text>
							<Text style={styles.time}>时间</Text>
						</View>
						<View style={styles.content}>
							<Text style={styles.description}>lorem20</Text>
						</View>
					</View>
				</ScrollView>
				{/**
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
				**/}
			</Screen>
		);
	}

	togglePlay() {
		this.setState(prevState => ({
			paused: !prevState.paused
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	videoWrap: {
		overflow: "hidden"
	},
	videoToolBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	infoText: {
		fontSize: 14,
		color: Colors.primaryFontColor,
		marginLeft: 5
	},
	flexRow: {
		flexDirection: "row",
		alignItems: "center"
	},
	videoInfo: {
		paddingHorizontal: 15
	},
	infoTop: {
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	title: {
		fontSize: 22,
		color: Colors.primaryFontColor,
		lineHeight: 30
	},
	time: {
		fontSize: 12,
		color: "#ddd",
		lineHeight: 18
	},
	content: {
		paddingTop: 40
	},
	description: {
		fontSize: 15,
		color: Colors.primaryFontColor,
		lineHeight: 23
	}
});

export default DetailScreen;
