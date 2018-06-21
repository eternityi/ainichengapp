import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, FlatList, Dimensions } from "react-native";

import Screen from "../../Screen";
import Colors from "../../../constants/Colors";
import { Iconfont } from "../../../utils/Fonts";
import { Header } from "../../../components/Header";
import { DivisionLine, ContentEnd, LoadingError } from "../../../components/Pure";
import { HollowButton } from "../../../components/Button";

import { connect } from "react-redux";
import actions from "../../../store/actions";
import { Query, Mutation, graphql } from "react-apollo";
// import {
// 	contributeCategory,
// 	beSelectedCategory,
// 	removeContributeMutation
// } from "../../graphql/category.graphql";
import { submitArticleMutation } from "../../../graphql/user.graphql";

class ContributeManageScreen extends React.Component {
	static navigationOptions = {
		header: null
	};

	render() {
		let { article, navigation } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header navigation={navigation} />
					<DivisionLine />
					{/*
							<Query query={contributeCategory}>
								{({ loading, error, data, refetch }) => {
									if (error)
										return (
											<LoadingError reload={() => refetch()} />
										);
									if (!(data && data.articles)) return null;
									return (
										<FlatList
											data={data.categories}
											keyExtractor={(item, index) =>
												index.toString()}
											renderItem={this.renderContributeItem}
											ItemSeparatorComponent={() => (
												<View style={styles.ItemSeparator} />
											)}
										/>
									);
								}}
							</Query>
						**/}
					<View style={styles.categoryItem}>
						<View style={styles.itemInfo}>
							<View>
								<Text style={styles.darkText}>
									向
									<Text style={styles.title}>《爱你哦小宝宝》</Text>
									投稿
								</Text>
							</View>
							<View>
								<Text style={styles.grayText}>已撤回/被拒绝</Text>
							</View>
						</View>
						<View style={styles.button}>
							<HollowButton name={"投稿"} size={12} onPress={() => null} />
						</View>
					</View>
					<View style={styles.categoryItem}>
						<View style={styles.itemInfo}>
							<View>
								<Text style={styles.darkText}>
									向
									<Text style={styles.title}>《都是测试啊》</Text>
									投稿
								</Text>
							</View>
							<View>
								<Text style={styles.grayText}>审核中</Text>
							</View>
						</View>
						<View style={styles.button}>
							<HollowButton name={"撤回"} size={12} color={Colors.themeColor} onPress={() => null} />
						</View>
					</View>
					<DivisionLine height={20} />
					{/*
							<Query query={beSelectedCategory}>
								{({ loading, error, data, refetch }) => {
									if (error)
										return (
											<LoadingError reload={() => refetch()} />
										);
									if (!(data && data.category)) return null;
									return (
										<FlatList
											data={data.categories}
											keyExtractor={(item, index) =>
												index.toString()}
											renderItem={this.renderBeSelectedItem}
											ItemSeparatorComponent={() => (
												<View style={styles.ItemSeparator} />
											)}
										/>
									);
								}}
							</Query>
						**/}
					<View style={styles.categoryItem}>
						<View style={styles.itemInfo}>
							<View>
								<Text style={styles.darkText}>
									被
									<Text style={styles.title}>《好好学习》</Text>
									收入
								</Text>
							</View>
							<View>
								<Text style={styles.grayText}>已收入</Text>
							</View>
						</View>
						<View style={styles.button}>
							<HollowButton name={"移除"} size={12} color={Colors.themeColor} onPress={() => null} />
						</View>
					</View>
					<ContentEnd />
				</View>
			</Screen>
		);
	}

	renderContributeItem = ({ item, index }) => {
		return (
			<Mutation mutation={submitArticleMutation}>
				{submitArticle => {
					<View style={styles.categoryItem}>
						<View style={styles.itemInfo}>
							<View>
								<Text style={styles.darkText}>
									向
									<Text style={styles.title}>《{category.name}》</Text>
									投稿
								</Text>
							</View>
							<View>
								<Text style={styles.grayText}>{category.submite_status}</Text>
							</View>
						</View>
						<View style={styles.button}>
							<HollowButton
								name={"投稿"}
								size={12}
								color={Colors.themeColor}
								onPress={() => {
									submitArticle({
										variables: {
											category_id: category.id,
											article_id: article.id
										}
									});
								}}
							/>
						</View>
					</View>;
				}}
			</Mutation>
		);
	};

	renderBeSelectedItem = ({ item, index }) => {
		return (
			<Mutation mutation={removeContributeMutation}>
				{removeContribute => {
					<View style={styles.categoryItem}>
						<View style={styles.itemInfo}>
							<View>
								<Text style={styles.darkText}>
									被
									<Text style={styles.title}>《{category.name}》</Text>
									收入
								</Text>
							</View>
							<View>
								<Text style={styles.grayText}>已收入</Text>
							</View>
						</View>
						<View style={styles.button}>
							<HollowButton
								name={"移除"}
								size={12}
								color={Colors.themeColor}
								onPress={() => {
									removeContribute({
										variables: {
											category_id: category.id,
											article_id: article.id
										}
									});
								}}
							/>
						</View>
					</View>;
				}}
			</Mutation>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	categoryItem: {
		padding: 15,
		flexDirection: "row",
		alignItems: "center"
	},
	ItemSeparator: {
		height: 1,
		backgroundColor: Colors.tintGray
	},
	title: {
		color: Colors.linkColor,
		marginHorizontal: 5
	},
	darkText: {
		fontSize: 16,
		color: Colors.primaryFontColor
	},
	grayText: {
		fontSize: 13,
		color: Colors.tintFontColor,
		marginTop: 6
	},
	itemInfo: {
		flex: 1,
		marginRight: 20
	},
	button: {
		width: 58,
		height: 27
	}
});

export default ContributeManageScreen;
