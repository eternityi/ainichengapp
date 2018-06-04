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
		this.state = {
			tabNames: ["最新发布", "最新评论", "目录", "成员"],
			mainTopHeight: 0,
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
										>
											<LatestTab
												tabLabel="最新发布"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												collection={collection}
											/>
											<CommentedTab
												tabLabel="最新评论"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												collection={collection}
											/>
											<IndexTab
												tabLabel="目录"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												collection={collection}
											/>
											<MembersTab
												tabLabel="成员"
												scrollEnabled={!scrollEnabled}
												onScroll={this.innerScroll}
												navigation={navigation}
												collection={collection}
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
