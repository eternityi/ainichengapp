import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity, Dimensions } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { UserMetaGroup } from "../../components/MediaGroup";
import { Avatar, ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../components/Pure";

import { collectionFollowersQuery } from "../../graphql/collection.graphql";
import { Mutation, Query } from "react-apollo";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

class MembersTab extends Component {
	render() {
		let { scrollEnabled, onScroll, navigation, collection } = this.props;
		return (
			<View style={styles.container}>
				<Query query={collectionFollowersQuery} variables={{ id: collection.id }}>
					{({ loading, error, data }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (!(data && data.users)) return null;
						return (
							<FlatList
								ListHeaderComponent={this._renderHeader.bind(this, data.users)}
								onScroll={onScroll}
								scrollEnabled={scrollEnabled}
								data={data.users}
								keyExtractor={(item, index) => index.toString()}
								numColumns={3}
								renderItem={this._renderItem}
							/>
						);
					}}
				</Query>
			</View>
		);
	}

	_renderHeader(users) {
		let { navigation, collection } = this.props;
		return (
			<View>
				<View
					style={{
						paddingBottom: 20,
						borderBottomWidth: 1,
						borderBottomColor: Colors.lightBorderColor
					}}
				>
					<View style={styles.membersType}>
						<Text style={styles.memberItemText}>作者</Text>
					</View>
					<TouchableOpacity
						style={{
							paddingHorizontal: 15,
							paddingTop: 20
						}}
						onPress={() =>
							navigation.navigate("用户详情", {
								user: collection.user
							})}
					>
						<UserMetaGroup navigation={navigation} user={collection.user} height={50} customStyle={{ avatar: 46 }} hideButton />
					</TouchableOpacity>
				</View>
				{users.length > 0 && (
					<View style={styles.membersType}>
						<Text style={styles.memberItemText}>关注的人</Text>
					</View>
				)}
			</View>
		);
	}

	_renderItem = ({ item }) => {
		let { navigation } = this.props;
		let user = item;
		return (
			<TouchableOpacity onPress={() => navigation.navigate("用户详情", { user })}>
				<View style={styles.memberItem}>
					<View style={{ marginBottom: 12 }}>
						<Avatar uri={user.avatar} size={46} />
					</View>
					<View>
						<Text
							style={{
								fontSize: 15,
								color: Colors.primaryFontColor
							}}
						>
							{user.name}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	memberItem: {
		alignItems: "center",
		paddingVertical: 20,
		width: width / 3
	},
	membersType: {
		paddingHorizontal: 15,
		paddingTop: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	memberItemText: {
		fontSize: 15,
		color: Colors.tintFontColor
	}
});

export default MembersTab;
