import React, { PureComponent } from "react";
import { StyleSheet, View, Image, Text, Dimensions, FlatList, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import { Avatar } from "../Pure";

class HomeArticleItem extends PureComponent {
	render() {
		let { article, navigation } = this.props;
		return (
			<View style={styles.articleContainer}>
				<View style={styles.authorItem}>
					<TouchableOpacity onPress={() => navigation.navigate("用户详情", { user: article.user })}>
						<Avatar size={38} uri={article.user.avatar} />
					</TouchableOpacity>
					<View style={styles.userInfo}>
						<Text style={styles.userName}>{article.user.name}</Text>
						<Text style={styles.timeAgo}>{article.time_ago}</Text>
					</View>
				</View>
				{article.has_image && (
					<View style={styles.imageWrap}>
						<Image style={styles.image} source={{ uri: article.image_url }} />
					</View>
				)}
				<Text numberOfLines={2} style={styles.title}>
					{article.title}
				</Text>
				<Text numberOfLines={3} style={styles.abstract}>
					{" "}
					{article.description}
				</Text>
				<View style={styles.meta}>
					{article.hits > 0 && <Text style={styles.count}>{article.hits + "阅读"}</Text>}
					{article.count_comments > 0 && <Text style={styles.count}>{"· " + article.count_comments + "评论"}</Text>}
					{article.count_likes > 0 && <Text style={styles.count}>{"· " + article.count_likes + "喜欢"}</Text>}
					{article.count_tips > 0 && <Text style={styles.count}>{"· " + article.count_tips + "赞赏"}</Text>}
				</View>
			</View>
		);
	}

	_keyExtractor = (item, index) => (item.key ? item.key : index.toString());
}

var { height, width } = Dimensions.get("window");
width = width - 30;

const styles = StyleSheet.create({
	articleContainer: {
		padding: 15,
		paddingTop: 20,
		borderBottomWidth: 1,
		borderStyle: "solid",
		borderColor: Colors.lightBorderColor
	},
	authorItem: {
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
	imageWrap: {
		marginTop: 12
	},
	image: {
		width,
		height: width * 2 / 5,
		resizeMode: "cover",
		borderRadius: 2
	},
	title: {
		marginTop: 15,
		fontSize: 18,
		lineHeight: 24,
		color: Colors.darkFontColor
	},
	abstract: {
		marginTop: 10,
		fontSize: 14,
		lineHeight: 20,
		color: Colors.tintFontColor
	},
	meta: {
		marginTop: 15,
		flexDirection: "row",
		justifyContent: "flex-end"
	},
	count: {
		fontSize: 14,
		color: Colors.tintFontColor,
		marginLeft: 6
	}
});

export default HomeArticleItem;
