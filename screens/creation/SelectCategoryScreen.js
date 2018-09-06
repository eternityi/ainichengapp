import React, { Component } from "react";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, ScrollView } from "react-native";
import Screen from "../Screen";

import SearchResult from "./SearchResult";

import Toast from "react-native-root-toast";
import { SearchTypeBar, Avatar, ContentEnd, LoadingMore, LoadingError, SpinnerLoading, BlankContent } from "../../components/Pure";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import EmitInput from "../../components/Native/EmitInput";
import CategoryItem from "./CategoryItem";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { Query, Mutation, graphql, compose, withApollo } from "react-apollo";
import { queryArticleRequesRecommend } from "../../graphql/article.graphql";
import { hotSearchAndLogsQuery, deleteQueryLogMutation } from "../../graphql/user.graphql";

class SeleceCategoryScreen extends React.Component {
	constructor(props) {
		super(props);
		this.handleSearch = this.handleSearch.bind(this);
		this.closeHistory = this.closeHistory.bind(this);
		this.deleteHistories = this.deleteHistories.bind(this);
		this.keywords = "";
		let selectCategories = props.navigation.getParam("selectCategories", []);
		selectCategories = [...selectCategories];
		this.state = {
			name: "keywords",
			placeholder: "搜索专题",
			fetchingMore: true,
			keywords: "",
			collection: "收录",
			submission: "投稿",
			selectCategories,
			none_keywords: true,
			fetchMore: true
		};
	}

	onEmitterReady = emitter => {
		this.thingEmitter = emitter;
		this.thingEmitter.addListener("keywordsChanged", text => {
			this.keywords = text;
			if (this.keywords.length < 1) {
				this.setState({ none_keywords: true });
			}
		});
	};
	render() {
		let { navigation, user, hot_search, deleteQuery, login } = this.props;
		let { none_keywords, name, placeholder } = this.state;
		const callback = navigation.getParam("callback", {});
		let { fetchingMore, keywords, collection, submission, selectCategories } = this.state;
		return (
			<Screen header>
				<View style={styles.container}>
					<Header
						routeName
						leftComponent
						centerComponent={
							<View style={styles.searchWrap}>
								<EmitInput
									words={false}
									name={name}
									style={styles.textInput}
									autoFocus={true}
									placeholder={placeholder}
									onEmitterReady={this.onEmitterReady}
									ref={ref => (this.inputText = ref)}
								/>
								<TouchableOpacity style={styles.searchIcon} onPress={this.handleSearch}>
									<Iconfont name={"search"} size={22} color={Colors.tintFontColor} style={{ marginRight: 8 }} />
								</TouchableOpacity>
							</View>
						}
						rightComponent={
							<TouchableOpacity
								onPress={() => {
									if (selectCategories.length > 3) {
										Toast.show("最多选择3个专题哦~", {
											shadow: true,
											delay: 100
										});
									} else {
										callback(selectCategories);
										navigation.goBack();
									}
								}}
							>
								<Text
									style={{
										fontSize: 17,
										color: Colors.themeColor,
										paddingHorizontal: 10
									}}
								>
									{selectCategories.length > 0 ? "确认 " : "取消"}
								</Text>
							</TouchableOpacity>
						}
					/>
					{none_keywords ? (
						<Query query={hotSearchAndLogsQuery}>
							{({ loading, error, data, fetchMore, refetch }) => {
								let histories = [];
								if (error) return <LoadingError reload={() => refetch()} />;
								if (login) {
									if (!(data && data.queries && data.queryLogs)) return <SpinnerLoading />;
									histories = data.queryLogs;
								} else {
									if (!(data && data.queries)) return <SpinnerLoading />;
								}
								let hotsearch = data.queries;
								this.hotsearchs += hotsearch.length;
								return (
									<ScrollView style={styles.container} bounces={false}>
										<View style={{ paddingHorizontal: 15 }}>
											{histories.length > 0 && (
												<View style={styles.historyWrap}>
													{this._renderHistories(histories)}
													<TouchableOpacity
														onPress={() =>
															deleteQuery({
																update: (cache, { data: { deleteQueryLog } }) => {
																	let { queries } = cache.readQuery({
																		query: hotSearchAndLogsQuery
																	});
																	cache.writeQuery({
																		query: hotSearchAndLogsQuery,
																		data: { queries, queryLogs: [] }
																	});
																}
															})
														}
													>
														<View style={[styles.searchItem, { justifyContent: "center" }]}>
															<Text style={{ fontSize: 16, color: Colors.tintFontColor }}>清除搜索记录</Text>
														</View>
													</TouchableOpacity>
												</View>
											)}
										</View>
									</ScrollView>
								);
							}}
						</Query>
					) : (
						<SearchResult
							keywords={this.keywords}
							navigation={navigation}
							selectCategory={this.selectCategory}
							selectCategories={selectCategories}
						/>
					)}
				</View>
			</Screen>
		);
	}
	// 搜索记录
	_renderHistories = data => {
		let { navigation, deleteQuery } = this.props;
		let histories = data.map((elem, index) => {
			return (
				<TouchableOpacity key={elem.id} onPress={() => this.handleSearch(elem.query)}>
					<View style={styles.searchItem}>
						<View style={styles.verticalCenter}>
							<Iconfont name={"time-outline"} size={21} color={Colors.lightFontColor} style={{ marginRight: 20 }} />
							{elem.query && <Text style={{ fontSize: 16, color: "#666" }}>{elem.query}</Text>}
						</View>
						<TouchableOpacity
							onPress={() =>
								deleteQuery({
									variables: {
										id: elem.id
									},
									update: (cache, { data: { deleteQueryLog } }) => {
										let { queryLogs, queries } = cache.readQuery({
											query: hotSearchAndLogsQuery
										});
										queryLogs = queryLogs.filter((query, index) => {
											return query.id !== elem.id;
										});
										console.log(queryLogs);
										cache.writeQuery({
											query: hotSearchAndLogsQuery,
											data: { queries, queryLogs }
										});
									}
								})
							}
						>
							<View
								style={{
									width: 50,
									height: 50,
									justifyContent: "center",
									alignItems: "center"
								}}
							>
								<Iconfont name={"close"} size={20} color={Colors.lightFontColor} />
							</View>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			);
		});
		return <View>{histories}</View>;
	};

