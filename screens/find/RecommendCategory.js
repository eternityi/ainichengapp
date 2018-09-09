"use strict";

import React from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../components/Pure";
import CategoryCard from "../../components/Card/CategoryCard";

import { connect } from "react-redux";
import { topCategoriesQuery } from "../../graphql/category.graphql";
import { Query } from "react-apollo";

let page = 1;
class RecommendCategory extends React.Component {
	constructor(props) {
		super(props);
		this.refreshing = false;
		console.log("constructor");
	}

	render() {
		return (
			<Query query={topCategoriesQuery}>
				{({ loading, error, data, refetch, fetchMore }) => {
					if (error) return <LoadingError reload={() => refetch()} />;
					if (!(data && data.categories)) return null;
					return (
						<View style={{ marginVertical: 15 }}>
							<View style={styles.flexRow}>
								<Text style={styles.emptyText}>你还没关注任何专题哦，快去关注一下吧！</Text>
							</View>
							<View>
								{data.categories.map((elem, index) => {
									return this._renderCategoryItem({
										item: elem,
										index
									});
								})}
							</View>
							<TouchableWithoutFeedback
								onPress={() => {
									if (this.refreshing) return null;
									this.refreshing = true;
									fetchMore({
										variables: {
											offset: page * 3
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											console.log("fetchMoreResult", fetchMoreResult);
											++page;
											this.refreshing = false;
											if (!(fetchMoreResult && fetchMoreResult.categories && fetchMoreResult.categories.length > 0)) {
												return prev;
											}
											console.log("page", page);
											return fetchMoreResult;
										}
									});
								}}
							>
								<View style={[styles.refresh, styles.flexRow]}>
									<Iconfont name="fresh" size={14} color={Colors.themeColor} />
									<Text style={styles.refreshText}>换一批</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					);
				}}
			</Query>
		);
	}

	_renderCategoryItem = ({ item, index }) => {
		return (
			<View style={styles.categoryCardWrap} key={index}>
				<CategoryCard category={item} />
			</View>
		);
	};
}

const styles = StyleSheet.create({
	categoryCardWrap: {
		marginHorizontal: 15,
		marginBottom: 15
	},
	flexRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	emptyText: {
		fontSize: 14,
		color: Colors.darkFontColor,
		marginBottom: 15
	},
	refresh: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10
	},
	refreshText: {
		fontSize: 14,
		color: Colors.themeColor,
		marginLeft: 4
	}
});

export default RecommendCategory;
