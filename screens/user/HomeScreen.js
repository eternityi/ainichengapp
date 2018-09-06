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
import { Colors, Divice, Methods } from "../../constants";
import PostItem from "../../components/Article/PostItem";
import { FollowButton, Button } from "../../components/Button";
import { Header, HeaderLeft, HeaderRight } from "../../components/Header";
import { RewardModal, OperationModal, ReportModal, ShareModal } from "../../components/Modal";

import { Avatar, BlankContent, LoadingError, SpinnerLoading, LoadingMore, ContentEnd } from "../../components/Pure";

import { connect } from "react-redux";
import { Query, Mutation, graphql, compose } from "react-apollo";
import { createChatMutation } from "../../graphql/chat.graphql";
import { userDetailQuery, blockUserMutation, blockedUsersQuery } from "../../graphql/user.graphql";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.handleReportVisible = this.handleReportVisible.bind(this);
    this.handleSlideShareMenu = this.handleSlideShareMenu.bind(this);
    this.state = {
      fetchingMore: true,
      reportVisible: false,
      avatarViewerVisible: false,
      shareModalVisible: false,
      offsetTop: new Animated.Value(0)
    };
  }

  render() {
    const { navigation, personal, login } = this.props;
    const user = navigation.getParam("user", {});
    const self = user.id == personal.id;
    let { fetchingMore, reportVisible, avatarViewerVisible, shareModalVisible, offsetTop } = this.state;
    let userOpacity = offsetTop.interpolate({
      inputRange: [100, 200],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });
    return (
      <Screen header>
        <Query query={userDetailQuery} variables={{ id: user.id }}>
          {({ loading, error, data, refetch, fetchMore }) => {
            if (error) return <LoadingError reload={() => refetch()} />;
            if (!(data && data.user && data.articles)) return <SpinnerLoading />;
            let user = data.user;
            let articles = data.articles;
            return (
              <View style={styles.container}>
                <Header
                  customStyle={{ backgroundColor: "transparent", borderBottomColor: "transparent" }}
                  leftComponent={
                    <HeaderLeft>
                      <Animated.View style={[styles.headerUser, { opacity: userOpacity }]}>
                        <Avatar size={28} uri={user.avatar} />
                        <Text style={styles.headerUserName}>{user.name}</Text>
                        <FollowButton
                          id={user.id}
                          type={"user"}
                          customStyle={styles.followButton}
                          status={user.followed_status}
                          fontSize={user.followed_status == 2 ? 13 : 14}
                        />
                      </Animated.View>
                    </HeaderLeft>
                  }
                  centerComponent
                  rightComponent={this._headerRight(user, self)}
                />
                <FlatList
                  bounces={false}
                  ListHeaderComponent={() => this._renderListHeader(user, self)}
                  data={articles}
                  refreshing={loading}
                  onRefresh={() => {
                    fetch();
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEventThrottle={16}
                  onScroll={Animated.event([
                    {
                      nativeEvent: { contentOffset: { y: offsetTop } }
                    }
                  ])}
                  renderItem={this._renderItem}
                  onEndReachedThreshold={0.8}
                  onEndReached={() => {
                    if (articles) {
                      fetchMore({
                        variables: {
                          offset: articles.length
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!(fetchMoreResult && fetchMoreResult.articles && fetchMoreResult.articles.length > 0)) {
                            this.setState({
                              fetchingMore: false
                            });
                            return prev;
                          }
                          return Object.assign({}, prev, {
                            articles: [...prev.articles, ...fetchMoreResult.articles]
                          });
                        }
                      });
                    } else {
                      this.setState({
                        fetchingMore: false
                      });
                    }
                  }}
                  ListEmptyComponent={() => <BlankContent remind="TA还没有发布任何作品" />}
                  ListFooterComponent={() => {
                    if (articles.length < 1) return <View />;
                    return fetchingMore ? <LoadingMore /> : <ContentEnd />;
                  }}
                />
              </View>
            );
          }}
        </Query>
        <ReportModal visible={reportVisible} handleVisible={this.handleReportVisible} type="user" report={user} />
        <ShareModal visible={shareModalVisible} toggleVisible={this.handleSlideShareMenu} />
      </Screen>
    );
  }

  // 头部popover
  _headerRight = (user, self, color = Colors.primaryFontColor) => {
    if (self) {
      return null;
    }
    let { login, navigation } = this.props;
    return (
      <HeaderRight
        color={color}
        options={["举报用户", user.isBlocked ? "移除黑名单" : "加入黑名单"]}
        selectHandler={index => {
          switch (index) {
            case 0:
              this.handleReportVisible();
              break;
            case 1:
              this.putBlacklist(user.id);
              break;
          }
        }}
      />
    );
  };

  // 个人信息
  _renderListHeader(user, self) {
    let { avatarViewerVisible, shareModalVisible } = this.state;
    let { navigation } = this.props;
    return (
      <View>
        <View style={styles.userInfo}>
          <View style={styles.layoutFlexCenter}>
            <TouchableOpacity style={styles.userAvatar} onPress={() => this.setState({ avatarViewerVisible: true })}>
              <Avatar uri={user.avatar} size={70} borderStyle={{ borderWidth: 0 }} />
            </TouchableOpacity>
            <View style={styles.layoutFlexRow}>
              <Text numberOfLines={1} style={styles.userName}>
                {user.name}
              </Text>
              <Iconfont name={user.gender == 1 ? "girl" : "boy"} size={18} color={user.gender == 1 ? Colors.softPink : Colors.skyBlue} />
            </View>
            {user.introduction && (
              <View>
                <Text numberOfLines={2} style={styles.introduceText}>
                  {user.introduction}
                </Text>
              </View>
            )}
            {self ? (
              <Button style={styles.button} fontSize={15} name="编辑资料" handler={() => navigation.navigate("编辑个人资料")} />
            ) : (
              <FollowButton
                customStyle={styles.button}
                theme={Colors.themeColor}
                status={user.followed_status}
                id={user.id}
                type={"user"}
                fontSize={16}
              />
            )}

            <View style={styles.layoutFlexRow}>
              <View style={[styles.layoutFlexCenter, { flex: 1 }]}>
                <Text style={styles.darkText16}>{user.count_likes || 0}</Text>
                <Text style={styles.tintText14}>获赞</Text>
              </View>
              <TouchableOpacity style={[styles.layoutFlexCenter, { flex: 1 }]} onPress={() => navigation.navigate("关注", { user })}>
                <Text style={styles.darkText16}>{user.count_followings || 0}</Text>
                <Text style={styles.tintText14}>关注</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.layoutFlexCenter, { flex: 1 }]} onPress={() => navigation.navigate("粉丝", { user })}>
                <Text style={styles.darkText16}>{user.count_follows || 0}</Text>
                <Text style={styles.tintText14}>粉丝</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[styles.layoutFlexRow, styles.tabList]}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate("喜欢", { user })}>
            <View style={{ alignItems: "center" }}>
              <Image source={require("../../assets/images/like.png")} style={styles.listItemImg} />
              <View>
                <Text style={styles.listItemName}>喜欢</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() =>
              navigation.navigate("动态", {
                user,
                self
              })
            }
          >
            <View style={{ alignItems: "center" }}>
              <Image source={require("../../assets/images/actively.png")} style={styles.listItemImg} />
              <View>
                <Text style={styles.listItemName}>动态</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() =>
              navigation.navigate("个人文集", {
                user
              })
            }
          >
            <View style={{ alignItems: "center" }}>
              <Image source={require("../../assets/images/collection.png")} style={styles.listItemImg} />
              <View>
                <Text style={styles.listItemName}>文集</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() =>
              navigation.navigate("关注的专题和文集", {
                user
              })
            }
          >
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
                width: Divice.width,
                height: Divice.width,
                resizeMode: "cover"
              }
            ]}
          />
        </Modal>
      </View>
    );
  }

  _renderItem = ({ item, index }) => {
    return <PostItem post={item} toggleShareModal={this.handleSlideShareMenu} />;
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
    Methods.userOperationMiddleware({
      login,
      navigation,
      action: () => this.setState(prevState => ({ reportVisible: !prevState.reportVisible }))
    });
  }

  // 分享模态框
  handleSlideShareMenu(post) {
    this.setState(prevState => ({
      shareModalVisible: !prevState.shareModalVisible
    }));
  }

  // 加入黑名单
  putBlacklist(id) {
    let { login, navigation, blockUserMutation } = this.props;
    Methods.userOperationMiddleware({
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
          ],
          // todo 加入黑名单更新cache
          update: (cache, { data }) => {
            let { user, articles } = cache.readQuery({ query: userDetailQuery, variables: { id } });
            cache.writeQuery({
              query: userDetailQuery,
              variables: { id },
              data: {
                user: {
                  ...user,
                  isBlocked: !user.isBlocked
                },
                articles
              }
            });
          }
        });
      }
    });
  }

  // 发信息
  chatting(user) {
    let { login, navigation } = this.props;
    Methods.userOperationMiddleware({
      login,
      navigation,
      action: () =>
        navigation.navigate("聊天页", {
          withUser: user
        })
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  layoutFlexRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  layoutFlexCenter: {
    alignItems: "center",
    justifyContent: "center"
  },
  tintText14: {
    fontSize: 14,
    color: Colors.tintFontColor
  },
  headerUser: {
    flexDirection: "row",
    alignItems: "center",
    opacity: 0
  },
  headerUserName: {
    fontSize: 14,
    color: Colors.primaryFontColor,
    marginLeft: 10
  },
  darkText16: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.darkFontColor,
    marginBottom: 5
  },
  userInfo: {
    paddingHorizontal: 15
  },
  tabList: {
    height: 80,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 6,
    borderColor: Colors.lightBorderColor
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
    marginBottom: 20
  },
  userName: {
    fontSize: 19,
    color: Colors.darkFontColor,
    fontWeight: "500",
    marginRight: 5
  },
  introduceText: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 10,
    color: Colors.tintFontColor,
    textAlign: "center"
  },
  button: { width: 90, height: 34, marginVertical: 15, borderRadius: 45, borderWidth: 0 },
  followButton: {
    width: "auto",
    paddingHorizontal: 10,
    height: 26,
    marginLeft: 10,
    borderRadius: 13
  }
});

export default connect(store => {
  return {
    personal: store.users.user,
    login: store.users.login
  };
})(compose(graphql(blockUserMutation, { name: "blockUserMutation" }))(HomeScreen));
