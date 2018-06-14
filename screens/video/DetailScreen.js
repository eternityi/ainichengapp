import React, { Component } from "react";
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, FlatList } from "react-native";
import VideoPlayer from "react-native-video-controls";
import KeyboardSpacer from "react-native-keyboard-spacer";

import Screen from "../Screen";
import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import { UserMetaGroup } from "../../components/MediaGroup";

import RewardPanel from "../article/RewardPanel";
import ArticleBottomTools from "../article/ArticleBottomTools";
import Comments from "../article/comment/Comments";
import { RewardModal, AddCommentModal, ReplyCommentModal, ShareModal } from "../../components/Modal";
import { LoadingError, SpinnerLoading, BlankContent } from "../../components/Pure";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { Query, Mutation } from "react-apollo";
import { articleQuery } from "../../graphql/article.graphql";
import { likeArticleMutation } from "../../graphql/user.graphql";
import { commentsQuery, addCommentMutation } from "../../graphql/comment.graphql";

const { width, height } = Dimensions.get("window");

class DetailScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.onProgress = this.onProgress.bind(this);
		this.onBuffer = this.onBuffer.bind(this);
		this.togglePlay = this.togglePlay.bind(this);
		this.handleRewardVisible = this.handleRewardVisible.bind(this);
		this.handleSlideShareMenu = this.handleSlideShareMenu.bind(this);
		this.toggleAddCommentVisible = this.toggleAddCommentVisible.bind(this);
		this.state = {
			fullScreen: false,
			rate: 1,
			paused: true,
			volume: 1,
			muted: false,
			duration: 0,
			currentTime: 0,
			isBuffering: false,
			footOffsetHeight: height,
			commentsOffsetHeight: height,
			replyCommentVisible: false,
			addCommentVisible: false,
			rewardVisible: false,
			shareModalVisible: false,
			reply: false,
			replyingComment: null
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
		let {
			fullScreen,
			rate,
			paused,
			muted,
			ignoreSilentSwitch,
			replyingComment,
			rewardVisible,
			replyCommentVisible,
			addCommentVisible,
			shareModalVisible
		} = this.state;
		let { navigation, login } = this.props;
		return (
			<Screen>
				<Query query={articleQuery} variables={{ id: 1102 }}>
					{({ loading, error, data, refetch }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <SpinnerLoading />;
						if (!(data && data.article)) return <BlankContent />;
						let article = data.article;
						return (
							<View style={styles.container}>
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
										navigator={navigation}
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
										onLoad={this.onLoad.bind(this)}
										onBuffer={this.onBuffer.bind(this)}
										onProgress={this.onProgress.bind(this)}
										onEnd={() => {
											return "Done!";
										}}
										repeat={true}
									/>
								</View>
								<ScrollView style={styles.container}>
									<View style={styles.topInfo}>
										<View style={styles.userInfo}>
											<UserMetaGroup user={article.user} navigation={navigation} />
										</View>
										<View>
											<Text style={styles.title} NumberOfLines={2}>
												{article.title}
											</Text>
										</View>
									</View>
									<View style={styles.topOperation}>
										<TouchableOpacity style={styles.operationItem}>
											<Iconfont name="star-outline" size={20} color={Colors.tintFontColor} />
											<Text style={styles.operationItemText}>收藏</Text>
										</TouchableOpacity>
										<TouchableOpacity onPress={this.handleRewardVisible} style={styles.operationItem}>
											<Iconfont name="reward" size={22} color={Colors.tintFontColor} />
											<Text style={styles.operationItemText}>赞赏</Text>
										</TouchableOpacity>
										<TouchableOpacity onPress={this.handleSlideShareMenu} style={styles.operationItem}>
											<Iconfont name="share-square" size={16} color={Colors.tintFontColor} />
											<Text style={styles.operationItemText}>分享</Text>
										</TouchableOpacity>
									</View>
									<Comments
										article={article}
										navigation={navigation}
										toggleCommentModal={this.toggleAddCommentVisible}
										toggleReplyComment={comment => {
											if (login) {
												this.setState(prevState => ({
													replyCommentVisible: !prevState.replyCommentVisible,
													replyingComment: comment
												}));
											} else {
												navigation.navigate("登录注册");
											}
										}}
									/>
								</ScrollView>
								{/*文章底部工具**/}
								<View style={styles.bottomTools}>
									<TouchableOpacity onPress={() => null}>
										<Iconfont
											name={article.liked ? "like" : "like-outline"}
											color={article.liked ? Colors.themeColor : Colors.tintFontColor}
											size={20}
										/>
									</TouchableOpacity>
									<TouchableOpacity onPress={this.toggleAddCommentVisible} style={styles.commentInput}>
										<Text style={{ fontSize: 13, color: Colors.lightFontColor }}>说点什么吧</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={this.handleRewardVisible}>
										<Iconfont name="reward" color={Colors.tintFontColor} size={22} />
									</TouchableOpacity>
								</View>
								{/*赞赏模态框**/}
								<RewardModal visible={rewardVisible} handleVisible={this.handleRewardVisible} />
								{/*添加评论**/}
								<Mutation mutation={addCommentMutation}>
									{addComment => {
										return (
											<AddCommentModal
												article={article}
												visible={addCommentVisible}
												toggleCommentModal={this.toggleAddCommentVisible}
												addComment={({ body }) => {
													if (!body) return null;
													addComment({
														variables: {
															commentable_id: article.id,
															body
														},
														refetchQueries: addComment => [
															{
																query: commentsQuery,
																variables: {
																	article_id: article.id,
																	order: "LATEST_FIRST",
																	filter: "ALL"
																}
															}
														],
														update: (cache, { data: { addComment } }) => {
															let data = cache.readQuery({
																query: articleQuery,
																variables: { id: article.id }
															});
															let prev_article = data.article;
															cache.writeQuery({
																query: articleQuery,
																variables: { id: article.id },
																data: {
																	article: Object.assign({}, prev_article, {
																		count_comments: prev_article.count_comments + 1
																	})
																}
															});
														}
													});
												}}
											/>
										);
									}}
								</Mutation>
								{/*回复评论**/}
								<Mutation mutation={addCommentMutation}>
									{replyComment => {
										return (
											<ReplyCommentModal
												visible={replyCommentVisible}
												toggleReplyComment={() => {
													if (login) {
														this.setState(prevState => ({
															replyCommentVisible: !prevState.replyCommentVisible
														}));
													} else {
														navigation.navigate("登录注册");
													}
												}}
												replyingComment={this.state.replyingComment}
												atUser={this.state.replyingComment ? this.state.replyingComment.user : null}
												replyComment={({ body, replyingComment, atUser }) => {
													//验证是否为空
													if (!(body.length > atUser.name.length + 2)) return null;
													replyComment({
														variables: {
															commentable_id: article.id,
															body,
															comment_id: replyingComment.id,
															at_uid: atUser.id
														},
														refetchQueries: addComment => [
															{
																query: commentsQuery,
																variables: {
																	article_id: article.id,
																	order: "LATEST_FIRST",
																	filter: "ALL"
																}
															}
														]
													});
												}}
											/>
										);
									}}
								</Mutation>
							</View>
						);
					}}
				</Query>
				<ShareModal visible={shareModalVisible} toggleVisible={this.handleSlideShareMenu} />
			</Screen>
		);
	}

	togglePlay() {
		this.setState(prevState => ({
			paused: !prevState.paused
		}));
	}

	handleRewardVisible() {
		let { login, navigation } = this.props;
		if (login) {
			this.setState(prevState => ({ rewardVisible: !prevState.rewardVisible }));
		} else {
			navigation.navigate("登录注册");
		}
	}

	//评论模态框开关
	toggleAddCommentVisible() {
		let { login, navigation } = this.props;
		if (login) {
			this.setState(prevState => ({
				addCommentVisible: !prevState.addCommentVisible
			}));
		} else {
			navigation.navigate("登录注册");
		}
	}

	//分享slide
	handleSlideShareMenu() {
		this.setState(prevState => ({
			shareModalVisible: !prevState.shareModalVisible
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	videoWrap: {
		overflow: "hidden",
		height: width * 9 / 16
	},
	topInfo: {
		padding: 10
	},
	title: {
		marginTop: 10,
		fontSize: 18,
		fontWeight: "500",
		lineHeight: 24,
		color: Colors.darkFontColor
	},
	topOperation: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginVertical: 20
	},
	operationItem: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	operationItemText: {
		fontSize: 14,
		color: Colors.primaryFontColor,
		marginLeft: 5
	},
	bottomTools: {
		padding: 8,
		flexDirection: "row",
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorderColor,
		backgroundColor: Colors.tintGray
	},
	commentInput: {
		flex: 1,
		height: 34,
		borderRadius: 3,
		justifyContent: "center",
		marginHorizontal: 8,
		backgroundColor: Colors.skinColor
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

export default connect(store => {
	return {
		login: store.users.login
	};
})(DetailScreen);
