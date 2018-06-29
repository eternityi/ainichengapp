import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Dimensions, Animated, Image, Modal } from "react-native";

import ImagePicker from "react-native-image-crop-picker";
import ImageViewer from "react-native-image-zoom-viewer";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import Screen from "../Screen";
import { RewardModal, OperationModal, ReportModal } from "../../components/Modal";

import { FollowButton, HollowButton, Button } from "../../components/Button";
import { Avatar, CustomScrollTabBar, LoadingError, SpinnerLoading } from "../../components/Pure";

const { width, height } = Dimensions.get("window");

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.handleRewardVisible = this.handleRewardVisible.bind(this);
		this.state = {
			offsetTop: new Animated.Value(0),
			rewardVisible: false,
			avatarViewerVisible: false,
			login: false,
			user: {},
			personal: {}
		};
	}

	componentWillMount() {}

	render() {
		let { offsetTop, rewardVisible, avatarViewerVisible, user, personal } = this.state;
		let { navigation } = this.props;
		let is_self = true;
		const imageTranslate = offsetTop.interpolate({
			inputRange: [0, 100],
			outputRange: [0, -100],
			extrapolate: "clamp"
		});
		return (
			<Screen noPadding>
				<ScrollView style={styles.container}>
					<View style={styles.container}>
						<View>
							<Image
								style={styles.backdrop}
								source={{
									uri: "https://ainicheng.com/storage/img/71234.top.jpg"
								}}
							/>
							<View style={styles.userInfo}>
								<View style={styles.baseInfo}>
									<TouchableOpacity style={styles.userAvatar}>
										<Avatar
											uri={"https://ainicheng.com/storage/avatar/123.jpg"}
											size={72}
											borderStyle={{ borderWidth: 2, borderColor: "#fff" }}
										/>
									</TouchableOpacity>
									<View style={{ flex: 1 }}>
										<View style={styles.layoutRow}>
											<Text numberOfLines={1} style={styles.name}>
												眸若止水
											</Text>
											<Iconfont
												name={user.gender == 1 ? "girl" : "boy"}
												size={18}
												color={user.gender == 1 ? Colors.softPink : Colors.skyBlue}
											/>
										</View>
									</View>
									<View style={{ marginLeft: 6, width: 60, height: 30 }}>
										{is_self ? (
											<Button name="编辑" fontSize={14} iconName={"write"} handler={this.handleRewardVisible} />
										) : (
											<Button name="送糖" fontSize={14} iconName={"gift"} handler={this.handleRewardVisible} />
										)}
									</View>
								</View>
								<View style={styles.metaInfo}>
									<View style={styles.layoutRow}>
										<TouchableOpacity style={styles.layoutRow}>
											<Text style={styles.countText}>1580</Text>
											<Text style={styles.tintText}>粉丝</Text>
										</TouchableOpacity>
										<TouchableOpacity style={[styles.layoutRow, styles.metaLine]}>
											<Text style={styles.countText}>12</Text>
											<Text style={styles.tintText}>关注</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.layoutRow}>
											<Text style={styles.countText}>23</Text>
											<Text style={styles.tintText}>关注的专题</Text>
										</TouchableOpacity>
									</View>
									<View style={styles.registerDate}>
										<Text style={styles.countText}>城龄: 105天</Text>
									</View>
									<TouchableOpacity style={styles.introduce}>
										<View style={{ flex: 1 }}>
											<Text numberOfLines={1} style={styles.tintText}>
												简介：ta还没有freestyle...
											</Text>
										</View>
										<Iconfont name={"right"} size={15} color={Colors.tintFontColor} />
									</TouchableOpacity>
								</View>
								{!is_self && (
									<View style={styles.buttonGroup}>
										<View style={{ flex: 1, marginRight: 5 }}>
											<FollowButton
												customStyle={{ flex: 1, width: "auto" }}
												id={user.id}
												type={"user"}
												status={user.followed_status}
												fontSize={16}
											/>
										</View>
										<View style={{ marginLeft: 5, flex: 1 }}>
											<HollowButton name={"聊天"} size={16} />
										</View>
										<RewardModal visible={rewardVisible} handleVisible={this.handleRewardVisible} />
									</View>
								)}
							</View>
							{/*查看头像大图**/}
							<Modal
								visible={avatarViewerVisible}
								transparent={true}
								onRequestClose={() => this.setState({ avatarViewerVisible: false })}
							>
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
					</View>
				</ScrollView>
			</Screen>
		);
	}

	handleRewardVisible() {
		let { login, navigation } = this.props;
		if (login) {
			this.setState(prevState => ({ rewardVisible: !prevState.rewardVisible }));
		} else {
			navigation.navigate("登录注册");
		}
	}

	_outerScroll(event) {
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
	tintText: {
		fontSize: 15,
		color: Colors.tintFontColor
	},
	countText: {
		fontSize: 15,
		color: Colors.darkFontColor,
		marginRight: 3
	},
	backdrop: {
		width,
		height: 160
	},
	userInfo: {
		paddingHorizontal: 15,
		paddingBottom: 15,
		borderBottomWidth: 4,
		borderColor: Colors.lightBorderColor
	},
	baseInfo: {
		height: 50,
		flexDirection: "row",
		alignItems: "center"
	},
	userAvatar: {
		marginRight: 20,
		marginTop: -22
	},
	name: {
		fontSize: 20,
		color: Colors.primaryFontColor,
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
	metaInfo: {
		marginTop: 15
	},
	metaLine: {
		paddingHorizontal: 6,
		marginHorizontal: 6,
		borderRightWidth: 0.5,
		borderLeftWidth: 0.5,
		borderColor: Colors.lightBorderColor
	},
	registerDate: {
		marginVertical: 10
	},
	introduce: {
		flexDirection: "row",
		alignItems: "center"
	},
	buttonGroup: {
		flexDirection: "row",
		height: 40,
		marginTop: 15
	},
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		overflow: "hidden"
	},
	backgroundImage: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		width: null,
		height: 100,
		resizeMode: "cover"
	},
	tabBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		width,
		height: 50,
		paddingHorizontal: 40,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: Colors.lightBorderColor,
		backgroundColor: Colors.skinColor,
		flexDirection: "row",
		justifyContent: "center",
		backgroundColor: "#ac85de"
	},
	tabItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
});

export default HomeScreen;
