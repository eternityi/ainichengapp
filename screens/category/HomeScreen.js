import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../components/Pure";
import { Header, HeaderLeft, Search } from "../../components/Header";
import { CustomPopoverMenu, ShareModal } from "../../components/Modal";
import CategoryTopInfo from "./CategoryTopInfo";
import ScrollableTabView from "react-native-scrollable-tab-view";
import CustomScrollTabBar from "../../components/Pure/CustomScrollTabBar";
import Screen from "../Screen";

import LatestTab from "./LatestTab";
import CommentedTab from "./CommentedTab";
import HotTab from "./HotTab";
import MembersTab from "./MembersTab";

const { width, height } = Dimensions.get("window");
//获取自定义头部高度
let headerHeight = 70;

import actions from "../../store/actions";
import { connect } from "react-redux";
import { Mutation, Query, graphql } from "react-apollo";
import { categoryQuery, deleteCategoryMutation } from "../../graphql/category.graphql";
import { userCategoriesQuery } from "../../../graphql/user.graphql";

class HomeScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this._mainTopLayout = this._mainTopLayout.bind(this);
		this._outerScroll = this._outerScroll.bind(this);
		this.innerScroll = this.innerScroll.bind(this);
		this.toggleModalVisible = this.toggleModalVisible.bind(this);
		this.state = {
			category: props.navigation.state.params.category,
			tabNames: ["最新收录", "最新评论", "热门", "成员"],
			mainTopHeight: 0,
			scrollEnabled: true,
			modalVisible: false
		};
	}

	render() {
		let { category, tabNames, scrollEnabled, mainTopHeight, modalVisible } = this.state;
		let { navigation, user, deleteCategory } = this.props;
		return (
			<Screen>
				<Query query={categoryQuery} variables={{ id: category.id }}>
					{({ loading, error, data, refetch }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (!(data && data.category)) return <SpinnerLoading />;
						let isSelf = data.category.user.id == user.id;
						let followed = data.category.followed;
						console.log("专题ＩＤ");
						console.log(data.category.id);
						return (
							<View style={styles.container}>
								<Header
									routeName
									navigation={navigation}
									customStyle={
										!scrollEnabled
											? {
													borderBottomColor: "transparent"
												}
											: null
									}
									rightComponent={
										<View
											style={{
												flexDirection: "row",
												alignItems: "center"
											}}
										>
											<View style={{ marginRight: 15 }}>
												<Search navigation={navigation} routeName={"搜索文章"} />
											</View>
											<CustomPopoverMenu
												width={160}
												selectHandler={index => {
													if (isSelf) {
														switch (index) {
															case 0:
																navigation.navigate("新建专题", {
																	category: data.category
																});
																break;
															case 1:
																deleteCategory({
																	variables: {
																		id: data.category.id
																	},
																	refetchQueries: deleteCategoryResult => [
																		{
																			query: userCategoriesQuery,
																			variables: {
																				user_id: user.id
																			}
																		}
																	]
																});
																navigation.goBack();
																break;
															case 2:
																this.toggleModalVisible();
																break;
														}
													} else {
														this.toggleModalVisible();
													}
												}}
												triggerComponent={<Iconfont name={"more-vertical"} size={20} color={Colors.tintFontColor} />}
												customOptionStyle={{
													optionWrapper: {
														alignItems: "flex-start",
														paddingHorizontal: 10
													}
												}}
												options={isSelf ? ["编辑", "删除专题", "分享专题"] : ["分享专题"]}
											/>
										</View>
									}
								/>

								<ScrollView
									style={styles.container}
									onScroll={this._outerScroll}
									scrollEnabled={scrollEnabled}
									bounces={false}
									scrollEventThrottle={20}
								>
									<View onLayout={this._mainTopLayout}>
										<CategoryTopInfo category={data.category} navigation={navigation} />
									</View>
									{!scrollEnabled && (
										<View
											style={{
												height: height - headerHeight
											}}
										/>
									) /*position后扯开父级的空内容**/}
									<View
										style={[
											styles.categoryDetailTabScreen,
											/*根据scroll状态切换position**/
											!scrollEnabled
												? {
														position: "absolute",
														top: mainTopHeight
													}
												: null
										]}
									>
										<ScrollableTabView
											renderTabBar={() => (
												<CustomScrollTabBar
													tabNames={tabNames}
													tabBarStyle={{
														paddingHorizontal: 20
													}}
												/>
											)}
										>
											<LatestTab
												tabLabel="最新收录"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												category={data.category}
											/>
											<CommentedTab
												tabLabel="最新评论"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												category={data.category}
											/>
											<HotTab
												tabLabel="热门"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												category={data.category}
											/>
											<MembersTab
												tabLabel="成员"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												category={data.category}
											/>
										</ScrollableTabView>
									</View>
								</ScrollView>
							</View>
						);
					}}
				</Query>
				<ShareModal plain visible={modalVisible} toggleVisible={this.toggleModalVisible} />
			</Screen>
		);
	}

	//获取maintop高度
	_mainTopLayout(event) {
		let { x, y, width, height } = event.nativeEvent.layout;
		this.setState({ mainTopHeight: height });
	}

	_outerScroll(event) {
		let { mainTopHeight } = this.state;
		let { y } = event.nativeEvent.contentOffset;
		//根据滚动高度控制跳转
		if (y >= mainTopHeight) {
			this.setState({ scrollEnabled: false });
		}
	}

	//内部滚动切换scrollEnabled
	innerScroll(event) {
		let { y } = event.nativeEvent.contentOffset;
		if (y <= 1) {
			this.setState({
				scrollEnabled: true
			});
		}
	}

	toggleModalVisible() {
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
	categoryDetailTabScreen: {
		width,
		height: height - headerHeight
	}
});

export default connect(store => ({
	user: store.users.user
}))(graphql(deleteCategoryMutation, { name: "deleteCategory" })(HomeScreen));
