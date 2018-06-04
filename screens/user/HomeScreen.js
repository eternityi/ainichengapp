import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
  Dimensions,
  FlatList,
  Animated,
  Easing,
  Platform,
  BackHandler,
  Modal
} from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import ImagePicker from "react-native-image-crop-picker";
import ImageViewer from "react-native-image-zoom-viewer";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";

import { Avatar, CustomScrollTabBar, LoadingError, SpinnerLoading } from "../../components/Pure";
import { RewardModal, OperationModal, ReportModal } from "../../components/Modal";
import { Header, HeaderLeft, HeaderRight, Search } from "../../components/Header";
import { FollowButton, HollowButton } from "../../components/Button";
import Screen from "../Screen";

import ActionsTab from "./ActionsTab";
import ArticlesTab from "./ArticlesTab";
import MoreTab from "./MoreTab";

import actions from "../../store/actions";
import { connect } from "react-redux";
import { Query, Mutation, graphql, compose } from "react-apollo";
import { userDetailQuery, blockUserMutation, blockedUsersQuery } from "../../graphql/user.graphql";
import { createChatMutation } from "../../graphql/chat.graphql";

const { width, height } = Dimensions.get("window");
//自定义头部高度
let headerHeight = 70;

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.handleRewardVisible = this.handleRewardVisible.bind(this);
    this.handleBackdropVisible = this.handleBackdropVisible.bind(this);
    this.handleReportVisible = this.handleReportVisible.bind(this);
    this.innerScroll = this.innerScroll.bind(this);
    this._changeTab = this._changeTab.bind(this);
    this._outerScroll = this._outerScroll.bind(this);
    this._mainTopLayout = this._mainTopLayout.bind(this);
    this.state = {
      mainTopHeight: 0,
      backgroundOpacity: new Animated.Value(0),
      tabNames: ["动态", "文章", "更多"],
      backdropVisible: false,
      lightTabBar: true,
      scrollEnabled: true,
      rewardVisible: false,
      reportVisible: false,
      avatarViewerVisible: false,
      currentTab: 1,
      cover: "https://www.dongmeiwei.com/storage/img/23433.top.jpg",
      isBlocked: false
    };
  }

  render() {
    let {
      mainTopHeight,
      backgroundOpacity,
      tabNames,
      backdropVisible,
      lightTabBar,
      scrollEnabled,
      rewardVisible,
      reportVisible,
      avatarViewerVisible,
      currentTab,
      cover,
      isBlocked
    } = this.state;
    let { navigation } = this.props;
    let { user } = this.props.navigation.state.params;
    let { user: currentUser, login } = this.props.users;
    let is_self = false;
    if (currentUser.id == user.id) {
      user = currentUser;
      is_self = true;
    }
    this.user = user;

    return (
      <Screen noPadding>
        <View style={styles.container}>
          {/*根据滚动开关判断状态栏颜色**/}
          <StatusBar translucent={true} backgroundColor={"transparent"} barStyle={scrollEnabled ? (lightTabBar ? "light-content" : "dark-content") : "dark-content"} />

          <Query query={userDetailQuery} variables={{ id: user.id }}>
            {({ loading, error, data, refetch }) => {
              if (error) return <LoadingError reload={() => refetch()} />;
              if (!(data && data.user)) return <SpinnerLoading />;
              let user = data.user;
              return (
                <ScrollView style={styles.container} onScroll={this._outerScroll} scrollEnabled={scrollEnabled} bounces={false} scrollEventThrottle={20}>
                  <View onLayout={this._mainTopLayout}>
                    <TouchableWithoutFeedback onPress={is_self ? this.handleBackdropVisible : null}>
                      <Image
                        style={styles.customBackground}
                        source={{
                          uri: cover
                        }}
                      />
                    </TouchableWithoutFeedback>
                    <View style={styles.userInfo}>
                      <View style={styles.userInfoTop}>
                        <TouchableOpacity style={styles.userAvatar} onPress={() => this.setState({ avatarViewerVisible: true })}>
                          <Avatar uri={user.avatar} size={90} borderStyle={{ borderWidth: 0 }} />
                        </TouchableOpacity>
                        <View>
                          <View style={{ marginBottom: 6 }}>
                            <Text style={{ fontSize: 20, color: Colors.primaryFontColor }}>{user.name}</Text>
                          </View>
                          <View>
                            <Text style={{ fontSize: 15, color: Colors.tintFontColor }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: Colors.primaryFontColor
                                }}
                              >
                                {user.count_follows}
                              </Text>{" "}
                              关注{"  "}
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: Colors.primaryFontColor
                                }}
                              >
                                {user.count_followings}
                              </Text>{" "}
                              粉丝
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.userInfoBottom}>
                        <TouchableOpacity style={styles.userBriefIntro} onPress={() => navigation.navigate("个人介绍", { user })}>
                          <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} style={{ fontSize: 15, color: "#666" }}>
                              {user.introduction ? user.introduction : "暂无简介"}
                            </Text>
                          </View>
                          <Iconfont name={"right"} size={16} color={Colors.primaryFontColor} />
                        </TouchableOpacity>
                        <View>
                          <Text style={{ fontSize: 15, color: Colors.tintFontColor }}>
                            写了{user.count_words}字，获得了{user.count_likes}个喜欢
                          </Text>
                        </View>
                      </View>
                      {currentUser.id == user.id ? (
                        <View style={styles.editorPersonData}>
                          <HollowButton onPress={() => navigation.navigate("编辑个人资料")}>
                            <Iconfont name={"editor"} size={16} color={"rgba(66,192,46,0.9)"} />
                            <Text style={{ fontSize: 14, color: "rgba(66,192,46,0.9)" }}> 编辑个人资料</Text>
                          </HollowButton>$
                        </View>
                      ) : (
                        <View style={{ flexDirection: "row", height: 40 }}>
                          <View style={{ marginRight: 6, flex: 1 }}>
                            <FollowButton customStyle={{ flex: 1, width: "auto" }} id={user.id} type={"user"} status={user.followed_status} fontSize={16} />
                          </View>
                          <View style={{ marginLeft: 6, flex: 1 }}>
                            <Mutation mutation={createChatMutation}>
                              {createChat => (
                                <HollowButton
                                  name={"发简讯"}
                                  size={16}
                                  onPress={() => {
                                    login
                                      ? navigation.navigate("聊天页", {
                                          withUser: user
                                        })
                                      : navigation.navigate("登录注册");
                                  }}
                                />
                              )}
                            </Mutation>
                          </View>
                          <TouchableOpacity style={styles.reward} onPress={this.handleRewardVisible}>
                            <Iconfont name={"sweets"} size={16} color={Colors.themeColor} />
                          </TouchableOpacity>
                          <RewardModal visible={rewardVisible} handleVisible={this.handleRewardVisible} />
                        </View>
                      )}
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
                  {!scrollEnabled && <View style={{ height: height - headerHeight }} /> /*position后扯开父级的空内容**/}
                  <View
                    style={[
                      styles.userDetailTabScreen,
                      /*根据scroll状态切换position**/
                      !scrollEnabled ? { position: "absolute", top: mainTopHeight } : null
                    ]}
                  >
                    <ScrollableTabView
                      initialPage={1}
                      renderTabBar={() => <CustomScrollTabBar tabNames={tabNames} tabItemWrapStyle={{ width: 80 }} />}
                      onChangeTab={this._changeTab}
                    >
                      <ActionsTab tabLabel="动态" scrollEnabled={!scrollEnabled} onScroll={this.innerScroll} navigation={navigation} user={user} />
                      <ArticlesTab tabLabel="文章" scrollEnabled={!scrollEnabled} onScroll={this.innerScroll} navigation={navigation} user={user} />
                      <MoreTab tabLabel="更多" scrollEnabled={!scrollEnabled} navigation={navigation} user={user} />
                    </ScrollableTabView>
                  </View>
                </ScrollView>
              );
            }}
          </Query>
          <Animated.View
            style={[
              styles.header,
              {
                backgroundColor: backgroundOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
                })
              }
            ]}
          >
            <View>
              <HeaderLeft navigation={navigation} color={lightTabBar ? "#fff" : "#515151"} routeName={lightTabBar ? true : user.name} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ marginRight: 20 }}>
                <Search navigation={navigation} color={lightTabBar ? "#fff" : "#515151"} routeName={"搜索文章"} />
              </View>
              <HeaderRight
                color={lightTabBar ? "#fff" : "#515151"}
                options={is_self ? ["分享用户"] : ["分享用户", "举报用户", isBlocked ? "移除黑名单" : "加入黑名单"]}
                selectHandler={index => {
                  switch (index) {
                    case 0:
                      navigation.navigate("个人介绍", { user });
                      break;
                    case 1:
                      this.handleReportVisible();
                      break;
                    case 2:
                      this.props.blockUserMutation({
                        variables: {
                          user_id: user.id
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
                      break;
                  }
                }}
              />
            </View>
          </Animated.View>
        </View>
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

  //获取maintop高度
  _mainTopLayout(event) {
    let { x, y, width, height } = event.nativeEvent.layout;
    this.setState({ mainTopHeight: height });
  }

  //根据scroll滚动高度 改变scrollenable状态以及执行头部动画
  _outerScroll(event) {
    let { currentTab, mainTopHeight } = this.state;
    let { y } = event.nativeEvent.contentOffset;
    this.offsetTop = y;
    let opacity = this.offsetTop > 15 ? this.offsetTop / 150 : 0;
    this._startHeaderAnimation(opacity);
    //根据当前tab页以及滚动高度控制跳转
    if (currentTab !== 2 && this.offsetTop >= mainTopHeight - headerHeight) {
      this.setState({ scrollEnabled: false });
    }
  }

  //切换tab页 判断scrollEnabled状态
  _changeTab(obj) {
    this.setState({ currentTab: obj.i });
    let { mainTopHeight } = this.state;
    if (obj.i !== 2 && this.offsetTop >= mainTopHeight - headerHeight) {
      this.setState({ scrollEnabled: false });
    } else {
      this.setState({ scrollEnabled: true });
    }
  }

  //头部动画
  _startHeaderAnimation(value) {
    let { backgroundOpacity, lightTabBar } = this.state;
    Animated.timing(backgroundOpacity, {
      toValue: value,
      duration: 10
      // easing: Easing.linear,
    }).start();
    if (value >= 0.4 && lightTabBar) {
      this.setState({ lightTabBar: false });
    } else if (value < 0.4 && !lightTabBar) {
      this.setState({ lightTabBar: true });
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

  //赞赏模态框开关
  handleRewardVisible() {
    this.setState(prevState => ({ rewardVisible: !prevState.rewardVisible }));
  }

  //更换背景模态框开关
  handleBackdropVisible() {
    this.setState(prevState => ({ backdropVisible: !prevState.backdropVisible }));
  }

  //举报模态框开关
  handleReportVisible() {
    this.setState(prevState => ({ reportVisible: !prevState.reportVisible }));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor,
    position: "relative"
  },
  customBackground: {
    width,
    height: 150
  },
  userInfo: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20
  },
  userInfoTop: {
    flexDirection: "row",
    paddingBottom: 20
  },
  userAvatar: {
    marginRight: 20,
    marginTop: -35,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 48
  },
  userInfoBottom: {
    marginBottom: 20
  },
  userBriefIntro: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  editorPersonData: {
    height: 40
  },
  reward: {
    width: 40,
    height: 40,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.themeColor,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12
  },
  userDetailTabScreen: {
    width,
    height: height - headerHeight
  },
  header: {
    position: "absolute",
    width,
    height: headerHeight,
    paddingTop: 24,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

export default connect(store => {
  return {
    users: store.users
  };
})(compose(graphql(blockUserMutation, { name: "blockUserMutation" }))(HomeScreen));
