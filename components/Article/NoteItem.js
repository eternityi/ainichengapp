import React, { Component } from "react";
import { StyleSheet, View, Text, Image, FlatList, TouchableWithoutFeedback, TouchableOpacity, Dimensions, TouchableHighlight } from "react-native";
import { withNavigation } from "react-navigation";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { navigationAction } from "../../constants/Methods";
import { Avatar, VideoCover } from "../Pure";
import { CustomPopoverMenu } from "../../components/Modal";

const { width, height } = Dimensions.get("window");
const IMG_INTERVAL = 8;
const IMG_WIDTH = (width - 46) / 3;
const COVER_WIDTH = width - 30;

class NoteItem extends Component {
	render() {
		const {
			post,
			navigation,
			compress,
			longPress = () => null,
			onPress = this.skipScreen,
			popoverMenu,
			options,
			popoverHandler = () => null
		} = this.props;
		let { type, user, time_ago, title, description, category, has_image, images, cover, hits, count_likes, count_replies } = post;
		return (
			<TouchableHighlight underlayColor={Colors.tintGray} onPress={onPress} onLongPress={longPress}>
				<View style={styles.noteContainer}>
					<View style={styles.noteUser}>
						{compress ? (
							<Text style={{ fontSize: 14, color: Colors.tintFontColor }}>{time_ago}</Text>
						) : (
							<View style={styles.userInfo}>
								<TouchableOpacity
									activeOpacity={0.5}
									onPress={() => navigation.dispatch(navigationAction({ routeName: "用户详情", params: { user } }))}
								>
									<Avatar size={28} uri={user.avatar} />
								</TouchableOpacity>
								<Text style={styles.userName}>{user.name}</Text>
							</View>
						)}
						{popoverMenu && (
							<CustomPopoverMenu
								width={110}
								selectHandler={popoverHandler}
								triggerComponent={<Iconfont name={"more-vertical"} size={19} color={Colors.lightFontColor} />}
								options={options}
							/>
						)}
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
								{title ? title : description}
							</Text>
						</View>
					)}
					<View>{has_image && this.renderImage(type, images, cover)}</View>
					{this._renderFooter(category, hits, count_replies, count_likes)}
				</View>
			</TouchableHighlight>
		);
	}

	_renderFooter = (category, hits, count_replies, count_likes) => {
		const { navigation } = this.props;
		return (
			<View style={styles.noteFooter}>
				{category ? (
					<TouchableWithoutFeedback onPress={() => navigation.dispatch(navigationAction({ routeName: "专题详情", params: { category } }))}>
						<View style={styles.layoutFlexRow}>
							<Iconfont name="category-rotate" size={12} color={Colors.lightFontColor} />
							<Text style={styles.categoryName}>{category.name}</Text>
						</View>
					</TouchableWithoutFeedback>
				) : null}
				<View style={styles.layoutFlexRow}>
					<View style={styles.meta}>
						<Iconfont name={"browse"} size={15} color={Colors.lightFontColor} />
						<Text style={styles.count}>{hits || 0}</Text>
					</View>
					<View style={styles.meta}>
						<Iconfont name={"comment"} size={14} color={Colors.lightFontColor} />
						<Text style={styles.count}>{count_replies || 0}</Text>
					</View>
					<View style={styles.meta}>
						<Iconfont name={"like"} size={14} color={Colors.lightFontColor} />
						<Text style={styles.count}>{count_likes || 0}</Text>
					</View>
				</View>
			</View>
		);
	};

	renderImage = (type, images, cover) => {
		if (type == "video") {
			return (
				<View style={styles.coverWrap}>
					<VideoCover width={COVER_WIDTH} height={COVER_WIDTH * 9 / 16} cover={cover} />
				</View>
			);
		} else if (images.length == 1) {
			return (
				<View style={styles.coverWrap}>
					<Image style={styles.cover} source={{ uri: cover }} />
				</View>
			);
		} else if (images.length > 1) {
			return (
				<View style={[styles.gridView, styles.layoutFlexRow]}>
					{images.slice(0, 3).map(function(img, i) {
						if (img) return <Image style={[styles.gridImage, styles.imgWrap]} source={{ uri: img }} key={i} />;
					})}
				</View>
			);
		}
	};

	skipScreen = () => {
		const { post, navigation } = this.props;
		let { type } = post;
		let routeName = type == "video" ? "视频详情" : "文章详情";
		let params = type == "video" ? { video: post } : { article: post };
		navigation.dispatch(navigationAction({ routeName, params }));
	};
}

const styles = StyleSheet.create({
	noteContainer: {
		padding: 15,
		justifyContent: "center",
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	noteUser: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingRight: 5,
		marginBottom: 15
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center"
	},
	userName: {
		fontSize: 14,
		color: Colors.primaryFontColor,
		marginLeft: 6
	},
	cover: {
		width: COVER_WIDTH,
		height: COVER_WIDTH * 0.5,
		resizeMode: "cover"
	},
	gridView: {
		marginLeft: -IMG_INTERVAL
	},
	gridImage: {
		width: IMG_WIDTH,
		height: IMG_WIDTH,
		resizeMode: "cover"
	},
	coverWrap: {
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: Colors.lightBorderColor,
		backgroundColor: Colors.tintGray,
		overflow: "hidden"
	},
	imgWrap: {
		borderWidth: 1,
		borderColor: Colors.lightBorderColor,
		backgroundColor: Colors.tintGray,
		marginLeft: IMG_INTERVAL
	},
	abstract: {
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
	},
	noteFooter: {
		marginTop: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	meta: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 8
	},
	categoryName: {
		fontSize: 12,
		color: Colors.tintFontColor,
		marginLeft: 3
	},
	count: {
		fontSize: 11,
		color: Colors.lightFontColor,
		marginLeft: 3
	},
	layoutFlexRow: {
		flexDirection: "row",
		alignItems: "center"
	}
});

export default withNavigation(NoteItem);
