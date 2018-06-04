import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";

import ScrollableTabView from "react-native-scrollable-tab-view";
import Header from "../../../components/Header/Header";
import HeaderLeft from "../../../components/Header/HeaderLeft";
import Search from "../../../components/Header/Search";
import User from "../../../components/Header/User";
import Colors from "../../../constants/Colors";
import Avatar from "../../../components/Pure/Avatar";
import CustomScrollTabBar from "../../../components/Pure/CustomScrollTabBar";
import Screen from "../../Screen";

import LatestTab from "./LatestTab";
import CommentedTab from "./CommentedTab";
import HotTab from "./HotTab";

class ArticlesScreen extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const { user = {} } = this.props.navigation.state.params;
    let { navigation } = this.props;
    return (
      <Screen>
        <View style={styles.container}>
          <Header
            navigation={navigation}
            leftComponent={
              <HeaderLeft navigation={navigation} routeName={true}>
                <TouchableOpacity style={{ marginRight: 6 }} onPress={() => navigation.navigate("用户详情", { user })}>
                  <Avatar size={28} uri={user.avatar} />
                </TouchableOpacity>
                <Text style={{ fontSize: 14, color: Colors.tintFontColor }}>{user.name}</Text>
              </HeaderLeft>
            }
            rightComponent={<Search navigation={navigation} routeName={"搜索文章"} />}
          />
          <ScrollableTabView
            renderTabBar={() => <CustomScrollTabBar tabNames={["最新发布", "最新评论", "热门"]} tabBarStyle={{ borderTopColor: "transparent" }} />}
          >
            <LatestTab tabLabel="最新发布" navigation={navigation} />
            <CommentedTab tabLabel="最新评论" navigation={navigation} />
            <HotTab tabLabel="热门" navigation={navigation} />
          </ScrollableTabView>
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  }
});

export default ArticlesScreen;
