"use strict";
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { userOperationMiddleware, numberFormat } from "../../constants/Methods";

import { likeArticleMutation } from "../../graphql/user.graphql";
import { Query, Mutation } from "react-apollo";

const { width, height } = Dimensions.get("window");

class PostBottomTools extends Component {
	render() {
		const { login, post, toggleCommentModal, scrollToComment, handleRewardVisible, handleSlideShareMenu, navigation } = this.props;
		let { count_replies, liked, count_likes, count_shares } = post;
		return (
			<Mutation mutation={likeArticleMutation}>
				{likeArticle => {
					return (
						<View style={styles.BottomTools}>
							<TouchableOpacity activeOpacity={1} onPress={toggleCommentModal} style={styles.alignItem}>
								<Iconfont name={"modification"} size={22} color={Colors.tintFontColor} />
								<Text style={styles.inputText}>说点啥呗...</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={scrollToComment} style={styles.toolItem}>
								<Iconfont name={"comment-outline"} size={22} color={Colors.darkFontColor} />
								<Text style={styles.countText}> {numberFormat(count_replies) || 0}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.toolItem}
								onPress={() =>
									userOperationMiddleware({
										login,
										action: () => {
											likeArticle({
												variables: {
													article_id: post.id,
													undo: liked
												}
											});
										},
										navigation
									})
								}
							>
								<Iconfont name={liked ? "like" : "like-outline"} size={21} color={liked ? Colors.themeColor : Colors.darkFontColor} />
								<Text style={styles.countText}> {numberFormat(count_likes) || 0}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={handleSlideShareMenu} style={styles.toolItem}>
								<Iconfont name={"share-cycle"} size={19} color={Colors.darkFontColor} />
								<Text style={styles.countText}>{numberFormat(count_shares) || 0}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={handleRewardVisible}>
								<Iconfont name={"reward"} size={30} color={Colors.qqzoneColor} />
							</TouchableOpacity>
						</View>
					);
				}}
			</Mutation>
		);
	}
}

const styles = StyleSheet.create({
	BottomTools: {
		width,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorderColor,
		backgroundColor: Colors.skinColor,
		flexDirection: "row",
		alignItems: "center"
	},
	alignItem: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center"
	},
	inputText: {
		marginLeft: 15,
		fontSize: 14,
		color: Colors.tintFontColor
	},
	toolItem: {
		width: 42,
		height: 42,
		paddingVertical: 6,
		marginRight: 10,
		position: "relative",
		justifyContent: "center",
		alignItems: "flex-start"
	},
	countText: {
		position: "absolute",
		right: 0,
		top: -2,
		fontSize: 12,
		color: Colors.primaryFontColor
	}
});

export default PostBottomTools;
