import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { Header } from "../../components/Header";
import FollowItem from "./FollowItem";
import Screen from "../Screen";

import { topCategoriesQuery } from "../../graphql/category.graphql";
import { graphql, Query } from "react-apollo";
import { connect } from "react-redux";

class CategoriesScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
	}

	render() {
		let { recommend_categories, navigation } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header navigation={navigation} />
					<FlatList data={recommend_categories} keyExtractor={(item, index) => index.toString()} renderItem={this._renderItem} />
					{
						// <Query query={topCategoriesQuery}>
						//   {({ loading, error, data, fetchMore }) => {
						//     if (!(data && data.categories)) return null;
						//     return (
						//       <FlatList
						//         data={data.categories}
						//         keyExtractor={(item, index) =>
						//           item.key ? item.key : index.toString()}
						//         renderItem={this._renderItem}
						//         onEndReached={() => {
						//           fetchMore({
						//             variables: {
						//               offset: data.categories.length
						//             },
						//             updateQuery: (prev, { fetchMoreResult }) => {
						//               if (!(fetchMoreResult && fetchMoreResult.categories))
						//                 return prev;
						//               return Object.assign({}, prev, {
						//                 categories: [
						//                   ...prev.categories,
						//                   ...fetchMoreResult.categories
						//                 ]
						//               });
						//             }
						//           });
						//         }}
						//       />
						//     );
						//   }}
						// </Query>
					}
				</View>
			</Screen>
		);
	}

	_renderItem = ({ item }) => {
		let { navigation } = this.props;
		return (
			<View style={{ paddingHorizontal: 15 }}>
				<TouchableOpacity
					style={{
						paddingVertical: 15,
						borderBottomWidth: 1,
						borderBottomColor: Colors.lightBorderColor
					}}
					onPress={() =>
						navigation.navigate("专题详情", {
							item
						})}
				>
					<FollowItem data={{ category: item }} navigation={navigation} />
				</TouchableOpacity>
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	}
});

export default connect(store => ({
	recommend_categories: store.categories.recommend_categories
}))(CategoriesScreen);
