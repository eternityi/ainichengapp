import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, FlatList } from "react-native";
import Modal from "react-native-modal";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import { Header, HeaderLeft } from "../../components/Header";
import { Avatar, ContentEnd } from "../../components/Pure";
import { HollowButton } from "../../components/Button";
import { CustomPopoverMenu, ReportModal } from "../../components/Modal";

import { Query, compose, graphql } from "react-apollo";
import { userCategoriesQuery } from "../../graphql/user.graphql";
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

class ArticleDetailHeader extends Component {
  constructor(props) {
    super(props);
    this.toggleReportModal = this.toggleReportModal.bind(this);
    this.toggleIncludeModal = this.toggleIncludeModal.bind(this);
    this.state = {
      reportModalVisible: false,
      includeModalVisible: false
    };
  }

  render() {
    let { reportModalVisible, includeModalVisible } = this.state;
    let { navigation, article, share, currentUser, favoriteArticle } = this.props;
    let { user } = article;
    return (
      <View>
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
          rightComponent={
            <View>
              <CustomPopoverMenu
                width={140}
                selectHandler={index => {
                  switch (index) {
                    case 0:
                      //收藏
                      favoriteArticle({
                        variables: {
                          article_id: article.id
                        }
                      });
                      break;
                    case 1:
                      //分享
                      share();
                      break;
                    case 2:
                      //收入专题
                      this.toggleIncludeModal();
                      break;
                    case 3:
                      //举报
                      this.toggleReportModal();
                      break;
                  }
                }}
                triggerComponent={<Iconfont name={"more-vertical"} size={23} color={Colors.tintFontColor} />}
              >
                {
                  <View>
                    <MenuOption value={0} customStyles={popoverOption}>
                      <Iconfont name={article.favorite ? "star" : "star-outline"} size={22} color={"#717171"} style={{ marginRight: 16 }} />
                      <Text style={styles.optionText}>收藏</Text>
                    </MenuOption>
                    <MenuOption value={1} customStyles={popoverOption}>
                      <Iconfont name={"share"} size={19} color={"#717171"} style={{ marginRight: 16 }} />
                      <Text style={styles.optionText}>分享</Text>
                    </MenuOption>
                    <MenuOption value={2} customStyles={popoverOption}>
                      <Iconfont name={"include"} size={21} color={"#717171"} style={{ marginRight: 16 }} />
                      <Text style={styles.optionText}>收入专题</Text>
                    </MenuOption>
                    <MenuOption value={3} customStyles={popoverOption}>
                      <Iconfont name={"hint-fill"} size={22} color={"#717171"} style={{ marginRight: 16 }} />
                      <Text style={styles.optionText}>举报</Text>
                    </MenuOption>
                  </View>
                }
              </CustomPopoverMenu>
            </View>
          }
        />
        <ReportModal visible={reportModalVisible} handleVisible={this.toggleReportModal} report={article} type={"article"} />
        <Query query={userCategoriesQuery} variables={{ user_id: currentUser.id }}>
          {({ loading, error, data }) => {
            if (!(data && data.categories)) return null;
            return (
              <Modal
                isVisible={includeModalVisible}
                onBackButtonPress={this.toggleIncludeModal}
                onBackdropPress={this.toggleIncludeModal}
                backdropOpacity={0.4}
                style={{ justifyContent: "flex-end", margin: 0 }}
              >
                <View style={{ height: 400, backgroundColor: Colors.skinColor }}>
                  <View style={{ padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 14, color: Colors.tintFontColor }}>收入专题</Text>
                    <Text
                      style={{ fontSize: 14, color: Colors.themeColor }}
                      onPress={() => {
                        this.toggleIncludeModal();
                        navigation.navigate("新建专题");
                      }}
                    >
                      新建专题
                    </Text>
                  </View>
                  <FlatList
                    data={data.categories}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={styles.categoryItem}
                        onPress={() => {
                          this.toggleIncludeModal();
                          navigation.navigate("专题详情", {
                            category: item
                          });
                        }}
                      >
                        <Avatar uri={item.logo} size={36} type="category" />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text numberOfLines={1}>{item.name}</Text>
                        </View>
                        <View style={{ width: 50, height: 26 }}>
                          <HollowButton size={12} name="收入" onPress={() => null} />
                        </View>
                      </TouchableOpacity>
                    )}
                    ListFooterComponent={() => <ContentEnd />}
                  />
                </View>
              </Modal>
            );
          }}
        </Query>
      </View>
    );
  }

  toggleReportModal() {
    this.setState(prevState => ({
      reportModalVisible: !prevState.reportModalVisible
    }));
  }

  toggleIncludeModal() {
    this.setState(prevState => ({
      includeModalVisible: !prevState.includeModalVisible
    }));
  }
}

const styles = StyleSheet.create({
  categoryItem: {
    marginHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorderColor,
    flexDirection: "row",
    alignItems: "center"
  }
});

export default compose(graphql(favoriteArticleMutation, { name: "favoriteArticle" }), connect(store => ({ currentUser: store.users.user })))(
  ArticleDetailHeader
);
