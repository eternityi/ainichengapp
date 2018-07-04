import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView, FlatList } from "react-native";
import { connect } from "react-redux";

import Screen from "../Screen";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import Config from "../../constants/Config";
import { Avatar, ContentEnd, LoadingMore, LoadingError, SpinnerLoading, BlankContent } from "../../components/Pure";
import { Header } from "../../components/Header";

import { userActionsQuery } from "../../graphql/user.graphql";
import { Query, Mutation } from "react-apollo";

class ActionsScreen extends Component {
	constructor(props) {
		super(props);
		this.user = props.navigation.getParam("user", {});
		this.self = props.navigation.getParam("self", false);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		let { navigation } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header routeName={this.self ? "我的动态" : "TA的动态"} />
					<Query query={userActionsQuery} variables={{ user_id: this.user.id }}>
						{({ loading, error, data, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.actions)) return <SpinnerLoading />;
							if (data.actions.length < 1) return <BlankContent />;
							return (
								<View style={styles.activityWrap}>
									<FlatList
										style={styles.activityList}
										data={data.actions}
										refreshing={loading}
										onRefresh={() => {
											fetch();
										}}
										keyExtractor={(item, index) => index.toString()}
										renderItem={this._renderItem}
										onEndReachedThreshold={0.3}
										onEndReached={() => {
											if (data.actions) {
												fetchMore({
													variables: {
														offset: data.actions.length
													},
													updateQuery: (prev, { fetchMoreResult }) => {
														if (!(fetchMoreResult && fetchMoreResult.actions && fetchMoreResult.actions.length > 0)) {
															this.setState({
																fetchingMore: false
															});
															return prev;
														}
														return Object.assign({}, prev, {
															actions: [...prev.actions, ...fetchMoreResult.actions]
														});
													}
												});
											} else {
												this.setState({
													fetchingMore: false
												});
											}
										}}
										ListFooterComponent={() => {
											return (
												<View style={{ paddingBottom: 25, backgroundColor: "#fff" }}>
													{this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />}
												</View>
											);
										}}
									/>
								</View>
							);
						}}
					</Query>
				</View>
			</Screen>
		);
	}

	_renderItem = ({ item, index }) => {
		let action = item;
		return (
			<View style={styles.activity}>
				<View>
					<Avatar size={24} uri={user.avatar} borderStyle={{ borderWidth: 0 }} />
					<View>
						<Text style={styles.tintText}>{this.user.name}</Text>
					</View>
					<View>
						<Text style={styles.tintText}>{this._activityType(action)}</Text>
					</View>
					<View>
						<Text style={styles.tintText}>{action.time_ago}</Text>
					</View>
				</View>
				<View style={styles.activityBody}>{this._actionItem(action)}</View>
			</View>
		);
	};

	_activityType = action => {
		switch (action.type) {
			// case "signUp":
			// 	return `加入${Config.AppName}`;
			// 	break;
			case "articles":
				let articles = action.postedArticle;
				if (articles && articles.type) {
					if (articles.type == "article") {
						return "创作了文章";
					} else if (articles.type == "video") {
						return "创作了视频";
					} else {
						return "发布了动态";
					}
				}
				break;
			case "comments":
				let postedComment = action.postedComment;
				if (postedComment && postedComment.article && postedComment.article.type) {
					if (postedComment.article.type == "article") {
						return "评论了文章";
					} else if (postedComment.article.type == "video") {
						return "评论了视频";
					} else {
						return "评论了动态";
					}
				}
				break;
			case "follows":
				let followed = action.followed;
				if (followed) {
					if (followed.user) {
						return "关注了用户";
					} else if (followed.category) {
						return "关注了专题";
					} else {
						return "关注了文集";
					}
				}
				break;
			case "likes":
				let liked = action.liked;
				if (liked) {
					if (liked.article) {
						if (liked.article.type == "article") {
							return "喜欢了文章";
						} else if (liked.article.type == "video") {
							return "喜欢了视频";
						} else {
							return "喜欢了动态";
						}
					} else {
						return "赞了评论";
					}
				}
				break;
			case "tips":
				let tiped = action.tiped;
				if (tiped && tiped.article) {
					if (tiped.article.type == "article") {
						return "赞赏了文章";
					} else if (tiped.article.type == "video") {
						return "赞赏了视频";
					} else {
						return "赞赏了动态";
					}
				}
				break;
			default:
				return "";
		}
	};

	// _actionItem = action => {
	// 	let { navigation } = this.props;
	// 	switch (action.type) {
	// 		case "users":
	// 			return (
	// 				<View>
	// 					<Text style={styles.activityText}>
	// 						{this.user.name}
	// 						{" 注册新用户"}
	// 					</Text>
	// 				</View>
	// 			);
	// 			break;
	// 		case "comments":
	// 			return (
	// 				<View style={{ flex: 1 }}>
	// 					<View>
	// 						<Text style={styles.activityText}>
	// 							{this.user.name + " 评论了文章 "}
	// 							<Text
	// 								style={{ color: Colors.linkColor }}
	// 								onPress={() =>
	// 									navigation.navigate("文章详情", {
	// 										article: action.postedComment.article
	// 									})}
	// 							>
	// 								{action.postedComment.article.title}
	// 							</Text>
	// 						</Text>
	// 					</View>
	// 					<TouchableWithoutFeedback
	// 						onPress={() =>
	// 							navigation.navigate("评论详情", {
	// 								comment: action.postedComment
	// 							})}
	// 					>
	// 						<View style={styles.commentBox}>
	// 							<Text numberOfLines={3} style={styles.commentText}>
	// 								{action.postedComment.atUser && (
	// 									<Text
	// 										style={{ color: Colors.linkColor, lineHeight: 20 }}
	// 										onPress={() =>
	// 											navigation.navigate("用户详情", {
	// 												user: action.postedComment.atUser
	// 											})}
	// 									>
	// 										@{action.postedComment.atUser.name + " "}
	// 									</Text>
	// 								)}
	// 								{action.postedComment.body}
	// 							</Text>
	// 						</View>
	// 					</TouchableWithoutFeedback>
	// 				</View>
	// 			);
	// 			break;
	// 		case "tips":
	// 			return (
	// 				<View>
	// 					<Text style={styles.activityText}>
	// 						{this.user.name + " 赞赏了文章 "}
	// 						<Text
	// 							style={{ color: Colors.linkColor }}
	// 							onPress={() =>
	// 								navigation.navigate("文章详情", {
	// 									article: action.tiped.article
	// 								})}
	// 						>
	// 							{action.tiped.article.title}
	// 						</Text>
	// 					</Text>
	// 				</View>
	// 			);
	// 			break;
	// 		case "likes":
	// 			return (
	// 				<View>
	// 					{action.liked.article && (
	// 						<View>
	// 							<Text style={styles.activityText}>
	// 								{this.user.name + " 喜欢了文章 "}
	// 								<Text
	// 									style={{ color: Colors.linkColor }}
	// 									onPress={() =>
	// 										navigation.navigate("文章详情", {
	// 											articleId: action.liked.article.id
	// 										})}
	// 								>
	// 									{action.liked.article.title}
	// 								</Text>
	// 							</Text>
	// 						</View>
	// 					)}
	// 					{action.liked.comment && (
	// 						<View style={{ flex: 1 }}>
	// 							<View>
	// 								<Text style={styles.activityText}>
	// 									{this.user.name + " 赞了 "}
	// 									<Text
	// 										style={{ color: Colors.linkColor }}
	// 										onPress={() =>
	// 											navigation.navigate("用户详情", {
	// 												user: action.liked.comment.user
	// 											})}
	// 									>
	// 										{action.liked.comment.user.name}
	// 									</Text>
	// 									{" 在文章 "}
	// 									<Text
	// 										style={{ color: Colors.linkColor }}
	// 										onPress={() =>
	// 											navigation.navigate("文章详情", {
	// 												article: action.liked.comment.article
	// 											})}
	// 									>
	// 										{action.liked.comment.article.title}
	// 									</Text>
	// 									{" 的评论"}
	// 								</Text>
	// 							</View>
	// 							<TouchableWithoutFeedback
	// 								onPress={() =>
	// 									navigation.navigate("评论详情", {
	// 										comment: action.liked.comment
	// 									})}
	// 							>
	// 								<View style={styles.commentBox}>
	// 									<Text numberOfLines={3} style={styles.commentText}>
	// 										{action.liked.comment.body}
	// 									</Text>
	// 								</View>
	// 							</TouchableWithoutFeedback>
	// 						</View>
	// 					)}
	// 				</View>
	// 			);
	// 			break;
	// 		case "articles":
	// 			return (
	// 				<View style={{ flex: 1 }}>
	// 					<View>
	// 						<Text style={styles.activityText}>
	// 							{this.user.name + " 发表了文章 "}
	// 							<Text
	// 								style={{ color: Colors.linkColor }}
	// 								onPress={() =>
	// 									navigation.navigate("文章详情", {
	// 										article: action.postedArticle
	// 									})}
	// 							>
	// 								{action.postedArticle.title}
	// 							</Text>
	// 						</Text>
	// 					</View>
	// 					<TouchableWithoutFeedback
	// 						onPress={() =>
	// 							navigation.navigate("文章详情", {
	// 								article: action.postedArticle
	// 							})}
	// 					>
	// 						<View style={styles.commentBox}>
	// 							<Text numberOfLines={6} style={styles.commentText}>
	// 								{action.postedArticle.description}
	// 							</Text>
	// 						</View>
	// 					</TouchableWithoutFeedback>
	// 				</View>
	// 			);
	// 			break;
	// 		case "follows":
	// 			if (!action.followed) return null;

	// 			let routeName = "专题详情";
	// 			let params = { category: action.followed.category };
	// 			if (action.followed.collection) {
	// 				routeName = "文集详情";
	// 				params = { collection: action.followed.collection };
	// 			}
	// 			if (action.followed.user) {
	// 				routeName = "用户详情";
	// 				params = { user: action.followed.user };
	// 			}
	// 			return (
	// 				<View>
	// 					<Text style={styles.activityText}>
	// 						{this.user.name + " 关注了 "}
	// 						{action.followed.category && "专题 "}
	// 						{action.followed.collection && "文集 "}
	// 						{action.followed.user && "作者 "}
	// 						<Text style={{ color: Colors.linkColor }} onPress={() => navigation.navigate(routeName, params)}>
	// 							{action.followed.category && action.followed.category.name}
	// 							{action.followed.collection && action.followed.collection.name}
	// 							{action.followed.user && action.followed.user.name}
	// 						</Text>
	// 					</Text>
	// 				</View>
	// 			);
	// 			break;
	// 	}
	// };
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	layoutFlexRow: {
		flexDirection: "row",
		alignItems: "center"
	},
	tintText: {
		fontSize: 14,
		color: Colors.tintFontColor
	},
	metaText: {
		fontSize: 15,
		color: Colors.tintFontColor
	},
	title: {
		fontSize: 18,
		color: Colors.darkFontColor
	},
	primaryText: {
		fontSize: 15,
		color: Colors.primaryFontColor
	},
	activity: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	activityBody: {},
	activityMeta: {}
});

export default ActionsScreen;
