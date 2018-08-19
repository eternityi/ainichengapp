import React, { Component } from "react";
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, FlatList, Modal, StatusBar } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import HTML from "react-native-render-html";

import Screen from "../Screen";
import Colors from "../../constants/Colors";
import { imageSize } from "../../constants/Methods";
import { Iconfont } from "../../utils/Fonts";
import PostHeader from "./PostHeader";
import RewardPanel from "../article/RewardPanel";
import ArticleBottomTools from "../article/ArticleBottomTools";
import Comments from "../article/comment/Comments";
import { UserGroup } from "../../components/MediaGroup";
import { RewardModal, ShareModal } from "../../components/Modal";
import { LoadingError, SpinnerLoading, BlankContent } from "../../components/Pure";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { Query, Mutation } from "react-apollo";
import { articleQuery } from "../../graphql/article.graphql";

const { width, height } = Dimensions.get("window");

const MAX_WIDTH = width - 30;
let IMG_WIDTH = MAX_WIDTH;
let IMG_HEIGHT = MAX_WIDTH;
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
						let { body, pictures, user, count_tips, count_replies, time_ago, hits } = post;
						this.images = pictures.map((elem, index) => {
							return {
								url: elem.url,
								width: elem.width,
								height: elem.height
							};
						});
						return (
							<View style={styles.container}>
								<StatusBar backgroundColor={imageViewerVisible ? "#000" : "#fff"} barStyle={"dark-content"} />
								<PostHeader navigation={navigation} post={post} share={this.handleSlideShareMenu} login={login} />
								<ScrollView
									style={styles.container}
									ref={ref => (this.scrollRef = ref)}
									removeClippedSubviews={true}
									keyboardShouldPersistTaps={"handled"}
									scrollEventThrottle={16}
								>
									<View style={{ padding: 15 }}>
										<View style={{ marginBottom: 15 }}>
											<UserGroup navigation={navigation} customStyle={{ avatar: 34, nameSize: 15 }} user={user} plain />
										</View>
										<View style={{ marginBottom: 15 }}>
											<Text style={styles.body}>{body}</Text>
										</View>
										{pictures.length > 0 && this.renderImages(pictures)}
									</View>
									<Comments
										addCommentVisible={addCommentVisible}
										article={post}
										navigation={navigation}
										onLayout={this._commentsOnLayout.bind(this)}
										toggleCommentModal={this.toggleAddCommentVisible}
									/>
								</ScrollView>
								{/*文章底部工具**/}
								<ArticleBottomTools
									rewards={count_tips}
									comments={count_replies}
									article={post}
									showWrite
									toggleCommentModal={this.toggleAddCommentVisible}
									handleRewardVisible={this.handleRewardVisible}
									handleSlideShareMenu={this.handleSlideShareMenu}
									commentHandler={this._scrollToComments.bind(this)}
									navigation={navigation}
									login={login}
								/>
								{/*赞赏模态框**/}
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
						imageUrls={this.images}
						index={initImage}
					/>
				</Modal>
				<ShareModal visible={shareModalVisible} toggleVisible={this.handleSlideShareMenu} />
			</Screen>
		);
	}

	renderImages(pictures) {
		if (pictures.length == 1) {
			let picture = pictures[0];
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
					<Image source={{ uri: picture.url }} style={[{ width: IMG_WIDTH, height: IMG_HEIGHT }, styles.singleImage]} />
				</TouchableOpacity>
			);
		} else {
			return (
				<View style={styles.gridView}>
					{pictures.map((picture, index) => {
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

	// getImageSize = uri => {
	// 	Image.getSize(
	// 		uri,
	// 		(width, height) => {
	// 			if (width > height) {
	// 				IMG_WIDTH = MAX_WIDTH;
	// 				IMG_HEIGHT = (IMG_WIDTH * height) / width;
	// 			} else {
	// 				IMG_HEIGHT = MAX_WIDTH;
	// 				IMG_WIDTH = (IMG_HEIGHT * width) / height;
	// 			}
	// 			this.setState({ imageSize: { width: IMG_WIDTH, height: IMG_HEIGHT } });
	// 		},
	// 		error => {
	// 			console.log(error);
	// 		}
	// 	);
	// };

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

	//获取评论区域到顶部的高度
	_commentsOnLayout(event) {
		let { x, y, width, height } = event.nativeEvent.layout;
		this.commentsOffsetY = y;
	}

	//滚动到评论顶部
	_scrollToComments() {
		this.scrollRef.scrollTo({
			x: 0,
			y: this.commentsOffsetY,
			animated: true
		});
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
	metaText: {
		fontSize: 12,
		color: Colors.tintFontColor
	},
	body: {
		fontSize: 16,
		lineHeight: 22,
		color: Colors.primaryFontColor
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
