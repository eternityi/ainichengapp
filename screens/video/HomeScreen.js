import React, { Component } from "react";
import {
	StyleSheet,
	View,
	ScrollView,
	FlatList,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	Animated,
	Image,
	Modal
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import ImageViewer from "react-native-image-zoom-viewer";

import Screen from "../Screen";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { userOperationMiddleware } from "../../constants/Methods";
import { FollowButton, HollowButton, Button } from "../../components/Button";
import { Header, HeaderLeft, HeaderRight } from "../../components/Header";
import { RewardModal, OperationModal, ReportModal } from "../../components/Modal";
import { Avatar, BlankContent, LoadingError, SpinnerLoading, LoadingMore } from "../../components/Pure";

import { connect } from "react-redux";
import { Query, Mutation, graphql, compose } from "react-apollo";
import { createChatMutation } from "../../graphql/chat.graphql";
import { userActionsQuery, blockUserMutation, blockedUsersQuery } from "../../graphql/user.graphql";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 70;

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handleBackdropVisible = this.handleBackdropVisible.bind(this);
		this.handleReportVisible = this.handleReportVisible.bind(this);
		this.state = {
			cover: "https://ainicheng.com/storage/img/71234.top.jpg",
			fetchingMore: true,
			reportVisible: false,
			backdropVisible: false,
			avatarViewerVisible: false,
			offsetTop: new Animated.Value(0)
		};
	}

	componentWillMount() {}

	render() {
		const { navigation, personal, login } = this.props;
		const user = navigation.getParam("user", {});
		// user.id == personal.id
		const self = true;
		let { fetchingMore, backdropVisible, reportVisible, avatarViewerVisible, offsetTop } = this.state;
		let headerTransparence = offsetTop.interpolate({
			inputRange: [0, HEADER_HEIGHT * 2],
			outputRange: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"],
			extrapolate: "clamp"
		});
		let lightHeaderOpacity = offsetTop.interpolate({
			inputRange: [0, HEADER_HEIGHT],
			outputRange: [1, 0],
			extrapolate: "clamp"
		});
		let darkHeaderOpacity = offsetTop.interpolate({
			inputRange: [HEADER_HEIGHT, HEADER_HEIGHT * 2],
			outputRange: [0, 1],
			extrapolate: "clamp"
		});
		return (
			<Screen noPadding>
				<Query query={userActionsQuery} variables={{ user_id: 1 }}>
					{({ loading, error, data, refetch, fetchMore }) => {
						if (error) return <LoadingError reload={() => refetch()} />;
						if (!(data && data.user && data.actions)) return <SpinnerLoading />;
						let user = data.user;
						let actions = data.actions;
						return (
							<View style={styles.container}>
								<FlatList
									bounces={false}
									ListHeaderComponent={() => this._renderListHeader(user, self)}
									data={actions}
									refreshing={loading}
									onRefresh={() => {
										fetch();
									}}
									keyExtractor={(item, index) => index.toString()}
									onScroll={Animated.event([
										{
											nativeEvent: { contentOffset: { y: offsetTop } }
										}
									])}
									renderItem={this._renderItem}
									onEndReachedThreshold={0.3}
									onEndReached={() => {
										if (actions) {
											fetchMore({
												variables: {
													offset: actions.length
												},
												updateQuery: (prev, { fetchMoreResult }) => {
													if (!(fetchMoreResult && fetchMoreResult.actions && fetchMoreResult.actions.length > 0)) {
														this.setState({
															fetchingMore: false
														});
														return prev;
													}
													return Object.assign({}, prev, {
														actions: [...prev.actions, ...fetchMoreResult.actions]
													});
												}
											});
										} else {
											this.setState({
												fetchingMore: false
											});
										}
									}}
									ListEmptyComponent={() => <BlankContent />}
									ListFooterComponent={() => {
										if (actions.length < 1) return <View />;
										return (
											<View style={{ paddingBottom: 25, backgroundColor: "#fff" }}>
												{fetchingMore ? <LoadingMore /> : <ContentEnd />}
											</View>
										);
									}}
								/>
								<Animated.View
									style={[
										styles.header,
										{ backgroundColor: headerTransparence },
										avatarViewerVisible && { backgroundColor: "#000" }
									]}
								>
									<Animated.View style={[styles.header, { opacity: lightHeaderOpacity }]}>
										<Header
											navigation={navigation}
											routeName={user.name}
											customStyle={styles.customStyle}
											lightTabBar
											rightComponent={this._headerRight("#fff", user, self)}
										/>
									</Animated.View>
									<Animated.View style={[styles.header, { opacity: darkHeaderOpacity }]}>
										<Header
											navigation={navigation}
											customStyle={styles.customStyle}
											leftComponent={
												<HeaderLeft navigation={navigation} routeName={true}>
													<View style={styles.layoutRow}>
														<Avatar size={28} uri={user.avatar} />
														<Text style={[styles.tintText14, { marginLeft: 5 }]}>{user.name}</Text>
													</View>
												</HeaderLeft>
											}
											rightComponent={this._headerRight("#515151", user, self)}
										/>
									</Animated.View>
								</Animated.View>
							</View>
						);
					}}
				</Query>
				<OperationModal
					visible={backdropVisible}
					operation={["更换背景"]}
					handleVisible={this.handleBackdropVisible}
					handleOperation={() => {
						//上传封面
						ImagePicker.openPicker({
							cropping: true
						})
							.then(image => {
								this.setState({
									backdropVisible: false,
									cover: image.path
								});
							})
							.catch(error => {});
					}}
				/>
				<ReportModal visible={reportVisible} handleVisible={this.handleReportVisible} type="user" report={user} />
			</Screen>
		);
	}

	_headerRight = (color, user, self) => {
		let { login } = this.props;
		return (
			<HeaderRight
				color={color}
				options={self ? ["分享用户"] : ["分享用户", "举报用户", user.isBlocked ? "移除黑名单" : "加入黑名单"]}
				selectHandler={index => {
					switch (index) {
						case 0:
							navigation.navigate("个人介绍", { user });
							break;
						case 1:
							this.handleReportVisible();
							break;
						case 2:
							this.putBlacklist(user.id);
							break;
					}
				}}
			/>
		);
	};

	_renderListHeader(user, self) {
		let { cover, avatarViewerVisible } = this.state;
		return (
			<View style={styles.userHeader}>
				<TouchableWithoutFeedback onPress={self ? this.handleBackdropVisible : null}>
					<Image
						style={styles.backdrop}
						source={{
							uri: cover
						}}
					/>
				</TouchableWithoutFeedback>
				<View style={styles.userInfo}>
					<View style={styles.baseInfo}>
						<TouchableOpacity style={styles.userAvatar} onPress={() => this.setState({ avatarViewerVisible: true })}>
							<Avatar uri={user.avatar} size={86} borderStyle={{ borderWidth: 0 }} />
						</TouchableOpacity>
						{self ? (
							<View style={styles.buttonGroup}>
								<View style={{ width: 70 }}>
									<Button name="编辑资料" fontSize={14} outline />
								</View>
							</View>
						) : (
							<View style={styles.buttonGroup}>
								<View style={{ width: 70, marginRight: 6 }}>
									<FollowButton
										customStyle={{ flex: 1, width: "auto" }}
										theme={Colors.themeColor}
										status={user.followed_status}
										id={user.id}
										type={"user"}
										fontSize={14}
									/>
								</View>
								<View style={{ width: 70 }}>
									<Button name="发信息" fontSize={14} outline />
								</View>
							</View>
						)}
					</View>
					<View style={styles.userMetaInfo}>
						<View style={styles.layoutRow}>
							<Text numberOfLines={1} style={styles.name}>
								{user.name}
							</Text>
							<Iconfont
								name={user.gender == 1 ? "girl" : "boy"}
								size={18}
								color={user.gender == 1 ? Colors.softPink : Colors.skyBlue}
							/>
						</View>
						<TouchableOpacity style={styles.userIntroduce}>
							<View style={{ flex: 1 }}>
								<Text numberOfLines={1} style={styles.tintText15}>
									简介: {user.introduction ? user.introduction : "ta还没有freestyle..."}
								</Text>
							</View>
							<Iconfont name={"right"} size={15} color={Colors.tintFontColor} />
						</TouchableOpacity>
						<View style={styles.layoutRow}>
							<TouchableOpacity style={styles.layoutRow}>
								<Text style={styles.darkText16}>{user.count_likes}</Text>
								<Text style={styles.tintText16}>获赞</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.layoutRow, styles.metaLine]}>
								<Text style={styles.darkText16}>{user.count_followings}</Text>
								<Text style={styles.tintText16}>关注</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.layoutRow}>
								<Text style={styles.darkText16}>{user.count_follows}</Text>
								<Text style={styles.tintText16}>粉丝</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={styles.tabList}>
					<TouchableOpacity style={{ flex: 1 }}>
						<View style={{ alignItems: "center" }}>
							<Image source={require("../../assets/images/like.png")} style={styles.listItemImg} />
							<View>
								<Text style={styles.listItemName}>喜欢</Text>
							</View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{ flex: 1 }}>
						<View style={{ alignItems: "center" }}>
							<Image source={require("../../assets/images/actively.png")} style={styles.listItemImg} />
							<View>
								<Text style={styles.listItemName}>动态</Text>
							</View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{ flex: 1 }}>
						<View style={{ alignItems: "center" }}>
							<Image source={require("../../assets/images/collection.png")} style={styles.listItemImg} />
							<View>
								<Text style={styles.listItemName}>作品集</Text>
							</View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity style={{ flex: 1 }}>
						<View style={{ alignItems: "center" }}>
							<Image source={require("../../assets/images/category.png")} style={styles.listItemImg} />
							<View>
								<Text style={styles.listItemName}>兴趣</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
				<Modal visible={avatarViewerVisible} transparent={true} onRequestClose={() => this.setState({ avatarViewerVisible: false })}>
					<ImageViewer
						onClick={() => this.setState({ avatarViewerVisible: false })}
						onSwipeDown={() => this.setState({ avatarViewerVisible: false })}
						imageUrls={[
							{
								url: user.avatar,
								width,
								height: width,
								resizeMode: "cover"
							}
						]}
					/>
				</Modal>
			</View>
		);
	}

	_renderItem = ({ item, index }) => {
		return <Text>我是发布的作品</Text>;
	};

	_onScroll(event) {
		let { y } = event.nativeEvent.contentOffset;
		if (y >= 100) {
			this.tabBar.setNativeProps({
				style: {
					opacity: 1
				}
			});
			this.fixTabBar.setNativeProps({
				style: {
					opacity: 0
				}
			});
		} else {
			this.tabBar.setNativeProps({
				style: {
					opacity: 0
				}
			});
		}
	}

	// 举报模态框
	handleReportVisible() {
		let { login, navigation } = this.props;
		userOperationMiddleware({
			login,
			navigation,
			action: () => this.setState(prevState => ({ reportVisible: !prevState.reportVisible }))
		});
	}

	// 更换背景模态框
	handleBackdropVisible() {
		this.setState(prevState => ({ backdropVisible: !prevState.backdropVisible }));
	}

	// 加入黑名单
	putBlacklist(id) {
		let { login, navigation, blockUserMutation } = this.props;
		userOperationMiddleware({
			login,
			navigation,
			action: () => {
				blockUserMutation({
					variables: {
						user_id: id
					},
					refetchQueries: result => [
						{
							query: blockedUsersQuery
						}
					]
				});
				this.setState(prevState => ({
					isBlocked: !prevState.isBlocked
				}));
			}
		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	layoutRow: {
		flexDirection: "row",
		alignItems: "center"
	},
	tintText16: {
		fontSize: 16,
		color: Colors.tintFontColor
	},
	tintText15: {
		fontSize: 15,
		color: Colors.tintFontColor
	},
	tintText14: {
		fontSize: 14,
		color: Colors.tintFontColor
	},
	darkText16: {
		fontSize: 16,
		fontWeight: "500",
		color: Colors.darkFontColor,
		marginRight: 3
	},
	userHeader: {
		borderBottomWidth: 4,
		borderColor: Colors.lightBorderColor
	},
	backdrop: {
		width,
		height: 160
	},
	userInfo: {
		paddingHorizontal: 15,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderColor: Colors.lightBorderColor
	},
	baseInfo: {
		height: 60,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	tabList: {
		height: 80,
		flexDirection: "row",
		alignItems: "center"
	},
	listItemImg: {
		width: 30,
		height: 30,
		resizeMode: "cover"
	},
	listItemName: {
		marginTop: 8,
		fontSize: 14,
		color: Colors.primaryFontColor
	},
	userAvatar: {
		marginRight: 20,
		marginTop: -30,
		borderWidth: 2,
		borderColor: "#fff",
		borderRadius: 45
	},
	name: {
		fontSize: 20,
		color: Colors.darkFontColor,
		fontWeight: "500",
		marginRight: 5
	},
	rewardButton: {
		width: 40,
		height: 40,
		borderRadius: 3,
		borderWidth: 1,
		borderColor: Colors.themeColor,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 12
	},
	userMetaInfo: {
		marginTop: 15
	},
	metaLine: {
		paddingHorizontal: 6,
		marginHorizontal: 6,
		borderRightWidth: 0.5,
		borderLeftWidth: 0.5,
		borderColor: Colors.lightBorderColor
	},
	userIntroduce: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		paddingVertical: 10,
		borderBottomWidth: 0.5,
		borderBottomColor: Colors.lightBorderColor
	},
	buttonGroup: {
		flexDirection: "row",
		height: 30
	},
	userMetaWrap: {
		height: 100,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center"
	},
	header: {
		position: "absolute",
		width,
		height: HEADER_HEIGHT,
		paddingTop: 24
	},
	customStyle: { backgroundColor: "transparent", borderBottomColor: "transparent" }
});

export default connect(store => {
	return {
		personal: store.users.user,
		login: store.users.login
	};
})(compose(graphql(blockUserMutation, { name: "blockUserMutation" }))(HomeScreen));
