import React, { Component } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Header from "../../components/Header/Header";
import HeaderLeft from "../../components/Header/HeaderLeft";
import CustomPopoverMenu from "../../components/Modal/CustomPopoverMenu";
import Colors from "../../constants/Colors";
import CollectionTopInfo from "./CollectionTopInfo";
import ScrollableTabView from "react-native-scrollable-tab-view";
import CustomScrollTabBar from "../../components/Pure/CustomScrollTabBar";

import LatestTab from "./LatestTab";
import CommentedTab from "./CommentedTab";
import IndexTab from "./IndexTab";
import MembersTab from "./MembersTab";
const { width, height } = Dimensions.get("window");
import Screen from "../Screen";

import actions from "../../store/actions";
import { connect } from "react-redux";
import { Mutation, Query } from "react-apollo";
import { collectionQuery } from "../../graphql/collection.graphql";

//获取自定义头部高度
let headerHeight = 70;

class HomeScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this._mainTopLoaded = this._mainTopLoaded.bind(this);
		this._outerScroll = this._outerScroll.bind(this);
		this.innerScroll = this.innerScroll.bind(this);
		this.tabSwitch = [];
		this.authorHeight = 0;
		this.membersHeight = 0;
		this.state = {
			tabNames: ["最新发布", "最新评论", "目录", "成员"],
			mainTopHeight: 0,
			currentTab: 0,
			scrollEnabled: true
		};
	}

	render() {
		let { tabNames, scrollEnabled, mainTopHeight } = this.state;
		let { navigation, collection_detail, user } = this.props;
		let { collection } = this.props.navigation.state.params;
		return (
			<Screen>
				<Query query={collectionQuery} variables={{ id: collection.id }}>
					{({ loading, error, data }) => {
						if (!(data && data.collection)) return null;
						let collection = data.collection;
						let isSelf = collection.user.id == user.id;
						return (
							<View style={styles.container}>
								<Header
									routeName={true}
									navigation={navigation}
									customStyle={!scrollEnabled ? { borderBottomColor: "transparent" } : null}
									rightComponent={
										<CustomPopoverMenu
											width={160}
											selectHandler={index => {
												switch (index) {
													case 0:
														if (isSelf) {
															navigation.navigate("编辑文集", {
																collection
															});
														} else {
															return "分享文集";
														}
														break;
													case 1:
														return "分享文集";
														break;
												}
											}}
											triggerComponent={<Iconfont name={"more-vertical"} size={20} color={Colors.tintFontColor} />}
											customOptionStyle={{
												optionWrapper: {
													alignItems: "flex-start",
													paddingHorizontal: 10
												}
											}}
											options={isSelf ? ["编辑", "分享文集"] : ["分享文集"]}
										/>
									}
								/>

								<ScrollView
									style={styles.container}
									bounces={false}
									onScroll={this._outerScroll}
									scrollEventThrottle={20}
									scrollEnabled={scrollEnabled}
								>
									<View onLayout={this._mainTopLoaded}>
										<CollectionTopInfo collection={collection} navigation={navigation} />
									</View>
									{!scrollEnabled && <View style={{ height: height - headerHeight }} /> /*position后撑开scrollview的空内容**/}
									<View
										style={[
											styles.collectionDetailTabScreen,
											/*根据scroll状态切换position**/
											!scrollEnabled ? { position: "absolute", top: mainTopHeight } : null
										]}
									>
										<ScrollableTabView
											renderTabBar={() => <CustomScrollTabBar tabNames={tabNames} tabBarStyle={{ paddingHorizontal: 20 }} />}
											onChangeTab={this._changeTab.bind(this)}
										>
											<LatestTab
												tabLabel="最新发布"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												collection={collection}
												gotArticleLength={num => this.gotArticleLength(num, 0)}
											/>
											<CommentedTab
												tabLabel="最新评论"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												collection={collection}
												gotArticleLength={num => this.gotArticleLength(num, 1)}
											/>
											<IndexTab
												tabLabel="目录"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												collection={collection}
												gotArticleLength={num => this.gotArticleLength(num, 2)}
											/>
											<MembersTab
												tabLabel="成员"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												collection={collection}
												calcAuthorHeight={this.calcAuthorHeight}
												calcMembersHeight={this.calcMembersHeight}
											/>
										</ScrollableTabView>
									</View>
								</ScrollView>
							</View>
						);
					}}
				</Query>
			</Screen>
		);
	}

	//获取maintop高度
	_mainTopLoaded(event) {
		let { x, y, width, height } = event.nativeEvent.layout;
		this.setState({ mainTopHeight: height });
	}

	_outerScroll(event) {
		let { mainTopHeight } = this.state;
		let { y } = event.nativeEvent.contentOffset;
		this.topReached = y >= mainTopHeight;
		this._scrollEnabled();
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

	_changeTab(obj) {
		this.setState({ currentTab: obj.i }, () => this._scrollEnabled());
	}

	// scrollEnabled判断逻辑
	_scrollEnabled = () => {
		let { currentTab } = this.state;
		this.calcMembersTabSwitch();
		if (currentTab == 3 && this.membersTabSwitch && this.topReached) {
			this.setState({ scrollEnabled: false });
		} else if (this.tabSwitch[currentTab] && this.topReached) {
			this.setState({ scrollEnabled: false });
		} else {
			this.setState({ scrollEnabled: true });
		}
	};

	// 150是article高度，55是endComponent的高度
	gotArticleLength(num, i) {
		this.tabSwitch[i] = 150 * num + headerHeight + 55 > height;
	}

	calcAuthorHeight = authorHeight => {
		this.authorHeight = authorHeight;
	};

	calcMembersHeight = memberHeight => {
		this.membersHeight += memberHeight;
	};

	calcMembersTabSwitch = () => {
		if (this.membersHeight) {
			this.membersTabSwitch = this.authorHeight + Math.floor(this.membersHeight / 3) + headerHeight + 55 > height;
		} else {
			this.membersTabSwitch = this.authorHeight + headerHeight > height;
		}
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	collectionDetailTabScreen: {
		width,
		height: height - headerHeight
	}
});

export default connect(store => ({
	user: store.users.user
}))(HomeScreen);
