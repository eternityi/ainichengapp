import React, { Component } from "react";
import { StyleSheet, View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import Colors from "../../../constants/Colors";
import { Header } from "../../../components/Header";
import PlainArticleItem from "../../../components/Article/PlainArticleItem";
import { OperationModal } from "../../../components/Modal";
import { ContentEnd, LoadingMore, LoadingError } from "../../../components/Pure";
import Screen from "../../Screen";

import { connect } from "react-redux";
import actions from "../../../store/actions";
import { userArticlesQuery, removeArticleMutation } from "../../../graphql/user.graphql";
import { Mutation, Query } from "react-apollo";

class OpenArticlesScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.handleModal = this.handleModal.bind(this);
		this.state = {
			fetchingMore: true,
			modalVisible: false,
			article: {}
		};
	}

	render() {
		let { fetchingMore, modalVisible, article } = this.state;
		const { navigation } = this.props;
		const { user } = navigation.state.params;
		return (
			<Screen>
				<View style={styles.container}>
					<Header navigation={navigation} />
					<Query
						query={userArticlesQuery}
						variables={{
							user_id: user.id
						}}
					>
						{({ loading, error, data, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.articles)) return null;
							return (
								<FlatList
									data={data.articles}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item }) => (
										<View>
											<TouchableOpacity
												onPress={() =>
													navigation.navigate("文章详情", {
														article: item
													})}
												onLongPress={() => {
													this.setState({
														article: item
													});
													this.handleModal();
												}}
											>
												<PlainArticleItem article={item} />
											</TouchableOpacity>
										</View>
									)}
									getItemLayout={(data, index) => ({
										length: 130,
										offset: 130 * index,
										index
									})}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (data.articles) {
											fetchMore({
												variables: {
													offset: data.articles.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (!(fetchMoreResult && fetchMoreResult.articles && fetchMoreResult.articles.length > 0)) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														articles: [...prev.articles, ...fetchMoreResult.articles]
													});
												}
											});
										} else {
											this.setState({
												fetchingMore: false
											});
										}
									}}
									ListFooterComponent={fetchingMore ? <LoadingMore /> : <ContentEnd />}
								/>
							);
						}}
					</Query>
				</View>
				<Mutation mutation={removeArticleMutation} variables={{ id: article.id }}>
					{removeArticle => {
						return (
							<OperationModal
								operation={["编辑", "删除文章", "投稿管理", "转为私密", "文集设置"]}
								visible={modalVisible}
								handleVisible={this.handleModal}
								handleOperation={index => {
									this.handleModal();
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
										case 4:
											navigation.navigate("选择文集", { article });
											break;
									}
								}}
							/>
						);
					}}
				</Mutation>
			</Screen>
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
	}
});

export default connect(store => ({
	open_articles: store.users.open_articles
}))(OpenArticlesScreen);
