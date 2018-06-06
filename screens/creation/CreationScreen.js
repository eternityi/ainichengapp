import React from "react";
import { FlatList, StyleSheet, Text, Button, TextInput, Dimensions, View, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import Header from "../../components/Header/Header";
import ImagePicker from "react-native-image-crop-picker";
import { RichTextEditor, RichTextToolbar } from "react-native-zss-rich-text-editor";
import Screen from "../Screen";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { articleContentQuery, createArticleMutation, editArticleMutation, publishArticleMutation } from "../../graphql/article.graphql";
import { withApollo, compose, graphql } from "react-apollo";

let { width, height } = Dimensions.get("window");

class CreationScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    let article = props.navigation.getParam("article", {});
    this.publishing = false;
    this.state = {
      article
    };
  }

  componentWillMount() {
    // this.loadArticle();
  }

  onEditorInitialized() {
    this.loadArticle();
  }

  render() {
    const { navigation } = this.props;
    let { article } = this.state;
    return (
      <Screen>
        <View style={styles.container}>
          <Header
            navigation={navigation}
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  if (!this.publishing) {
                    this.publish();
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: Colors.themeColor
                  }}
                >
                  {article.id ? "发布更新" : "发布"}
                </Text>
              </TouchableOpacity>
            }
          />
          <RichTextEditor
            ref={r => (this.richtext = r)}
            // initialTitleHTML={title}
            titlePlaceholder={"请输入标题"}
            // initialContentHTML={content}
            contentPlaceholder={"请输入正文"}
            editorInitializedCallback={() => this.onEditorInitialized()}
          />
          <RichTextToolbar
            getEditor={() => this.richtext}
            iconTint={Colors.tintFontColor}
            selectedIconTint={Colors.themeColor}
            selectedButtonStyle={{ backgroundColor: Colors.tintGray }}
            onPressAddImage={() => {
              ImagePicker.openPicker({
                cropping: true
              })
                .then(image => {
                  //TODO:: upload to server, get image url back ....
                  this.richtext.insertImage({
                    src: image.path,
                    width: width,
                    height: 200,
                    resizeMode: "cover"
                  });
                })
                .catch(error => {});
            }}
          />
        </View>
      </Screen>
    );
  }

  async loadArticle() {
    let { article } = this.state;
    console.log("gotArticle", article);
    this.richtext.setTitleHTML(article.title);
    this.richtext.setContentHTML(article.body);
    if (article.id) {
      //请求文章
      console.log("client", this.props.client);
      let result = await this.props.client.query({
        query: articleContentQuery,
        variables: {
          id: article.id
        }
      });
      console.log("result", result);
    }
  }

  // todo todo todo 监听返回，更新发布/创建文章

  ///发布
  publish() {
    this.publishing = true;
    const { createArticle, publishArticle, navigation } = this.props;
    let { article } = this.state;
    Promise.all([this.richtext.getContentHtml(), this.richtext.getTitleText()])
      .then(async ([body, title]) => {
        //更新发布（或者发布更新）
        if (article.id) {
          let { data: { createArticle } } = await publishArticle({
            variables: {
              id: article.id,
              title,
              body
            }
          });
          this.publishing = false;
          //如果没有发布就发布更新或者更新发布
          if (article.status < 1) {
            navigation.navigate("发布分享", { article: createArticle });
          } else {
            navigation.navigate("文章详情", { article: createArticle });
          }
        } else {
          //创建并发布
          let { data: { createArticle } } = await createArticle({
            variables: {
              title,
              body
            }
          });
          this.publishing = false;
          navigation.navigate("发布分享", { article: createArticle });
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  }
});

export default compose(
  withApollo,
  graphql(publishArticleMutation, { name: "publishArticle" }),
  graphql(createArticleMutation, { name: "createArticle" }),
  graphql(editArticleMutation, { name: "editArticle" })
)(CreationScreen);
