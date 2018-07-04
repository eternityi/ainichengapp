import React, { Component } from "react";
import { StyleSheet, View, Text, Image, FlatList, TouchableWithoutFeedback, Dimensions, TouchableHighlight } from "react-native";
import { withNavigation } from "react-navigation";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { navigationAction } from "../../constants/Methods";
import { Avatar, VideoCover } from "../Pure";
import { CustomPopoverMenu } from "../../components/Modal";

const { width, height } = Dimensions.get("window");
let IMAGE_WIDTH = (width - 46) / 3;

class NoteItem extends Component {
	render() {
		const { post, navigation } = this.props;
		let { type, user, time_ago, title, description, category, has_image, images, cover, hits, count_likes, count_comments } = post;
		let layout = images.length > 1 ? "vertical" : "horizontal";
		return (
			<TouchableHighlight underlayColor={Colors.tintGray} onPress={this.skipScreen}>
				<View style={styles.noteContainer}>
					<View style={styles.noteUser}>
						{user && (
							<View style={styles.userInfo}>
								<TouchableWithoutFeedback
									onPress={() => navigation.dispatch(navigationAction({ routeName: "用户详情", params: { user } }))}
								>
									<Avatar size={28} uri={user.avatar} />
								</TouchableWithoutFeedback>
								<Text style={styles.userName}>{user.name}</Text>
							</View>
						)}
						<CustomPopoverMenu
							width={110}
							selectHandler={() => null}
							triggerComponent={<Iconfont name={"more-vertical"} size={19} color={Colors.lightFontColor} />}
							options={["不感兴趣"]}
						/>
					</View>
					<View>
						<View style={[styles.noteBody, layout == "horizontal" && styles.layoutFlexRow]}>
							{type == "article" ? (
								<View>
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
								<View>
									<Text numberOfLines={2} style={styles.title}>
										{description ? description : title}
									</Text>
								</View>
							)}
							<View style={{ marginTop: 5 }}>{this._renderCover(layout, has_image, type, cover, images)}</View>
						</View>
						<View style={styles.noteFooter}>
							{category ? (
								<TouchableWithoutFeedback
									onPress={() => navigation.dispatch(navigationAction({ routeName: "专题详情", params: { category } }))}
								>
									<View style={styles.category}>
										<Iconfont name="category-rotate" size={12} color={Colors.themeColor} />
										<Text style={styles.categoryName}>{category.name}</Text>
									</View>
								</TouchableWithoutFeedback>
							) : null}
							<View style={styles.noteMeta}>
								<View style={styles.meta}>
									<Iconfont name={"browse-outline"} size={15} color={Colors.lightFontColor} />
									<Text style={styles.count}>{hits || 0}</Text>
								</View>
								<View style={styles.meta}>
									<Iconfont name={"comment-outline"} size={15} color={Colors.lightFontColor} />
									<Text style={styles.count}>{count_comments || 0}</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	}

	_renderCover = (layout, has_image, type, cover, images) => {
		if (layout == "horizontal") {
			if (has_image) {
				if (type == "video") {
					return (
						<VideoCover
							width={IMAGE_WIDTH}
							height={IMAGE_WIDTH}
							cover={cover}
							markWidth={32}
							markSize={16}
							customStyle={{ borderRadius: 5, marginLeft: 10 }}
						/>
					);
				} else {
					return <Image style={[styles.noteCover, { borderRadius: 5, marginLeft: 10 }]} source={{ uri: cover }} />;
				}
			}
		} else {
			if (type == "video") {
				return (
					<View style={[styles.gridView, styles.layoutFlexRow]}>
						{images.slice(0, 3).map(function(img, i) {
							if (img)
								return (
									<VideoCover
										key={i}
										width={IMAGE_WIDTH}
										height={IMAGE_WIDTH}
										cover={img}
										markWidth={32}
										markSize={16}
										customStyle={{ marginLeft: 8 }}
									/>
								);
						})}
					</View>
				);
			} else {
				return (
					<View style={[styles.gridView, styles.layoutFlexRow]}>
						{images.slice(0, 3).map(function(img, i) {
							if (img) return <Image key={i} style={[styles.noteCover, { marginLeft: 8 }]} source={{ uri: img }} key={i} />;
						})}
					</View>
				);
			}
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

const styles = StyleSheet.create({
	noteContainer: {
		padding: 15,
		justifyContent: "center",
		borderBottomWidth: 6,
		borderBottomColor: Colors.lightBorderColor
	},
	noteUser: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingRight: 5
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
	layoutFlexRow: {
		flexDirection: "row",
		alignItems: "center"
	},
	noteCover: {
		width: IMAGE_WIDTH,
		height: IMAGE_WIDTH,
		resizeMode: "cover"
	},
	gridView: {
		marginLeft: -8,
		marginTop: 5
	},
	title: {
		marginTop: 10,
		fontSize: 17,
		lineHeight: 23,
		color: Colors.darkFontColor
	},
	description: {
		marginTop: 10,
		fontSize: 13,
		lineHeight: 19,
		color: Colors.tintFontColor
	},
	noteFooter: {
		marginTop: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	noteMeta: {
		flexDirection: "row",
		alignItems: "center"
	},
	meta: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 8
	},
	category: {
		flexDirection: "row",
		alignItems: "center"
	},
	categoryName: {
		fontSize: 12,
		color: Colors.themeColor,
		marginLeft: 3
	},
	count: {
		fontSize: 11,
		color: Colors.lightFontColor,
		marginLeft: 3
	}
});

export default NoteItem;
