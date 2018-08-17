import React, { Component } from "react";
import Colors from "../../constants/Colors";
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from "react-native";
import { Header } from "../../components/Header";
import { AddCommentModal } from "../../components/Modal";
import { ContentEnd, LoadingMore, LoadingError, SpinnerLoading, BlankContent } from "../../components/Pure";
import { goContentScreen } from "../../constants/Methods";
import MediaGroup from "./MediaGroup";
import Screen from "../Screen";

import { Query, Mutation } from "react-apollo";
import { commentNotificationQuery, unreadsQuery } from "../../graphql/notification.graphql";
import { connect } from "react-redux";
import actions from "../../store/actions";

class CommentsScreen extends Component {
	constructor(props) {
		super(props);
		this.commentedArticle = {};
		this.replyingComment = {};
		this.state = {
			fetchingMore: true,
			replyCommentVisible: false
		};
	}

	render() {
		let { replyCommentVisible, fetchingMore } = this.state;
		const { navigation } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header navigation={navigation} />
					<Query query={commentNotificationQuery}>
						{({ loading, error, data, refetch, fetchMore, client }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.user)) return <SpinnerLoading />;
							if (data.user.notifications.length < 1) return <BlankContent />;
							//retech unreadsQuery ...
							client.query({
								query: unreadsQuery,
								fetchPolicy: "network-only"
							});
							return (
								<FlatList
									data={data.user.notifications}
									keyExtractor={(item, index) => index.toString()}
									renderItem={this._renderItem}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (data.user.notifications) {
											fetchMore({
												variables: {
													offset: data.user.notifications.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (
														!(
															fetchMoreResult &&
															fetchMoreResult.user.notifications &&
															fetchMoreResult.user.notifications.length > 0
														)
													) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														user: Object.assign({}, prev.user, {
															notifications: [...prev.user.notifications, ...fetchMoreResult.user.notifications]
														})
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
										return fetchingMore ? <LoadingMore /> : <ContentEnd />;
									}}
								/>
							);
						}}
					</Query>
					<AddCommentModal
						emitter="replyComment"
						visible={replyCommentVisible}
						toggleCommentModal={() => {
							this.setState(prevState => ({
								replyCommentVisible: !prevState.replyCommentVisible
							}));
						}}
						article={this.commentedArticle}
						replyingComment={this.replyingComment}
						navigation={navigation}
					/>
				</View>
			</Screen>
		);
	}

	_renderItem = ({ item, index }) => {
		let { navigation } = this.props;
		let notification = item;
		if (!["评论中提到了你", "评论了文章"].includes(notification.type)) {
			return <View />;
		}
		return (
			<MediaGroup
				navigation={navigation}
				user={notification.user}
				rightComponent={
					<TouchableOpacity
						style={styles.reply}
						onPress={() => {
							this.commentedArticle = notification.article;
							this.replyingComment = {
								...notification.comment,
								...notification.user,
								reply: true
							};
							this.setState(prevState => ({
								replyCommentVisible: !prevState.replyCommentVisible
							}));
						}}
					>
						<Text style={{ fontSize: 14, color: "#717171" }}>回复</Text>
					</TouchableOpacity>
				}
				description={this.description(notification, navigation)}
				comment={{
					body: notification.comment ? notification.comment.body : "",
					param: { comment: notification.comment }
				}}
				meta={notification.time_ago}
			/>
		);
	};

	description(notification, navigation) {
		switch (notification.type) {
			case "评论中提到了你":
				return (
					<Text style={{ lineHeight: 24 }}>
						在
						<Text style={styles.linkText} onPress={() => goContentScreen(navigation, notification.article)}>
							{" 《" + notification.article.title + "》 "}
						</Text>
						的评论中提到了你
					</Text>
				);
				break;
			case "评论了文章":
				return (
					<Text style={{ lineHeight: 24 }}>
						评论了你发布的
						<Text style={styles.linkText} onPress={() => goContentScreen(navigation, notification.article)}>
							{" 《" + notification.article.title + "》 "}
						</Text>
					</Text>
				);
				break;
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	reply: {
		width: 55,
		height: 30,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: Colors.tintBorderColor,
		alignItems: "center",
		justifyContent: "center"
	},
	linkText: {
		lineHeight: 24,
		color: Colors.linkColor
	}
});

export default connect(store => {
	return {
		users: store.users
	};
})(CommentsScreen);
