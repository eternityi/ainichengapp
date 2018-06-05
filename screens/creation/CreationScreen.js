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
import { articleContentQuery, createArticleMutation, publishArticleMutation, editArticleMutation } from "../../graphql/article.graphql";
import { withApollo, compose, graphql } from "react-apollo";

let { width, height } = Dimensions.get("window");

class CreationScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    let article = props.navigation.getParam("article", {});
    this.state = {
      id: article.id,
      title: "",
      content: ""
    };
  }

  componentWillMount() {
    this.loadArticle();
  }

  onEditorInitialized() {}

  render() {
    const { navigation, publishArticle, editArticle } = this.props;
    let { id, title, content } = this.state;
    return (
      <Screen>
        <View style={styles.container}>
          <Header
            navigation={navigation}
            rightComponent={
              <TouchableOpacity
                onPress={() => {
                  if (id) {
                    editArticle({
                      id: id,
                      title: title,
                      body: content
                    });
                  } else {
                    publishArticle({
                      title: title,
                      body: content
                    });
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: Colors.themeColor
                  }}
                >
                  {id ? "发布更新" : "发布文章"}
                </Text>
              </TouchableOpacity>
            }
          />
          <RichTextEditor
            ref={r => (this.richtext = r)}
            initialTitleHTML={title}
            titlePlaceholder={"请输入标题"}
            initialContentHTML={content}
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
    console.log("gotArticle");
    if (this.state.id) {
      //请求文章
      let result = await this.props.client.query({
        query: articleContentQuery,
        variables: {
          id
        }
      });
      console.log("result", result);
      let { data: { article } } = result;
      this.setState({
        title: article.title,
        content: article.body
      });
    }
  }

  async getTitleHtml() {}
  async getTitleText() {}
  async getContentHtml() {}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  }
});

export default compose(
  withApollo,
  graphql(createArticleMutation, { name: "createArticle" }),
  graphql(publishArticleMutation, { name: "publishArticle" }),
  graphql(editArticleMutation, { name: "editArticle" })
)(CreationScreen);
