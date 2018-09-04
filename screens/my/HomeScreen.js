import React from "react";
import { ScrollView, FlatList, StyleSheet, Text, View, Button, TouchableOpacity, TouchableHighlight, Image } from "react-native";

import { Colors, Config, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";
import { ShareModal } from "../../components/Modal";
import UserTopInfo from "./UserTopInfo";
import { Header } from "../../components/Header";
import { DivisionLine, ContentEnd } from "../../components/Pure";
import Screen from "../Screen";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { withApollo } from "react-apollo";
import { userResourceCountQuery } from "../../graphql/user.graphql";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.toggleModalVisible = this.toggleModalVisible.bind(this);
    this.state = {
      modalVisible: false
    };
  }

  componentDidMount() {
    let { navigation } = this.props;
    this.didFocusSubscription = navigation.addListener("didFocus", payload => {
      let { user, client, dispatch } = this.props;
      if (user && user.id) {
        client
          .query({
            query: userResourceCountQuery,
            variables: {
              id: user.id
            },
            fetchPolicy: "network-only"
          })
          .then(({ data }) => {
            console.log("data", data);
            dispatch(actions.updateUserResource(data.user));
          })
          .catch(error => {
            console.log("error", error);
          });
      }
    });
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  render() {
    let { modalVisible } = this.state;
    const { navigation, user, login } = this.props;
    return (
      <Screen>
        <ScrollView style={styles.container} bounces={false}>
          <View style={{ marginTop: Divice.STATUSBAR_HEIGHT }}>
            <UserTopInfo user={user} login={login} navigation={navigation} />
          </View>
          {login && (
            <View style={styles.flowContainer}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate("我的发布", { user })}>
                <View style={styles.flowList}>
                  <Text style={styles.flowQuantity}>{user.count_production || 0}</Text>
                  <Text style={styles.flowType}>发布</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate("关注", { user })}>
                <View style={styles.flowList}>
                  <Text style={styles.flowQuantity}>{user.count_followings || 0}</Text>
                  <Text style={styles.flowType}>关注</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate("粉丝", { user })}>
                <View style={styles.flowList}>
                  <Text style={styles.flowQuantity}>{user.count_followers || 0}</Text>
                  <Text style={styles.flowType}>粉丝</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          <DivisionLine style={{ height: 15, marginTop: -1 }} />
          <View style={styles.columnContainer}>
            <TouchableOpacity onPress={() => this.navigateMiddlewear("私密作品")}>
              <View style={styles.columnItem}>
                <Iconfont name={"lock"} size={20} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
                <Text style={styles.columnType}>私密作品</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.navigateMiddlewear("我的收藏")}>
              <View style={styles.columnItem}>
                <Iconfont name={"label"} size={19} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
                <Text style={styles.columnType}>我的收藏</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.navigateMiddlewear("喜欢", { user })}>
              <View style={styles.columnItem}>
                <Iconfont name={"like"} size={18} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
                <Text style={styles.columnType}>我喜欢的</Text>
              </View>
            </TouchableOpacity>
          </View>
          <DivisionLine style={{ height: 15, marginTop: -1 }} />
          <View style={styles.columnContainer}>
            <TouchableOpacity onPress={() => this.navigateMiddlewear("个人专题", { user })}>
              <View style={styles.columnItem}>
                <Iconfont name={"category"} size={19} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
                <Text style={styles.columnType}>我的专题</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.navigateMiddlewear("个人文集", { user })}>
              <View style={styles.columnItem}>
                <Iconfont name={"collection"} size={19} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
                <Text style={styles.columnType}>我的文集</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.navigateMiddlewear("关注的专题和文集", { user })}>
              <View style={styles.columnItem}>
                <Iconfont name={"followed"} size={19} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
                <Text style={styles.columnType}>关注的专题/文集</Text>
              </View>
            </TouchableOpacity>
          </View>
          <DivisionLine style={{ height: 15, marginTop: -1 }} />
          <View style={styles.columnContainer}>
            <TouchableOpacity onPress={() => this.navigateMiddlewear("浏览记录")}>
              <View style={styles.columnItem}>
                <Iconfont name={"time"} size={19} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
                <Text style={styles.columnType}>浏览记录</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("设置")}>
              <View style={styles.columnItem}>
                <Iconfont name={"fill-setting"} size={19} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
                <Text style={styles.columnType}>设置</Text>
              </View>
            </TouchableOpacity>
            {
              // <TouchableOpacity onPress={() => this.navigateMiddlewear("我的钱包")}>
              //   <View style={[styles.columnItem, styles.noBorder]}>
              //     <Iconfont name={"wallet"} size={19} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
              //     <Text style={styles.columnType}>我的钱包</Text>
              //   </View>
              // </TouchableOpacity>
              // <TouchableOpacity onPress={() => navigation.navigate("意见反馈")}>
              //   <View style={styles.columnItem}>
              //     <Iconfont name={"feedback"} size={18} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
              //     <Text style={styles.columnType}>意见反馈</Text>
              //   </View>
              // </TouchableOpacity>
              // <TouchableOpacity onPress={this.toggleModalVisible}>
              //   <View style={styles.columnItem}>
              //     <Iconfont name={"share"} size={18} style={{ width: 20, height: 20, textAlign: "center" }} color={Colors.tintFontColor} />
              //     <Text style={styles.columnType}>分享{Config.AppDisplayName}</Text>
              //   </View>
              // </TouchableOpacity>
            }
          </View>
        </ScrollView>
        <ShareModal plain visible={modalVisible} toggleVisible={this.toggleModalVisible} />
      </Screen>
    );
  }

  navigateMiddlewear(routeName, params) {
    let { navigation, login } = this.props;
    if (login) {
      navigation.navigate(routeName, { ...params });
    } else {
      navigation.navigate("登录注册", { login: true });
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
  flowContainer: {
    flexDirection: "row",
    height: 60,
    justifyContent: "space-around",
    alignItems: "center"
  },
  flowList: {
    alignItems: "center"
  },
  flowQuantity: {
    fontSize: 18,
    color: Colors.primaryFontColor
  },
  flowType: {
    marginTop: 6,
    fontSize: 13,
    color: Colors.tintFontColor
  },
  columnContainer: {
    paddingHorizontal: 15
  },
  columnItem: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorderColor
  },
  noBorder: {
    borderBottomWidth: 0
  },
  columnType: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 15,
    color: "#666"
  },
  columnQuantity: {
    fontSize: 13,
    color: Colors.tintFontColor
  }
});

export default connect(store => {
  return { user: store.users.user, login: store.users.login };
})(withApollo(HomeScreen));
