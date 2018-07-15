import React, { Component } from "react";
import { ScrollView, Text, StyleSheet, View, FlatList, TouchableOpacity,Dimensions } from "react-native";
import { NavigationActions } from "react-navigation";

import Screen from "../Screen";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { SearchHeader } from "../../components/Header";
import { Avatar, DivisionLine, ContentEnd, LoadingMore , LoadingError, SpinnerLoading, BlankContent,} from "../../components/Pure";
import SearchArticleItem from "../../components/Article/SearchArticleItem";

import { connect } from "react-redux";
import { graphql, Query } from "react-apollo";
import { queriesQuery,queriesCategoriesQuery,queriesCollectionsQuery,queriesArticlesQuery} from "../../graphql/user.graphql";

const { width, height } = Dimensions.get("window");

class SearchResult extends Component {
	constructor(props) {
		super(props);
		this.articleOrder = this.articleOrder.bind(this);
		this._renderRelatedUserItem = this._renderRelatedUserItem.bind(this);
		this._renderRelatedCategoryItem = this._renderRelatedCategoryItem.bind(this);
		this._renderSearchHeader = this._renderSearchHeader.bind(this);
		this._renderRelatedArticle = this._renderRelatedArticle.bind(this);
		this.state = {
			order: "",
			keywords: props.keywords
		};
	}

	render() {
		let { keywords ,order} = this.state;
		let { navigation, search_detail } = this.props;
		return (
			<View style={styles.container}>
				<Query query={queriesArticlesQuery} variables={{ keyword: keywords,order:order }}>
					{({ loading, error, data, fetchMore, refetch }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (!(data && data.articles)) return <SpinnerLoading />;
						if (data.articles.length < 1) return <BlankContent />;
						return (
							<FlatList
							    navigation={navigation}
								data={data.articles}
								keyExtractor={(item, index) => index.toString()}
								renderItem={this._renderRelatedArticle}
								ListHeaderComponent={this._renderSearchHeader}
								ListFooterComponent={() => {
									return <ContentEnd />;
								}}
							/>
						);
					}}
				</Query>
			</View>
		);
	}

	_renderRelatedUserItem(item, index) {
		let { navigation } = this.props;
		return (
			<TouchableOpacity style={styles.relatedItem} key={index} onPress={() => navigation.navigate("用户详情", { user: item })} >
				<Avatar uri={item.avatar} size={40} />
				<Text style={styles.relatedItemName} numberOfLines={1}>{item.name}</Text>
			</TouchableOpacity>
		);
	}

	_renderRelatedCategoryItem(item, index) {
		let { navigation } = this.props;
		return (
			<TouchableOpacity style={styles.relatedItem} key={index} onPress={() => navigation.navigate("专题详情", { category: item })}>
				<Avatar uri={item.logo} type={"category"} size={40} />
				<Text style={styles.relatedItemName} numberOfLines={1}>{item.name}</Text>
			</TouchableOpacity>
		);
	}

	_renderSearchHeader() {
		let { order } = this.state;
		let { navigation, search_detail,keywords } = this.props;
		let { users, categories, collections } = search_detail;
		return (
			<View>
				<Query  query={queriesQuery} variables={{ keyword: keywords }}>
					{({ loading, error, data, fetchMore, refetch }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (!(data && data.users)) return <SpinnerLoading />;
						if (data.users.length < 1) return null;
						return (
							<View>
								<TouchableOpacity style={styles.relatedType} onPress={() => navigation.navigate("相关用户", { users:data.users })}>
									<Text style={styles.relatedTypeText}>相关用户</Text>
									<Iconfont name={"right"} color={Colors.tintFontColor} size={16} />
								</TouchableOpacity>
								<View style={styles.relatedItemList}>
									{data.users.slice(0, 4).map((elem, idnex) => {
										return this._renderRelatedUserItem(elem, idnex);
									})}
								</View>
							</View>
						);
					}}
				</Query>
				<DivisionLine height={18} />
				<Query  query={queriesCategoriesQuery} variables={{ keyword: keywords }}>
					{({ loading, error, data, fetchMore, refetch }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (!(data && data.categories)) return <SpinnerLoading />;
						if (data.categories.length < 1) return null;
						return (
							<View>
								<TouchableOpacity style={styles.relatedType} onPress={() => navigation.navigate("相关专题", { categories:data.categories })}>
									<Text style={styles.relatedTypeText} >相关专题</Text>
									<Iconfont name={"right"} color={Colors.tintFontColor} size={16} />
								</TouchableOpacity>
								<View style={styles.relatedItemList}>
									{data.categories.slice(0, 4).map((elem, idnex) => {
										return this._renderRelatedCategoryItem(elem, idnex);
									})}
								</View>
							</View>
						);
					}}
				</Query>	
				<DivisionLine height={18} />
				<Query  query={queriesCollectionsQuery} variables={{ keyword: keywords }}>
					{({ loading, error, data, fetchMore, refetch }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						return (
							<TouchableOpacity style={styles.relatedType} onPress={() => navigation.navigate("相关文集", { collections:data.collections })}>
								<Text style={styles.relatedTypeText}>相关文集</Text>
								<Iconfont name={"right"} color={Colors.tintFontColor} size={16} />
							</TouchableOpacity>
						);
					}}
				</Query>
				<DivisionLine height={18} />
				<View style={styles.orderArticleHeader}>
					<Text style={[styles.relatedTypeText, order == "" ? styles.focused : {}]} onPress={() => this.articleOrder("")}>
						按时间 
					</Text>
					<View style={styles.divisionLine} />
					<Text style={[styles.relatedTypeText, order == "HOT" ? styles.focused : {}]} onPress={() => this.articleOrder("HOT")}>
						按热度
					</Text>
				</View>
			</View>
		);
	}

	_renderRelatedArticle({ item, index }) {
		let { navigation } = this.props;
		let { keywords } = this.state;
		return <SearchArticleItem navigation={navigation} keywords={keywords} post={item} />;
	}

	articleOrder(order) {
		this.setState({ order });
	}

	_matchingText(keywords, content) {
		// todo 可以替换 但是不能创建React Element
		// var reg = new RegExp(keywords,"g");
		// if(reg.test(content)&&keywords) {
		// 	// var highlightKeywords = React.createElement(Text,{style:{styles.focused}},keywords);
		// 	var enhanceContent = content.replace(reg,`<Text style={styles.focused}>${keywords}</Text>`);
		// 	return enhanceContent;
		// }else {
		// 	return content;
		// }
		return content;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	relatedType: {
		padding: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	relatedTypeText: {
		fontSize: 15,
		color: Colors.tintFontColor
	},
	relatedItemList: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 5,
		paddingBottom: 25,
		paddingHorizontal: 15
	},
	relatedItem: {
		flex: 1,
		alignItems: "center",
		width:10
	},
	relatedItemName: {
		fontSize: 14,
		color: Colors.primaryFontColor,
		marginTop: 8
	},
	orderArticleHeader: {
		flexDirection: "row",
		alignItems: "center",
		padding: 15
	},
	divisionLine: {
		width: 1,
		height: 20,
		marginHorizontal: 10,
		backgroundColor: Colors.tintGray
	},
	focused: {
		color: Colors.themeColor
	}
});

export default connect(store => ({
	search_detail: store.search.search_detail
}))(SearchResult);
