import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity, Dimensions } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { Avatar, ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../components/Pure";

import { categoryAdminsQuery, categoryAuthorsQuery, categoryFollowersQuery } from "../../graphql/category.graphql";
import { Mutation, Query } from "react-apollo";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

class MembersTab extends Component {
	render() {
		let { scrollEnabled, onScroll, category } = this.props;
		return (
			<View style={styles.container}>
				<Query query={categoryFollowersQuery} variables={{ id: category.id }}>
					{({ loading, error, data, fetchMore, refetch }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (!(data && data.users)) return null;
						return (
							<FlatList
								ListHeaderComponent={this._renderHeader}
								onScroll={onScroll}
								scrollEnabled={scrollEnabled}
								data={data.users}
								keyExtractor={(item, index) => index.toString()}
								numColumns={3}
								renderItem={this._memberItem}
								onEndReachedThreshold={0.3}
								onEndReached={() => {
									// if (follows) {
									// 	fetchMore({
									// 		variables: {
									// 			offset: follows.length
									// 		},
									// 		updateQuery: (
									// 			prev,
									// 			{ fetchMoreResult }
									// 		) => {
									// 			if (fetchMoreResult) {
									// 				return {
									// 					...prev,
									// 					...fetchMoreResult
									// 				};
									// 			}
									// 		}
									// 	});
									// }
								}}
								ListFooterComponent={() => {
									if (data.users.length > 0) {
										return <ContentEnd />;
									} else {
										return <View />;
									}
								}}
							/>
						);
					}}
				</Query>
			</View>
		);
	}

	_memberItem = ({ item }) => {
		let { navigation, category } = this.props;
		let user = item;
		return (
			<TouchableOpacity onPress={() => navigation.navigate("用户详情", { user })}>
				<View style={styles.memberItem}>
					<View style={{ marginBottom: 12 }}>
						<Avatar uri={user.avatar} size={46} />
						{user.id == category.user.id && (
							<View style={styles.creatorMark}>
								<Text style={{ fontSize: 10, color: "#fff" }}>创建者</Text>
							</View>
						)}
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

	_renderHeader = () => {
		let { navigation, category } = this.props;
		return (
			<View>
				<Query query={categoryAdminsQuery} variables={{ id: category.id }}>
					{({ loading, error, data }) => {
						if (!(data && data.users)) return null;
						let admins = data.users;
						return (
							<View
								style={{
									borderBottomWidth: 1,
									borderBottomColor: Colors.lightBorderColor
								}}
							>
								<View style={styles.membersType}>
									<Text style={styles.memberItemText}>管理员({admins.length})</Text>
									<Text
										style={[styles.memberItemText, { color: Colors.lightFontColor }]}
										onPress={() => {
											navigation.navigate("管理员", {
												data: admins
											});
										}}
									>
										查看全部
										<Iconfont name={"right"} color={Colors.lightFontColor} size={15} />
									</Text>
								</View>
								<View style={{ flexDirection: "row" }}>
									{admins.slice(0, 3).map((user, index) => {
										return (
											<View key={index.toString()}>
												{this._memberItem({
													item: user
												})}
											</View>
										);
									})}
								</View>
							</View>
						);
					}}
				</Query>

				<Query query={categoryAuthorsQuery} variables={{ id: category.id }}>
					{({ loading, error, data }) => {
						if (!(data && data.users && data.users.length > 0)) return null;
						return (
							<View
								style={{
									borderBottomWidth: 1,
									borderBottomColor: Colors.lightBorderColor
								}}
							>
								<View style={styles.membersType}>
									<Text style={styles.memberItemText}>推荐作者({category.count_authors || data.users.length})</Text>
									<Text
										style={[styles.memberItemText, { color: Colors.lightFontColor }]}
										onPress={() => {
											navigation.navigate("专题推荐作者", {
												data: data.users
											});
										}}
									>
										查看全部
										<Iconfont name={"right"} color={Colors.lightFontColor} size={15} />
									</Text>
								</View>
								<View
									style={{
										flexDirection: "row",
										flexWrap: "wrap"
									}}
								>
									{data.users.slice(0, 6).map((user, index) => {
										return (
											<View key={index.toString()}>
												{this._memberItem({
													item: user
												})}
											</View>
										);
									})}
								</View>
							</View>
						);
					}}
				</Query>
				{category.count_follows > 0 && (
					<View style={styles.membersType}>
						<Text style={styles.memberItemText}>关注的人({category.count_follows})</Text>
					</View>
				)}
			</View>
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
	creatorMark: {
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
		height: 16,
		paddingHorizontal: 2,
		backgroundColor: Colors.themeColor,
		borderRadius: 10,
		left: 20,
		bottom: 0
	},
	membersType: {
		paddingHorizontal: 15,
		marginVertical: 15,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	memberItemText: {
		fontSize: 15,
		color: Colors.primaryFontColor
	}
});

export default connect(store => ({
	category_detail: store.categories.category_detail
}))(MembersTab);
