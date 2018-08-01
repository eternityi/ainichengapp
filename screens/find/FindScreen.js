import React from "react";
import Colors from "../../constants/Colors";
import { TabNavigator, TabBarTop } from "react-navigation";
import { Text, View, Platform } from "react-native";

import Search from "../../components/Header/Search";
import RecommendScreen from "./RecommendScreen";
import CategoriesScreen from "./CategoriesScreen";
import CustomFindTab from "./CustomFindTab";

export default TabNavigator(
  {
    推荐: {
      screen: RecommendScreen
    },
    专题: {
      screen: CategoriesScreen
    }
  },
  {
    tabBarPosition: "top",
    animationEnabled: false,
    swipeEnabled: true,
    lazy: false,
    backBehavior: "none",
    tabBarOptions: {
      activeTintColor: Colors.themeColor,
      inactiveTintColor: Colors.primaryFontColor,
      style: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightBorderColor,
        elevation: 0,
        height: 70,
        paddingTop: 24,
        paddingLeft: 15
      },
      indicatorStyle: {
        height: 2,
        width: 50,
        backgroundColor: Colors.themeColor,
        marginLeft: 15
      },
      labelStyle: {
        fontSize: 17,
        margin: 3
      },
      tabStyle: {
        width: 50,
        paddingHorizontal: 0
      },
      tabBarOnPress: ({ scene, jumpToIndex }) => {
        console.log("tabBarOnPress");
      }
    },
    tabBarComponent: props => <TabBarTop {...props} />
  }
);