	handleSearch(keywords) {
		if (keywords.length > 0) {
			this.changeKeywords(keywords);
		}
		if (this.keywords.length > 0) {
			this.setState({ none_keywords: false });
		}
	}

	closeHistory(id) {
		this.setState(prevState => {
			if (prevState.histories.length == 1) {
				return { histories: "" };
			}
			return {
				histories: prevState.histories.filter((elem, index) => elem.id != id)
			};
		});
	}

	deleteHistories(id) {
		this.setState({ histories: [] });
		variables: {
			id;
		}
	}

	changeKeywords = keywords => {
		this.keywords = keywords;
		this.inputText.changeText(this.keywords);
	};

	selectCategory = (category, check) => {
		let { selectCategories } = this.state;
		if (check) {
			selectCategories.push(category);
		} else {
			selectCategories = selectCategories.filter((elem, i) => {
				return elem.id != category.id;
			});
		}
		this.setState({ selectCategories });
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
	},
	searchWrap: {
		flex: 1,
		height: 32,
		borderRadius: 16,
		backgroundColor: Colors.lightGray,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		marginRight: 60
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		height: 22,
		lineHeight: 22,
		padding: 0,
		color: Colors.primaryFontColor
	},
	searchIcon: {
		paddingLeft: 10,
		borderLeftWidth: 1,
		borderLeftColor: Colors.lightBorderColor
	},
	searchItem: {
		height: 50,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	verticalCenter: {
		flexDirection: "row",
		alignItems: "center"
	}
});

export default compose(
	withApollo,
	connect(store => ({
		hot_search: store.search.hot_search,
		histories: store.search.histories,
		login: store.users.login
	})),
	graphql(deleteQueryLogMutation, { name: "deleteQuery" })
)(SeleceCategoryScreen);
// connect(store => ({ user: store.users.user }))(SeleceCategoryScreen);
