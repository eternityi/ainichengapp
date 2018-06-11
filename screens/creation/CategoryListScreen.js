import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions } from "react-native";

import Screen from "../Screen";
import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import { SearchTypeBar, Avatar, ContentEnd, LoadingMore, LoadingError, SpinnerLoading, BlankContent } from "../../components/Pure";
import { HollowButton } from "../../components/Button";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { Query, Mutation, graphql } from "react-apollo";
import { topCategoriesQuery } from "../../graphql/category.graphql";
import { submitArticleMutation, userAdminCategoriesQuery } from "../../graphql/user.graphql";

const { width, height } = Dimensions.get("window");

class CategoryItem extends React.Component {
	render() {
		let { article, category, navigation } = this.props;
		let { submit_status } = category;
		return (
			<TouchableOpacity style={styles.categoryItem} onPress={() => navigation.navigate("专题详情", { category })}>
				<View>
					<Avatar type={"category"} uri={category.logo} size={38} />
				</View>
				<View style={styles.categoryItemRight}>
					<View style={styles.categoryItemInfo}>
						<View>
							<Text style={styles.categoryItemTitle}>{category.name}</Text>
						</View>
						<View>
							<Text numberOfLines={1} style={styles.categoryItemMeta}>
								{category.count_articles + "篇文章  " + category.count_follows + "人关注" || ""}
							</Text>
						</View>
						<View>
							<Text numberOfLines={1} style={styles.categoryItemMeta}>
								投稿需要管理员审核
							</Text>
						</View>
					</View>
					<View style={{ width: 60, height: 28 }}>
						<Mutation mutation={submitArticleMutation}>
							{submitArticle => {
								return (
									<HollowButton
										name={submit_status ? submit_status : "投稿"}
										size={12}
										// color={submit_status.indexOf("投稿") !== -1 ? "rgba(66,192,46,0.9)" : Colors.themeColor}
										color={"rgba(66,192,46,0.9)"}
										onPress={() => {
											submitArticle({
												variables: {
													category_id: category.id,
													article_id: article.id
												}
											});
										}}
									/>
								);
							}}
						</Mutation>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

class CategoryListScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			fetchingMore: true,
			keywords: ""
		};
	}

	render() {
		const { navigation, user } = this.props;
		const type = navigation.getParam("type", "admin");
		const article = navigation.getParam("article", {});
		let { fetchingMore, keywords } = this.state;
		return (
			<Screen>
				<View style={styles.container}>
					<SearchTypeBar navigation={navigation} placeholder={"搜索专题"} type={"category"} />
					<Query query={type == "admin" ? userAdminCategoriesQuery : topCategoriesQuery} variables={{ user_id: user.id }}>
						{({ loading, error, data, fetchMore, refetch }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.categories)) return <SpinnerLoading />;
							if (data.categories.length < 1) return <BlankContent />;
							return (
								<FlatList
									ListHeaderComponent={() => {
										return (
											<View>
												<View style={styles.listHeader}>
													<Text style={styles.listHeaderText}>{type == "admin" ? "我管理的专题" : "最近投稿"}</Text>
												</View>
											</View>
										);
									}}
									data={data.categories}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => <CategoryItem article={article} category={item} />}
									refreshing={loading}
									onRefresh={() => {
										refetch();
									}}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (data.categories) {
											fetchMore({
												variables: {
													offset: data.categories.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (!(fetchMoreResult && fetchMoreResult.categories && fetchMoreResult.categories.length > 0)) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														categories: [...prev.categories, ...fetchMoreResult.categories]
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
										return this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />;
									}}
								/>
							);
						}}
					</Query>
				</View>
			</Screen>
		);
	}

	changeKeywords(keywords) {
		this.setState({
			keywords
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	categoryItem: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor,
		flexDirection: "row"
	},
	categoryItemRight: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 10
	},
	categoryItemInfo: {
		flex: 1,
		marginRight: 15
	},
	categoryItemTitle: {
		fontSize: 16,
		color: Colors.primaryFontColor
	},
	categoryItemMeta: {
		marginTop: 6,
		fontSize: 13,
		color: Colors.tintFontColor
	},
	listHeader: {
		paddingHorizontal: 15,
		paddingVertical: 20,
		backgroundColor: Colors.lightGray
	},
	hListHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	categoryName: {
		position: "absolute",
		bottom: 0,
		left: 0,
		width: 70,
		padding: 6
	},
	listHeaderText: {
		fontSize: 14,
		color: Colors.tintFontColor
	}
});

export default connect(store => ({ user: store.users.user }))(CategoryListScreen);
