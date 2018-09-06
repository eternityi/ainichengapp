import React from "react";
import { Colors, Divice } from "../../constants";
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
        paddingTop: Divice.STATUSBAR_HEIGHT,
        paddingLeft: Divice.width / 2 - 50
      },
      indicatorStyle: {
        height: 2,
        width: 50,
        backgroundColor: Colors.themeColor,
        marginLeft: Divice.width / 2 - 50
      },
      labelStyle: {
        fontSize: 17,
        margin: 3
      },
      tabStyle: {
        width: 50,
        paddingHorizontal: 0
      }
    },
    tabBarComponent: props => <TabBarTop {...props} />
  }
);
