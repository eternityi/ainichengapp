import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
// import { TabNavigator, TabBarTop } from "react-navigation";
import { Colors, Divice } from "../../../constants";
import { Iconfont } from "../../../utils/Fonts";

import ScrollableTabView from "react-native-scrollable-tab-view";
import FollowedUserScreen from "./FollowedUserScreen";
import FollowedCategoryScreen from "./FollowedCategoryScreen";
import { HeaderLeft, CustomTabBar } from "../../../components/Header";
import Screen from "../../Screen";

class FollowingsScreen extends Component {
	render() {
		let { navigation } = this.props;
		return (
			<Screen header>
				<View style={styles.container}>
					<ScrollableTabView
						renderTabBar={props => (
							<View style={styles.header}>
								<TouchableOpacity activeOpacity={1} style={styles.goBack} onPress={() => navigation.goBack()}>
									<Iconfont name={"back-ios"} size={23} color={Colors.primaryFontColor} />
								</TouchableOpacity>
								<CustomTabBar
									tabUnderlineWidth={20} // default containerWidth / (numberOfTabs * 4)
									tabUnderlineScaleX={3} // default 3
									activeColor={Colors.darkFontColor}
									inactiveColor={Colors.tintFontColor}
									{...props}
									containerWidth={160}
									style={{ height: 40, width: 160, borderWidth: 0 }}
								/>
							</View>
						)}
					>
						<FollowedUserScreen tabLabel="用户" navigation={navigation} />
						<FollowedCategoryScreen tabLabel="专题" navigation={navigation} />
					</ScrollableTabView>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	header: {
		paddingTop: Divice.STATUSBAR_HEIGHT,
		paddingHorizontal: 15,
		height: Divice.STATUSBAR_HEIGHT + 40,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.skinColor
	},
	goBack: {
		position: "absolute",
		flexDirection: "row",
		alignItems: "center",
		width: 40,
		height: 40,
		bottom: 0,
		left: 15
	}
});

export default FollowingsScreen;

// export default TabNavigator(
// 	{
// 		用户: {
// 			screen: FollowedUserScreen
// 		},
// 		专题: {
// 			screen: FollowedCategoryScreen
// 		}
// 	},
// 	{
// 		tabBarPosition: "top",
// 		animationEnabled: false,
// 		swipeEnabled: true,
// 		lazy: false,
// 		backBehavior: "none",
// 		tabBarOptions: {
// 			activeTintColor: Colors.darkFontColor,
// 			inactiveTintColor: Colors.primaryFontColor,
// 			style: {
// 				backgroundColor: "#fff",
// 				borderBottomWidth: 0,
// 				elevation: 0,
// 				shadowColor: "transparent",
// 				paddingTop: Divice.STATUSBAR_HEIGHT,
// 				paddingBottom: 6,
// 				paddingLeft: Divice.width / 2 - 60
// 			},
// 			indicatorStyle: {
// 				height: 2,
// 				width: 20,
// 				marginHorizontal: 20,
// 				backgroundColor: Colors.themeColor,
// 				left: Divice.width / 2 - 60,
// 				bottom: 6
// 			},
// 			labelStyle: {
// 				fontSize: 17,
// 				margin: 3
// 			},
// 			tabStyle: {
// 				width: 60,
// 				paddingHorizontal: 0
// 			}
// 		},
// 		tabBarComponent: props => <TabBarTop {...props} />
// 	}
// );
