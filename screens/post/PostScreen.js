import React, { Component } from "react";
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, FlatList, Modal, StatusBar } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

import PostHeader from "./PostHeader";
import Player from "./Player";
import RewardPanel from "./RewardPanel";
import PostBottomTools from "./PostBottomTools";
import Comments from "../article/comment/Comments";
import BeSelectedCategory from "../article/BeSelectedCategory";
import Screen from "../Screen";
import Colors from "../../constants/Colors";
import { imageSize, goContentScreen } from "../../constants/Methods";
import { Iconfont } from "../../utils/Fonts";
import { RewardModal, ShareModal } from "../../components/Modal";
import { LoadingError, SpinnerLoading, BlankContent } from "../../components/Pure";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { Query, Mutation } from "react-apollo";
import { articleQuery } from "../../graphql/article.graphql";

const { width, height } = Dimensions.get("window");

const MAX_WIDTH = width - 30;
const IMG_INTERVAL = 8;
const IMG_SIZE = (MAX_WIDTH - 16) / 3;

class PostScreen extends Component {
	constructor(props) {
		super(props);

		this.handleRewardVisible = this.handleRewardVisible.bind(this);
		this.handleSlideShareMenu = this.handleSlideShareMenu.bind(this);
		this.toggleAddCommentVisible = this.toggleAddCommentVisible.bind(this);
		this.commentsOffsetY = height;
		this.state = {
			rewardVisible: false,
			addCommentVisible: false,
			shareModalVisible: false,
			imageViewerVisible: false,
			initImage: 0 //图片预览模式下首先打开的图片索引
		};
	}

	componentWillUpdate(nextProps, nextState) {}

	render() {
		let { rewardVisible, addCommentVisible, shareModalVisible, imageViewerVisible, initImage } = this.state;
		let { navigation, login } = this.props;
		const post = navigation.getParam("post", {});
		return (
			<Screen>
				<Query query={articleQuery} variables={{ id: post.id }}>
					{({ loading, error, data, refetch }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <SpinnerLoading />;
						if (!(data && data.article)) return <BlankContent />;
						let post = data.article;
						let { body, pictures, user, categories, category, count_tips, count_replies, time_ago, hits } = post;
						this.pictures = pictures.map((elem, index) => {
							return { url: elem.url };
						});
						console.log("post", post);
						return (
							<View style={styles.container}>
								<StatusBar backgroundColor={imageViewerVisible ? "#000" : "#fff"} barStyle={"dark-content"} />
								<PostHeader navigation={navigation} post={post} share={this.handleSlideShareMenu} login={login} />
								<ScrollView
									style={styles.container}
									bounces={false}
									ref={ref => (this.scrollRef = ref)}
									removeClippedSubviews={true}
									keyboardShouldPersistTaps={"handled"}
									scrollEventThrottle={16}
								>
									{post.type == "video" && <Player video={post} navigation={navigation} />}
									<View style={{ padding: 15 }}>
										<View style={{ marginBottom: 15 }}>
											<Text style={styles.body}>{body}</Text>
										</View>
										{pictures.length > 0 && this.renderImages(pictures)}
										{post.type == "article" ? (
											<BeSelectedCategory categories={categories} navigation={navigation} />
										) : (
											category && (
												<View style={{ marginBottom: 10 }}>
													<Text
														style={styles.category}
														onPress={() => goContentScreen(navigation, { ...category, type: "category" })}
													>
														#{category.name}
													</Text>
												</View>
											)
										)}
										<View>
											<Text style={styles.time_ago}>{time_ago}</Text>
										</View>
									</View>
									<RewardPanel
										navigation={navigation}
										rewardUsers={post.tipedUsers}
										rewardDescrib={post.user.tip_words}
										handleRewardVisible={this.handleRewardVisible}
									/>
									<Comments
										addCommentVisible={addCommentVisible}
										article={post}
										navigation={navigation}
										onLayout={this._commentsOnLayout}
										toggleCommentModal={this.toggleAddCommentVisible}
									/>
								</ScrollView>
								<PostBottomTools
									post={post}
									login={login}
									navigation={navigation}
									toggleCommentModal={this.toggleAddCommentVisible}
									handleRewardVisible={this.handleRewardVisible}
									handleSlideShareMenu={this.handleSlideShareMenu}
									scrollToComment={this._scrollToComment}
								/>
								<RewardModal visible={rewardVisible} handleVisible={this.handleRewardVisible} article={post} />
							</View>
						);
					}}
				</Query>
				{/*点击图片预览**/}
				<Modal visible={imageViewerVisible} transparent={true} onRequestClose={() => this.setState({ imageViewerVisible: false })}>
					<ImageViewer
						onClick={() => this.setState({ imageViewerVisible: false })}
						onSwipeDown={() => this.setState({ imageViewerVisible: false })}
						imageUrls={this.pictures}
						index={initImage}
					/>
				</Modal>
				<ShareModal visible={shareModalVisible} toggleVisible={this.handleSlideShareMenu} />
			</Screen>
		);
	}

	renderImages(images) {
		if (images.length == 1) {
			let size = imageSize({ width: images[0].width, height: images[0].height }, MAX_WIDTH);
			return (
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => {
						this.setState({
							imageViewerVisible: true,
							initImage: 0
						});
					}}
				>
					<Image source={{ uri: images[0].url }} style={[{ width: size.width, height: size.height }, styles.singleImage]} />
				</TouchableOpacity>
			);
		} else {
			return (
				<View style={styles.gridView}>
					{this.pictures.map((picture, index) => {
						return (
							<TouchableOpacity
								activeOpacity={1}
								key={index}
								onPress={() => {
									this.setState({
										imageViewerVisible: true,
										initImage: index
									});
								}}
							>
								{
									// TODO：wyk, 需要给图片宽高下面控制下
								}
								<Image source={{ uri: picture.url }} style={[styles.gridImage]} />
							</TouchableOpacity>
						);
					})}
				</View>
			);
		}
	}

	//赞赏模态框开关
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

	//获取评论区域到顶部的高度
	_commentsOnLayout = event => {
		let { x, y, width, height } = event.nativeEvent.layout;
		this.commentsOffsetY = y;
	};

	//滚动到评论顶部
	_scrollToComment = () => {
		this.scrollRef.scrollTo({
			x: 0,
			y: this.commentsOffsetY,
			animated: true
		});
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	body: {
		fontSize: 16,
		lineHeight: 22,
		color: Colors.darkFontColor
	},
	category: {
		fontSize: 15,
		lineHeight: 20,
		color: Colors.themeColor
	},
	time_ago: {
		fontSize: 13,
		color: Colors.tintFontColor
	},
	singleImage: {
		resizeMode: "cover",
		marginBottom: 15
	},
	gridView: {
		flexDirection: "row",
		flexWrap: "nowrap",
		alignItems: "center",
		marginLeft: -IMG_INTERVAL,
		marginTop: -IMG_INTERVAL,
		marginBottom: 15
	},
	gridImage: {
		width: IMG_SIZE,
		height: IMG_SIZE,
		resizeMode: "cover",
		borderWidth: 1,
		borderColor: Colors.lightBorderColor,
		backgroundColor: Colors.tintGray,
		marginLeft: IMG_INTERVAL,
		marginTop: IMG_INTERVAL
	}
});

export default connect(store => {
	return {
		login: store.users.login
	};
})(PostScreen);
