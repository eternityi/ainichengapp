import React, { Component } from "react";
import { ScrollView, Text, StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { NavigationActions } from "react-navigation";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { Header, SingleSearchBar } from "../../components/Header";
import SearchArticleItem from "../../components/Article/SearchArticleItem";
import { CustomPopoverMenu } from "../../components/Modal";
import Screen from "../Screen";

import { connect } from "react-redux";
import gql from "graphql-tag";
import { graphql, Query } from "react-apollo";

class ArticlesScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this._renderRelatedArticle = this._renderRelatedArticle.bind(this);
    this.state = {
      keywords: "",
      articles: []
    };
  }

  render() {
    let { renderItem, search_detail, navigation } = this.props;
    let { keywords, articles } = this.state;
    return (
      <Screen>
        <View style={styles.container}>
          <Header
            routeName={true}
            navigation={navigation}
            rightComponent={
              <SingleSearchBar placeholder={"搜索文章的内容或标题"} keywords={keywords} changeKeywords={this.changeKeywords.bind(this)} handleSearch={this.handleSearch.bind(this)} />
            }
          />
          {articles.length > 0 && (
            <FlatList data={articles} keyExtractor={(item, index) => index.toString()} renderItem={this._renderRelatedArticle} ListHeaderComponent={this._renderSearchHeader} />
          )}
        </View>
      </Screen>
    );
  }

  _renderSearchHeader() {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginTop: 20
        }}
      >
        <View>
          <Text style={{ fontSize: 14, color: Colors.tintFontColor }}>相关文章</Text>
        </View>
        <View>
          <CustomPopoverMenu
            width={100}
            selectHandler={() => null}
            triggerComponent={
              <Text style={{ fontSize: 14, color: Colors.tintFontColor }}>
                综合排序 <Iconfont name={"downward-arrow"} size={12} />
              </Text>
            }
            options={["综合排序", "最新排序", "最新评论", "热度排行"]}
            customOptionStyle={{
              customOptionStyle: { optionText: { fontSize: 14 } }
            }}
          />
        </View>
      </View>
    );
  }

  _renderRelatedArticle({ item, index }) {
    let { navigation } = this.props;
    let { keywords } = this.state;
    return <SearchArticleItem navigation={navigation} keywords={keywords} article={item} />;
  }

  _matchingText(keywords, content) {
    // todo 可以替换 但是不能创建React Element
    // var reg = new RegExp(keywords,"g");
    // if(reg.test(content)&&keywords) {
    //  // var highlightKeywords = React.createElement(Text,{style:{styles.focused}},keywords);
    //  var enhanceContent = content.replace(reg,`<Text style={styles.focused}>${keywords}</Text>`);
    //  return enhanceContent;
    // }else {
    //  return content;
    // }
    return content;
  }

  changeKeywords(keywords) {
    this.setState({
      keywords
    });
  }

  handleSearch(keywords) {
    // let { navigation } = this.props;
    // let navigateAction = NavigationActions.replace({
    //   key: navigation.state.key,
    //   routeName: "搜索详情",
    //   params: { keywords }
    // });
    // navigation.dispatch(navigateAction);
    this.setState({
      articles: this.props.search_detail.articles
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  }
});

export default connect(store => ({
  search_detail: store.search.search_detail
}))(ArticlesScreen);
