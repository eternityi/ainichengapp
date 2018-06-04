import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Iconfont } from "../../../utils/Fonts";
import Colors from "../../../constants/Colors";
import { CustomPopoverMenu } from "../../../components/Modal";
import { Header, HeaderLeft } from "../../../components/Header";
import { ContentEnd, LoadingMore, LoadingError, SpinnerLoading, BlankContent } from "../../../components/Pure";
import Screen from "../../Screen";

import { Query } from "react-apollo";
import { userTrashQuery } from "../../../graphql/user.graphql";
import { connect } from "react-redux";

class RecycleScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			fetchingMore: true
		};
	}

	render() {
		let { navigation, drafts } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header navigation={navigation} routeName={"回收站"} />
					<Query query={userTrashQuery}>
						{({ loading, error, data, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.user && data.user.articles)) return <SpinnerLoading />;
							if (!(data.user.articles.length > 0)) return <BlankContent />;
							return (
								<FlatList
									data={data.user.articles}
									refreshing={loading}
									onRefresh={() => {
										refetch();
									}}
									keyExtractor={(item, index) => index.toString()}
									renderItem={this._renderItem.bind(this)}
									getItemLayout={(data, index) => ({
										length: 90,
										offset: 90 * index,
										index
									})}
									onEndReached={() => {
										if (data.user.articles) {
											fetchMore({
												variables: {
													offset: data.user.articles.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (!(fetchMoreResult && fetchMoreResult.user && fetchMoreResult.user.articles.length > 0)) {
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
									ListFooterComponent={() => (this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />)}
								/>
							);
						}}
					</Query>
				</View>
			</Screen>
		);
	}

	_renderItem({ item }) {
		let { navigation } = this.props;
		return (
			<TouchableOpacity onPress={() => navigation.navigate("回收详情", { article: item })}>
				<View style={styles.draftsItem}>
					<View>
						<Text numberOfLines={1} style={styles.timeAgo}>
							{item.time_ago}
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

export default connect(store => ({ drafts: store.articles.drafts }))(RecycleScreen);
