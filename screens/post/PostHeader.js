import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, FlatList } from "react-native";
import Modal from "react-native-modal";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

import { Colors, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";
import { Header, HeaderLeft } from "../../components/Header";
import { Avatar } from "../../components/Pure";
import { FollowButton } from "../../components/Button";
import { CustomPopoverMenu, ReportModal } from "../../components/Modal";

import { Query, Mutation, compose, graphql } from "react-apollo";
import { favoriteArticleMutation } from "../../graphql/article.graphql";
import { connect } from "react-redux";
import actions from "../../store/actions";

// menu options样式
const popoverOption = {
  optionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorderColor
  }
};

class PostHeader extends Component {
  constructor(props) {
    super(props);
    this.toggleReportModal = this.toggleReportModal.bind(this);
    this.state = {
      reportModalVisible: false
    };
  }

  render() {
    let { reportModalVisible } = this.state;
    let { navigation, post, share, personal, login, lightBar } = this.props;
    let { user, time_ago } = post;
    let self = personal.id == user.id ? true : false;
    return (
      <Mutation mutation={favoriteArticleMutation}>
        {favoriteArticle => {
          return (
            <View>
              <Header
                lightBar
                leftComponent={
                  <HeaderLeft color={lightBar ? "#fff" : Colors.primaryFontColor}>
                    <TouchableOpacity style={{ marginRight: 6 }} onPress={() => navigation.navigate("用户详情", { user })}>
                      <Avatar size={30} uri={user.avatar} />
                    </TouchableOpacity>
                    <Text style={[styles.name, lightBar && { color: "#fff" }]}>{user.name}</Text>
                    <FollowButton
                      id={user.id}
                      type={"user"}
                      customStyle={lightBar ? styles.transparentButton : styles.fillButton}
                      fontColor={lightBar ? "#fff" : null}
                      theme={lightBar ? "transparent" : Colors.weixinColor}
                      under={lightBar ? "transparent" : Colors.darkGray}
                      status={user.followed_status}
                    />
                  </HeaderLeft>
                }
                centerComponent
                rightComponent={
                  <View>
                    <CustomPopoverMenu
                      width={140}
                      selectHandler={index => {
                        switch (index) {
                          case 0:
                            //收藏
                            if (login) {
                              favoriteArticle({
                                variables: {
                                  article_id: post.id
                                }
                              });
                            } else {
                              navigation.navigate("登录注册");
                            }
                            break;
                          case 1:
                            //分享
                            // share();
                            break;
                          case 2:
                            //举报
                            if (login) {
                              this.toggleReportModal();
                            } else {
                              navigation.navigate("登录注册");
                            }
                            break;
                        }
                      }}
                      triggerComponent={<Iconfont name={"more-vertical"} size={23} color={lightBar ? "#fff" : Colors.primaryFontColor} />}
                    >
                      {self ? (
                        <View>
                          <MenuOption value={0} customStyles={popoverOption}>
                            <Iconfont name={post.favorited ? "star" : "star-outline"} size={22} color={"#717171"} style={{ marginRight: 16 }} />
                            <Text style={styles.optionText}>{post.favorited ? "取消收藏" : "收藏"}</Text>
                          </MenuOption>
                          {
                            // 隐藏第三方social
                            // <MenuOption value={1} customStyles={popoverOption}>
                            //   <Iconfont name={"share"} size={19} color={"#717171"} style={{ marginRight: 16 }} />
                            //   <Text style={styles.optionText}>分享</Text>
                            // </MenuOption>
                          }
                        </View>
                      ) : (
                        <View>
                          <MenuOption value={0} customStyles={popoverOption}>
                            <Iconfont name={post.favorited ? "star" : "star-outline"} size={22} color={"#717171"} style={{ marginRight: 16 }} />
                            <Text style={styles.optionText}>{post.favorited ? "取消收藏" : "收藏"}</Text>
                          </MenuOption>
                          {
                            // 隐藏第三方social
                            // <MenuOption value={1} customStyles={popoverOption}>
                            //   <Iconfont name={"share"} size={19} color={"#717171"} style={{ marginRight: 16 }} />
                            //   <Text style={styles.optionText}>分享</Text>
                            // </MenuOption>
                          }
                          <MenuOption value={2} customStyles={popoverOption}>
                            <Iconfont name={"hint-fill"} size={22} color={"#717171"} style={{ marginRight: 16 }} />
                            <Text style={styles.optionText}>举报</Text>
                          </MenuOption>
                        </View>
                      )}
                    </CustomPopoverMenu>
                  </View>
                }
              />
              <ReportModal visible={reportModalVisible} handleVisible={this.toggleReportModal} report={post} type={"article"} />
            </View>
          );
        }}
      </Mutation>
    );
  }

  toggleReportModal() {
    this.setState(prevState => ({
      reportModalVisible: !prevState.reportModalVisible
    }));
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.primaryFontColor,
    marginLeft: 6
  },
  fillButton: {
    width: 66,
    height: 28,
    marginLeft: 15,
    borderRadius: 15
  },
  transparentButton: {
    width: 66,
    height: 28,
    marginLeft: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#fff"
  }
});

export default connect(store => ({ personal: store.users.user }))(PostHeader);
