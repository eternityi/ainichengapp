import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList, Text, TextInput, Dimensions } from "react-native";

import { Iconfont } from "../../../utils/Fonts";
import Colors from "../../../constants/Colors";
import { Header, HeaderLeft } from "../../../components/Header";
import { CollectionGroup } from "../../../components/MediaGroup";
import { WriteModal, OperationModal } from "../../../components/Modal";
import { CustomScrollTabBar, ContentEnd, LoadingMore, SpinnerLoading } from "../../../components/Pure";
import Screen from "../../Screen";

import { Query, Mutation, graphql } from "react-apollo";
import { userCollectionsQuery } from "../../../graphql/user.graphql";
import { createCollectionMutation } from "../../../graphql/collection.graphql";
import { moveArticleMutation } from "../../../graphql/article.graphql";
import { connect } from "react-redux";
import actions from "../../../store/actions";

const { width, height } = Dimensions.get("window");

class SelectScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.toggleCreateModal = this.toggleCreateModal.bind(this);
		//根据routeparams passed article init selectCollection
		console.log("constructor");
		this.state = {
			createModalVisible: false,
			selectCollection: 0,
			collectionName: ""
		};
	}

	render() {
		let { navigation, user, moveArticle } = this.props;
		let article = navigation.getParam("article");
		let { createModalVisible, selectCollection, collectionName } = this.state;
		console.log("render", selectCollection);
		return (
			<Screen>
				<Header
					navigation={navigation}
					routeName="文集"
					rightComponent={
						<TouchableOpacity onPress={this.toggleCreateModal}>
							<Text
								style={{
									fontSize: 17,
									color: Colors.themeColor
								}}
							>
								新建
							</Text>
						</TouchableOpacity>
					}
				/>
				<View style={styles.container}>
					<Query query={userCollectionsQuery} variables={{ user_id: user.id }}>
						{({ loading, error, data, refetch }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.collections)) return <SpinnerLoading />;
							console.log("Query", selectCollection);
							return data.collections.map((item, index) => {
								return (
									<TouchableOpacity
										key={index}
										style={styles.collectionItem}
										onPress={() => {
											this.setState(prevState => ({
												selectCollection: index
											}));
											moveArticle({
												variables: {
													article_id: article.id,
													collection_id: item.id
												}
											});
										}}
									>
										<Text>{item.name}</Text>
										{selectCollection == index ? (
											<Iconfont name="radio-check" size={22} color={Colors.themeColor} />
										) : (
											<Iconfont name="radio-uncheck" size={22} color={Colors.themeColor} />
										)}
									</TouchableOpacity>
								);
							});
						}}
					</Query>
				</View>
				<Mutation mutation={createCollectionMutation}>
					{createCollection => {
						return (
							<WriteModal
								modalName="新建文集"
								placeholder={"文集名"}
								visible={createModalVisible}
								value={collectionName}
								handleVisible={this.toggleCreateModal}
								changeVaule={this.changeCollectionName}
								submit={() => {
									createCollection({
										variables: {
											name: collectionName
										},
										refetchQueries: addCollection => [
											{
												query: userCollectionsQuery,
												variables: {
													user_id: user.id
												}
											}
										]
									});
									this.toggleCreateModal();
								}}
							/>
						);
					}}
				</Mutation>
			</Screen>
		);
	}

	changeCollectionName(val) {
		this.setState({ collectionName: val });
	}

	toggleCreateModal() {
		this.setState(prevState => ({
			createModalVisible: !prevState.createModalVisible
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	collectionItem: {
		paddingHorizontal: 15,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	}
});

export default connect(store => ({
	user: store.users.user,
	collections: store.categories.collections
}))(graphql(moveArticleMutation, { name: "moveArticle" })(SelectScreen));
