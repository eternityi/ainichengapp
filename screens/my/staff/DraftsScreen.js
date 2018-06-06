import React, { Component } from "react";
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	TouchableOpacity
} from "react-native";
import { Iconfont } from "../../../utils/Fonts";
import Colors from "../../../constants/Colors";
import { CustomPopoverMenu, OperationModal } from "../../../components/Modal";
import { Header, HeaderLeft } from "../../../components/Header";
import {
	ContentEnd,
	LoadingMore,
	LoadingError,
	SpinnerLoading
} from "../../../components/Pure";
import Screen from "../../Screen";

import { Query, Mutation, graphql, compose } from "react-apollo";
import {
	draftsQuery,
	removeArticleMutation
} from "../../../graphql/user.graphql";
import { connect } from "react-redux";

class DraftsScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.handleModal = this.handleModal.bind(this);
		this.state = {
			fetchingMore: true,
			modalVisible: false,
			article_id: ""
		};
	}

	render() {
		let { fetchingMore, modalVisible, article_id } = this.state;
		let { navigation, drafts } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header
						navigation={navigation}
						search
						leftComponent={
							<HeaderLeft navigation={navigation} routeName>
								{
									// 	<CustomPopoverMenu
									// 	width={110}
									// 	selectHandler={() => null}
									// 	triggerComponent={
									// 		<View
									// 			style={{
									// 				flexDirection: "row",
									// 				alignItems: "center"
									// 			}}
									// 		>
									// 			<Text
									// 				style={{
									// 					fontSize: 16,
									// 					color: Colors.tintFontColor,
									// 					marginRight: 5
									// 				}}
									// 			>
									// 				私密文章
									// 			</Text>
									// 			<Iconfont name={"downward-arrow"} size={12} color={Colors.tintFontColor} />
									// 		</View>
									// 	}
									// 	options={["私密文章", "只看付费"]}
									// />
								}
							</HeaderLeft>
						}
					/>
					<Query query={draftsQuery}>
						{({ loading, error, data, refetch, fetchMore }) => {
							if (error)
								return (
									<LoadingError reload={() => refetch()} />
								);
							if (!(data && data.user && data.user.articles))
								return <SpinnerLoading />;
							if (!(data.user.articles.length > 0))
								return <BlankContent />;
							return (
								<FlatList
									data={data.user.articles}
									refreshing={loading}
									onRefresh={() => {
										refetch();
									}}
									keyExtractor={(item, index) =>
										index.toString()}
									renderItem={this._renderItem.bind(this)}
									getItemLayout={(data, index) => ({
										length: 90,
										offset: 90 * index,
										index
									})}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (data.user.articles) {
											fetchMore({
												variables: {
													offset:
														data.user.articles
															.length
												},
												updateQuery: (
													prev,
													{ fetchMoreResult }
												) => {
													if (
														!(
															fetchMoreResult &&
															fetchMoreResult.user
																.articles &&
															fetchMoreResult.user
																.articles
																.length > 0
														)
													) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign(
														{},
														prev,
														{
															user: Object.assign(
																{},
																prev.user,
																{
																	articles: [
																		...prev
																			.user
																			.articles,
																		...fetchMoreResult
																			.user
																			.articles
																	]
																}
															)
														}
													);
												}
											});
										} else {
											this.setState({
												fetchingMore: false
											});
										}
									}}
									ListFooterComponent={() => {
										return fetchingMore ? (
											<LoadingMore />
										) : (
											<ContentEnd />
										);
									}}
								/>
							);
						}}
					</Query>
				</View>
				<Mutation
					mutation={removeArticleMutation}
					variables={{ id: article_id }}
				>
					{removeArticle => {
						return (
							<OperationModal
								operation={["编辑", "删除", "公开发布", "文集设置"]}
								visible={modalVisible}
								handleVisible={this.handleModal}
								handleOperation={index => {
									switch (index) {
										case 0:
											break;
										case 1:
											removeArticle();
											break;
										case 2:
											break;
										case 3:
											break;
									}
									this.handleModal();
								}}
							/>
						);
					}}
				</Mutation>
			</Screen>
		);
	}

	_renderItem({ item }) {
		let { navigation } = this.props;
		return (
			<TouchableOpacity
				onPress={() => navigation.navigate("私密文章详情", { article: item })}
				onLongPress={() => {
					this.setState({
						article_id: item.id
					});
					this.handleModal();
				}}
			>
				<View style={styles.draftsItem}>
					<View>
						<Text numberOfLines={1} style={styles.timeAgo}>
							未公开 最后更新 {item.time_ago}
						</Text>
					</View>
					<View>
						<Text numberOfLines={2} style={styles.title}>
							{item.title}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	handleModal() {
		this.setState(prevState => ({
			modalVisible: !prevState.modalVisible
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	draftsItem: {
		height: 90,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor,
		justifyContent: "center"
	},
	timeAgo: {
		fontSize: 13,
		color: Colors.lightFontColor,
		marginBottom: 4
	},
	title: {
		fontSize: 17,
		color: Colors.primaryFontColor,
		lineHeight: 22
	}
});

export default connect(store => ({ drafts: store.articles.drafts }))(
	DraftsScreen
);
