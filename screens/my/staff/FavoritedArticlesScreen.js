import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions } from "react-native";
import Colors from "../../../constants/Colors";
import { Header } from "../../../components/Header";
import PlainArticleItem from "../../../components/Article/PlainArticleItem";
import { ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../../components/Pure";
import { OperationModal } from "../../../components/Modal";
import Screen from "../../Screen";

import { connect } from "react-redux";
import actions from "../../../store/actions";
import { favoritedArticlesQuery } from "../../../graphql/user.graphql";
import { Mutation, Query } from "react-apollo";

const { width, height } = Dimensions.get("window");

class FavoritedArticlesScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.handleModal = this.handleModal.bind(this);
		this.state = {
			modalVisible: false,
			fetchingMore: true
		};
	}

	render() {
		let { modalVisible } = this.state;
		let { navigation } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header navigation={navigation} />
					<Query query={favoritedArticlesQuery}>
						{({ loading, error, data, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.user && data.user.articles)) return <SpinnerLoading />;
							if (!(data.user.articles.length > 0)) return <BlankContent />;
							return (
								<FlatList
									data={data.user.articles}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item }) => (
										<View>
											<TouchableOpacity
												onPress={() =>
													navigation.navigate("文章详情", {
														article: item
													})}
												onLongPress={this.handleModal}
											>
												<PlainArticleItem article={item} showAuthorName navigation={navigation} />
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
										if (data.user.articles) {
											fetchMore({
												variables: {
													offset: data.user.articles.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (!(fetchMoreResult && fetchMoreResult.user.articles && fetchMoreResult.user.articles.length > 0)) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														user: Object.assign({}, prev.user, {
															articles: [...prev.user.articles, ...fetchMoreResult.user.articles]
														})
													});
												}
											});
										} else {
											this.setState({
												fetchingMore: false
											});
										}
									}}
									ListFooterComponent={() => {
										return this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />;
									}}
								/>
							);
						}}
					</Query>
					<OperationModal
						operation={["取消收藏"]}
						visible={modalVisible}
						handleVisible={this.handleModal}
						handleOperation={index => {
							this.handleModal();
						}}
					/>
				</View>
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

export default FavoritedArticlesScreen;
