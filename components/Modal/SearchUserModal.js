import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity, TextInput, Platform, Dimensions } from "react-native";
import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import FullScreenModal from "./FullScreenModal";
import Header from "../../components/Header/Header";
import HollowButton from "../../components/Button/Hollow";
import UserMetaGroup from "../../components/MediaGroup/UserMetaGroup";
import HeaderLeft from "../../components/Header/HeaderLeft";
import ContentEnd from "../../components/Pure/ContentEnd";
import LoadingMore from "../../components/Pure/LoadingMore";

import { Query } from "react-apollo";
import { userFollowersQuery } from "../../../graphql/user.graphql";
import { connect } from "react-redux";
import actions from "../../store/actions";

const { width, height } = Dimensions.get("window");

class SearchUserModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fetchingMore: false,
			complete: false,
			keywords: ""
		};
	}

	render() {
		let { keywords, fetchingMore, complete } = this.state;
		let { user, navigation, visible, handleVisible } = this.props;
		return (
			<FullScreenModal
				visible={visible}
				handleVisible={handleVisible}
				headerRight={
					<View style={styles.searchBar}>
						<TextInput
							words={false}
							underlineColorAndroid="transparent"
							selectionColor={Colors.themeColor}
							style={styles.textInput}
							autoFocus={true}
							placeholder="搜索好友"
							placeholderText={Colors.tintFontColor}
							onChangeText={value => this.setState({ keywords: value })}
							value={keywords}
						/>
						<TouchableOpacity style={styles.searchButton} onPress={() => null}>
							<Iconfont name={"search"} size={22} color={Colors.tintFontColor} />
						</TouchableOpacity>
					</View>
				}
			>
				<View style={styles.container}>
					<Query query={userFollowersQuery} variables={{ user_id: user.id }}>
						{({ loading, error, data, refetch, fetchMore }) => {
							if (!(data && data.users)) return null;
							return (
								<FlatList
									ListHeaderComponent={this.listHeader}
									data={data.users}
									keyExtractor={(item, index) => index.toString()}
									renderItem={this._renderUserItem}
									onEndReached={() => {
										if (complete) return null;
										this.setState({
											fetchingMore: true
										});
										fetchMore({
											variables: {
												offset: data.users.length
											},
											updateQuery: (prev, { fetchMoreResult }) => {
												this.setState({
													fetchingMore: false
												});
												if (fetchMoreResult.users.length < 10) {
													this.setState({
														complete: true
													});
												}
												if (!(fetchMoreResult && fetchMoreResult.users)) return prev;
												return Object.assign({}, prev, {
													users: [...prev.users, ...fetchMoreResult.users]
												});
											}
										});
									}}
									getItemLayout={(data, index) => ({
										length: 86,
										offset: 86 * index,
										index
									})}
									ListFooterComponent={() => (fetchingMore ? <LoadingMore /> : <ContentEnd />)}
								/>
							);
						}}
					</Query>
				</View>
			</FullScreenModal>
		);
	}

	listHeader() {
		return (
			<View style={styles.follows}>
				<Text
					style={{
						fontSize: 13,
						color: Colors.lightFontColor
					}}
				>
					我关注的用户
				</Text>
			</View>
		);
	}

	_renderUserItem = ({ item }) => {
		let { navigation, handleSelectedUser } = this.props;
		let user = item;
		return (
			<TouchableOpacity style={styles.friendItem} onPress={() => handleSelectedUser(user)}>
				<UserMetaGroup hideButton navigation={navigation} user={user} />
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	searchBar: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		height: 33,
		borderWidth: 1,
		borderColor: Colors.lightBorderColor,
		backgroundColor: Colors.lightGray,
		borderRadius: 4
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		padding: 0,
		paddingLeft: 10,
		color: Colors.primaryFontColor
	},
	searchButton: {
		paddingHorizontal: 10,
		borderLeftWidth: 1,
		borderLeftColor: Colors.tintBorderColor
	},
	follows: {
		paddingLeft: 15,
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	friendItem: {
		paddingVertical: 20,
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	}
});

export default connect(store => ({ user: store.users.user }))(SearchUserModal);
