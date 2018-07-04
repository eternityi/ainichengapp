import React, { PureComponent } from "react";
import { StyleSheet, View, Image, Text, Dimensions, FlatList, TouchableHighlight, TouchableWithoutFeedback, ImageBackground } from "react-native";
import { withNavigation } from "react-navigation";

import PostToolBar from "./PostToolBar";
import { Avatar, VideoCover } from "../Pure";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { navigationAction } from "../../constants/Methods";

const { height, width } = Dimensions.get("window");

class PostItem extends PureComponent {
	render() {
		const { post, navigation, toggleShareModal } = this.props;
		let { type, user, time_ago, title, description, images, cover, has_image } = post;
		return (
			<TouchableHighlight underlayColor={Colors.tintGray} onPress={this.skipScreen}>
				<View style={styles.postContainer}>
					<View style={styles.layoutFlexRow}>
						<TouchableWithoutFeedback onPress={() => navigation.navigate("用户详情", { user: user })}>
							<Avatar size={34} uri={user.avatar} />
						</TouchableWithoutFeedback>
						<View style={styles.userInfo}>
							<Text style={styles.userName}>{user.name}</Text>
							<Text style={styles.timeAgo}>{time_ago}</Text>
						</View>
					</View>
					{type == "article" ? (
						<View style={styles.abstract}>
							<Text numberOfLines={2} style={styles.title}>
								{title}
							</Text>
							{description ? (
								<Text numberOfLines={2} style={styles.description}>
									{description}
								</Text>
							) : null}
						</View>
					) : (
						<View style={styles.abstract}>
							<Text numberOfLines={2} style={styles.title}>
								{description ? description : title}
							</Text>
						</View>
					)}
					<View>{has_image && this.renderImage(type, images, cover)}</View>
					<PostToolBar post={post} navigation={navigation} skip={this.skipScreen} toggleShareModal={toggleShareModal} />
				</View>
			</TouchableHighlight>
		);
	}

	renderImage = (type, images, cover) => {
		if (type == "video") {
			return <VideoCover width={IMG_WIDTH} height={IMG_WIDTH * 9 / 16} cover={cover} />;
		} else if (images.length == 1) {
			return (
				<View style={styles.coverView}>
					<Image style={[styles.cover, { resizeMode: "cover" }]} source={{ uri: cover }} />
				</View>
			);
		} else if (images.length > 1) {
			return (
				<View style={[styles.gridView, styles.layoutFlexRow]}>
					{images.slice(0, 3).map(function(img, i) {
						if (img) return <Image style={styles.gridImage} source={{ uri: img }} key={i} />;
					})}
				</View>
			);
		}
	};

	skipScreen = () => {
		const { post, navigation } = this.props;
		let { type } = post;
		let routeName = type == "article" ? "文章详情" : "视频详情";
		let params = type == "article" ? { article: post } : { video: post };
		navigation.dispatch(navigationAction({ routeName, params }));
	};
}

const IMG_WIDTH = width - 30;

const styles = StyleSheet.create({
	postContainer: {
		flex: 1,
		backgroundColor: Colors.skinColor,
		paddingHorizontal: 15,
		paddingTop: 10,
		borderTopWidth: 6,
		borderTopColor: Colors.lightBorderColor
	},
	layoutFlexRow: {
		flexDirection: "row",
		alignItems: "center"
	},
	userInfo: {
		justifyContent: "space-between",
		marginLeft: 10
	},
	userName: {
		fontSize: 14,
		lineHeight: 18,
		color: Colors.primaryFontColor
	},
	timeAgo: {
		fontSize: 12,
		lineHeight: 18,
		color: Colors.tintFontColor
	},
	coverView: {
		position: "relative"
	},
	cover: {
		width: IMG_WIDTH,
		height: IMG_WIDTH * 9 / 16,
		justifyContent: "center",
		alignItems: "center"
	},
	gridView: {
		marginLeft: -8
	},
	gridImage: {
		width: (width - 46) / 3,
		height: (width - 46) / 3,
		marginLeft: 8,
		resizeMode: "cover"
	},
	abstract: {
		marginTop: 15,
		marginBottom: 10
	},
	title: {
		fontSize: 16,
		lineHeight: 22,
		color: Colors.darkFontColor
	},
	description: {
		marginTop: 10,
		fontSize: 14,
		lineHeight: 20,
		color: Colors.tintFontColor
	}
});

export default withNavigation(PostItem);
