import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { Header } from "../../components/Header";
import FollowItem from "./FollowItem";
import Screen from "../Screen";

import { recommendAuthors } from "../../graphql/user.graphql";
import { graphql, Query } from "react-apollo";
import { connect } from "react-redux";

class AuthorsScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
	}

	render() {
		let { recommend_authors, navigation } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header navigation={navigation} />
					<FlatList data={recommend_authors} keyExtractor={(item, index) => index.toString()} renderItem={this._renderItem} />
				</View>
				{
					// <Query query={recommendAuthors}>
					//   {({ loading, error, data, refetch, fetchMore }) => {
					//     if (!(data && data.users)) return null;
					//     return (
					// 		<FlatList
					// 			data={data.users}
					// 			keyExtractor={(item, index) => index.toString()}
					// 			renderItem={this._renderItem}
					// 		/>
					//     );
					//   }}
					// </Query>
				}
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
						navigation.navigate("用户详情", {
							user: item
						})}
				>
					<FollowItem data={{ user: item }} navigation={navigation} />
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
	recommend_authors: store.users.recommend_authors
}))(AuthorsScreen);
