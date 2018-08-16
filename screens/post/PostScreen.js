import React, { Component } from "react";
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, FlatList, Modal, StatusBar } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import HTML from "react-native-render-html";

import Screen from "../Screen";
import Colors from "../../constants/Colors";
import { imageSize } from "../../constants/Methods";
import { Iconfont } from "../../utils/Fonts";
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

const MAX_LENGTH = width - 30;
const IMG_WIDTH = MAX_LENGTH;
const IMG_HEIGHT = MAX_LENGTH;
const IMG_INTERVAL = 8;
const IMG_SIZE = (MAX_LENGTH - 16) / 3;

class PostScreen extends Component {
	constructor(props) {
		super(props);

		this.handleRewardVisible = this.handleRewardVisible.bind(this);
		this.handleSlideShareMenu = this.handleSlideShareMenu.bind(this);
		this.toggleAddCommentVisible = this.toggleAddCommentVisible.bind(this);
		this.commentsOffsetY = height;
		this.state = {
			addCommentVisible: false,
			rewardVisible: false,
			shareModalVisible: false,
			imageViewerVisible: false,
			imageSize: { width: MAX_LENGTH, height: MAX_LENGTH },
			initImage: 0 //图片预览模式下首先打开的图片索引
		};
	}

	render() {
		let { rewardVisible, addCommentVisible, shareModalVisible, imageViewerVisible, initImage } = this.state;
		let { navigation, login } = this.props;
		const article = navigation.getParam("article", {});
		return (
			<Screen>
				<Query query={articleQuery} variables={{ id: article.id }}>
					{({ loading, error, data, refetch }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (loading) return <SpinnerLoading />;
						if (!(data && data.article)) return <BlankContent />;
						let article = data.article;
						let { body, images, user, count_tips, count_replies } = article;
						this.images = images.map((elem, index) => {
							return { url: elem };
						});
						this.getImageSize(images[0]);
						return (
							<View style={styles.container}>
								<StatusBar backgroundColor={imageViewerVisible ? "#000" : "#fff"} barStyle={"dark-content"} />
								<ScrollView
									style={styles.container}
									ref={ref => (this.scrollRef = ref)}
									removeClippedSubviews={true}
									keyboardShouldPersistTaps={"handled"}
									scrollEventThrottle={16}
								>
									<View style={{ paddingHorizontal: 20 }}>
										<View style={{ marginTop: 20 }}>
											<UserGroup navigation={navigation} customStyle={{ avatar: 34, nameSize: 15 }} user={user} plain />
											<View>
												<Text style={styles.body}>{body}</Text>
											</View>
											{this.renderImages(images)}
										</View>
										<Comments
											addCommentVisible={addCommentVisible}
											article={article}
											navigation={navigation}
											onLayout={this._commentsOnLayout.bind(this)}
											toggleCommentModal={this.toggleAddCommentVisible}
										/>
									</View>
								</ScrollView>
								{/*文章底部工具**/}
								<ArticleBottomTools
									rewards={count_tips}
									comments={count_replies}
									article={article}
									showWrite
									toggleCommentModal={this.toggleAddCommentVisible}
									handleRewardVisible={this.handleRewardVisible}
									handleSlideShareMenu={this.handleSlideShareMenu}
									commentHandler={this._scrollToComments.bind(this)}
									navigation={navigation}
									login={login}
								/>
								{/*赞赏模态框**/}
								<RewardModal visible={rewardVisible} handleVisible={this.handleRewardVisible} article={article} />
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

	renderImages(images) {
		if (images.length == 1) {
			let { imageSize } = this.state;
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
					<Image source={{ uri: images[0] }} style={[{ width: imageSize.width, height: imageSize.height }, styles.singleImage]} />
				</TouchableOpacity>
			);
		} else {
			return (
				<View style={styles.gridView}>
					{images.map((elem, index) => {
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
								<Image source={{ uri: elem }} style={styles.gridImage} />
							</TouchableOpacity>
						);
					})}
				</View>
			);
		}
	}

	getImageSize = uri => {
		console.log(uri);
		Image.getSize(
			uri,
			(width, height) => {
				if (width > height) {
					IMG_HEIGHT = (height * MAX_LENGTH) / width;
				} else {
					MAX_LENGTH = (width * MAX_LENGTH) / height;
				}
				this.setState({ imageSize: { width: IMG_WIDTH, height: IMG_HEIGHT } });
			},
			error => {
				console.log(error);
			}
		);
	};

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
	body: {
		fontSize: 16,
		lineHeight: 22,
		marginBottom: 20,
		color: Colors.primaryFontColor
	},
	singleImage: {
		resizeMode: "cover",
		marginBottom: 20
	},
	gridView: {
		flexDirection: "row",
		flexWrap: "nowrap",
		alignItems: "center",
		marginLeft: -IMG_INTERVAL,
		marginBottom: 20
	},
	gridImage: {
		width: IMG_SIZE,
		height: IMG_SIZE,
		resizeMode: "cover",
		borderWidth: 1,
		borderColor: Colors.lightBorderColor,
		backgroundColor: Colors.tintGray,
		marginLeft: IMG_INTERVAL,
		marginBottom: IMG_INTERVAL
	}
});

export default PostScreen;
