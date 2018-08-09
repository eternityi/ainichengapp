import React, { Component } from "react";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import Screen from "../Screen";

import { SearchTypeBar, Avatar, ContentEnd, LoadingMore, LoadingError, SpinnerLoading, BlankContent } from "../../components/Pure";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import CategoryItem from "./CategoryItem";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { Query, Mutation, graphql } from "react-apollo";
import { topCategoriesQuery } from "../../graphql/category.graphql";
import { submitArticleMutation, userAdminCategoriesQuery, queryArticleRequestCenter } from "../../graphql/user.graphql";
import { queryArticleRequesRecommend } from "../../graphql/article.graphql";

class SeleceCategoryScreen extends React.Component {
	constructor(props) {
		super(props);
		let selectCategories = props.navigation.getParam("selectCategories", []);
		this.state = {
			fetchingMore: true,
			keywords: "",
			collection: "收录",
			submission: "投稿",
			routeName: "　",
			selectCategories
		};
	}
	render() {
		const { navigation, user } = this.props;
		const callback = navigation.getParam("callback", {});
		let { fetchingMore, keywords, collection, submission, routeName, selectCategories } = this.state;
		return (
			<Screen>
				<View style={styles.container}>
					<Header
						navigation={navigation}
						routeName={routeName}
						rightComponent={
							<TouchableOpacity
								onPress={() => {
									callback(selectCategories);
									navigation.goBack();
								}}
							>
								<Text
									style={{
										fontSize: 17,
										color: Colors.themeColor
									}}
								>
									完成
								</Text>
							</TouchableOpacity>
						}
					/>
					<Query query={queryArticleRequesRecommend}>
						{({ loading, error, data, fetchMore, refetch }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.user && data.user.categories)) return <SpinnerLoading />;
							if (data.user.categories.length < 1) return <BlankContent />;
							let { categories } = data.user;
							return (
								<FlatList
									data={categories}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<CategoryItem
											selectCategory={this.selectCategory}
											category={item}
											navigation={navigation}
											selectCategories={selectCategories}
										/>
									)}
									refreshing={loading}
									onRefresh={() => {
										refetch();
									}}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (categories) {
											fetchMore({
												variables: {
													offset: categories.length
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

	selectCategory = (category, check) => {
		let { selectCategories } = this.state;
		if (check) {
			selectCategories.push(category);
		} else {
			selectCategories = selectCategories.filter((elem, i) => {
				console.log("sss", elem.id != category.id);
				return elem.id != category.id;
			});
		}
		this.setState({ selectCategories });
		console.log("aaa", selectCategories);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
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

export default connect(store => ({ user: store.users.user }))(SeleceCategoryScreen);
