import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from "react-native";
import Highlighter from "react-native-highlight-words";
import { withNavigation } from "react-navigation";

import { navigationAction } from "../../constants/Methods";
import { VideoCover } from "../Pure";
import Colors from "../../constants/Colors";

const { height, width } = Dimensions.get("window");
const COVER_WIDTH = (width - 40) / 3;

class SearchArticleItem extends Component {
  render() {
    let { navigation, keywords, post } = this.props;
    let { type, title, description, cover, user } = post;
    return (
      <TouchableOpacity style={styles.articleItem} onPress={this.skipScreen}>
        {type == "video" ? (
          <View style={styles.videoWrap}>
            <View style={styles.videoLeft}>
              <Text style={styles.articleTitle} numberOfLines={2}>
                <Highlighter highlightStyle={{ color: Colors.themeColor }} searchWords={[keywords]} textToHighlight={title ? title : description} />
              </Text>
              <Text style={[styles.articleText, { marginTop: 10 }]}>{user.name}</Text>
            </View>
            <VideoCover width={COVER_WIDTH} height={COVER_WIDTH} cover={cover} markWidth={40} markSize={18} />
          </View>
        ) : (
          <View>
            <Text style={styles.articleTitle}>
              <Highlighter highlightStyle={{ color: Colors.themeColor }} searchWords={[keywords]} textToHighlight={title} />
            </Text>
            <Text style={styles.articleText} numberOfLines={3}>
              <Highlighter highlightStyle={{ color: Colors.themeColor }} searchWords={[keywords]} textToHighlight={description} />
            </Text>
            <Text style={[styles.articleText, { marginTop: 10 }]}>{user.name}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  skipScreen = () => {
    const { post, navigation } = this.props;
    let { type } = post;
    let routeName = type == "article" ? "文章详情" : "视频详情";
    let params = type == "article" ? { article: post } : { video: post };
    navigation.dispatch(navigationAction({ routeName, params }));
  };

  _matchingText(keywords, content) {
    // BAK 可以替换 但是不能创建React Element
    // var reg = new RegExp(keywords,"g");
    // if(reg.test(content)&&keywords) {
    //  // var highlightKeywords = React.createElement(Text,{style:{styles.focused}},keywords);
    //  var enhanceContent = content.replace(reg,`<Text style={styles.focused}>${keywords}</Text>`);
    //  return enhanceContent;
    // }else {
    //  return content;
    // }
  }
}

const styles = StyleSheet.create({
  videoWrap: {
    flexDirection: "row",
    alignItems: "center"
  },
  videoLeft: {
    flex: 1,
    marginRight: 10,
    justifyContent: "space-between",
    height: COVER_WIDTH
  },
  articleItem: {
    marginHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorderColor
  },
  articleTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primaryFontColor,
    paddingBottom: 16
  },
  articleText: {
    fontSize: 13,
    lineHeight: 17,
    color: Colors.tintFontColor
  }
});

export default withNavigation(SearchArticleItem);
