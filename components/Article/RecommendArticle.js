import React, { Component } from "react";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { Avatar } from "../Pure";
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { CustomPopoverMenu } from "../../components/Modal";

const { width, height } = Dimensions.get("window");

class RecommendArticle extends Component {
	render() {
		let { article, navigation } = this.props;
		return (
			<View style={styles.article}>
				<View style={styles.top}>
					{article.user && (
						<View style={styles.info}>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("用户详情", {
										user: article.user
									})}
							>
								<Avatar size={28} uri={article.user.avatar} />
							</TouchableOpacity>
							<Text style={styles.authorName}>{article.user.name}</Text>
						</View>
					)}
					<CustomPopoverMenu
						width={110}
						selectHandler={() => null}
						triggerComponent={<Iconfont name={"more-vertical"} size={19} color={Colors.lightFontColor} />}
						options={["不感兴趣"]}
					/>
				</View>
				<View style={styles.main}>
					<View style={styles.content}>
						{article.title ? (
							<View>
								<Text numberOfLines={2} style={styles.title}>
									{article.title}
								</Text>
							</View>
						) : null}
						{article.description ? (
							<View>
								<Text numberOfLines={2} style={styles.abstract}>
									{article.description}
								</Text>
							</View>
						) : null}
						<View style={styles.meta}>
							{article.category ? (
								<TouchableOpacity
									style={styles.category}
									onPress={() =>
										navigation.navigate("专题详情", {
											category: article.category
										})}
								>
									<Text style={styles.catrgoryName}>{article.category.name}</Text>
								</TouchableOpacity>
							) : null}
							<View style={styles.labels}>
								{article.count_comments ? (
									<View style={styles.label}>
										<Iconfont name={"message"} size={14} color={Colors.lightFontColor} />
										<Text style={styles.count}>{article.count_comments}</Text>
									</View>
								) : null}
								{article.count_likes ? (
									<View style={styles.label}>
										<Iconfont name={"like"} size={14} color={Colors.lightFontColor} />
										<Text style={styles.count}>{article.count_likes}</Text>
									</View>
								) : null}
								{article.count_tips ? (
									<View style={styles.label}>
										<Iconfont name={"income"} size={14} color={Colors.lightFontColor} />
										<Text style={styles.count}>{article.count_tips}</Text>
									</View>
								) : null}
							</View>
						</View>
					</View>
					{article.has_image && (
						<View>
							<Image style={styles.image} source={{ uri: article.image_url }} />
						</View>
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	article: {
		height: 180,
		paddingHorizontal: 15,
		justifyContent: "center",
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	top: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingRight: 5
	},
	info: {
		flexDirection: "row",
		alignItems: "center"
	},
	authorName: {
		fontSize: 14,
		color: Colors.primaryFontColor,
		marginLeft: 6
	},
	main: {
		paddingTop: 10,
		flexDirection: "row",
		alignItems: "center"
	},
	content: {
		flex: 1,
		marginRight: 10
	},
	image: {
		marginRight: 5,
		width: 88,
		height: 88,
		resizeMode: "cover",
		borderWidth: 1,
		borderColor: Colors.lightBorderColor,
		borderRadius: 4
	},
	title: {
		fontSize: 17,
		lineHeight: 23,
		color: Colors.darkFontColor
	},
	abstract: {
		marginTop: 8,
		fontSize: 13,
		lineHeight: 19,
		color: Colors.tintFontColor
	},
	meta: {
		marginTop: 6,
		flexDirection: "row",
		alignItems: "center"
	},
	labels: {
		flexDirection: "row",
		alignItems: "center"
	},
	label: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 4
	},
	category: {
		borderWidth: 1,
		borderColor: Colors.themeColor,
		borderRadius: 4,
		height: 20,
		paddingHorizontal: 5,
		justifyContent: "center",
		marginRight: 6
	},
	catrgoryName: {
		fontSize: 11,
		color: Colors.themeColor
	},
	count: {
		fontSize: 11,
		color: Colors.lightFontColor,
		marginLeft: 2
	}
});

export default RecommendArticle;
