import React from "react";
import { FlatList, StyleSheet, Text, Platform, TextInput, Dimensions, View, TouchableOpacity, YellowBox, BackHandler } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { RichTextEditor, RichTextToolbar } from "react-native-zss-rich-text-editor";

import Screen from "../Screen";
import Colors from "../../constants/Colors";
import Config from "../../constants/Config";
import { Iconfont } from "../../utils/Fonts";
import { Header } from "../../components/Header";
import { ContentEnd, LoadingMore, LoadingError } from "../../components/Pure";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { draftsQuery } from "../../graphql/user.graphql";
import { articleContentQuery, createdArticleMutation, editArticleMutation } from "../../graphql/article.graphql";
import { withApollo, compose, graphql, Query } from "react-apollo";

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

  componentDidMount() {
    YellowBox.ignoreWarnings(["Warning: RichTextToolbar has a method called componentDidReceiveProps()"]);
    //监听安卓back
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", function() {
        if (!this.publishing) {
          this.backAction();
        }
        return true;
      });
    }
  }

  onEditorInitialized() {}

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
          {article.id ? (
            <Query query={articleContentQuery} variables={{ id: article.id }}>
              {({ loading, error, data, refetch }) => {
                if (error) return <LoadingError reload={() => refetch()} />;
                if (!(data && data.article)) return null;
                this.gotArticle = data.article;
                return this.renderEditor(data.article);
              }}
            </Query>
          ) : (
            this.renderEditor()
          )}
        </View>
      </Screen>
    );
  }

  renderEditor = (article = this.state.article) => {
    this.gotArticle = article;
    return (
      <View style={{ flex: 1 }}>
        <RichTextEditor
          ref={r => (this.richtext = r)}
          initialTitleHTML={article.title}
          titlePlaceholder={"请输入标题"}
          initialContentHTML={article.body}
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
                this.saveImage(image.path);
              })
              .catch(error => {});
          }}
        />
      </View>
    );
  };

  //插入图片
  saveImage = imagePath => {
    const { token } = this.props.user;
    var data = new FormData();
    data.append("photo", {
      uri: imagePath,
      name: "image.jpg",
      type: "image/jpg"
    });

    const config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: data
    };

    fetch(Config.ServerRoot + "/api/image/save?api_token=" + token, config)
      .then(response => {
        return response.text();
      })
      .then(photo => {
        //TODO:: server return photo.width/height
        this.richtext.insertImage({
          src: photo,
          width: width,
          height: 200,
          resizeMode: "cover"
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  //判断article内容是否change
  isChange(prevACont, currentCont) {
    if (prevACont.title != currentCont.title || prevACont.body != currentCont.body) {
      return true;
    }
    return false;
  }

  // 安卓返回处理
  backAction = () => {
    this.publishing = true;
    const { createArticle, editArticle, navigation } = this.props;
    //内容有改动
    if (isChange(this.gotArticle, { title, body })) {
      // 异步获取编辑器内容
      Promise.all([this.richtext.getContentHtml(), this.richtext.getTitleText()])
        .then(async ([body, title]) => {
          //文章已经创建
          if (this.gotArticle.id) {
            let { data: { createArticle } } = await editArticle({
              variables: {
                id: this.gotArticle.id,
                title,
                body
              }
            });
            this.publishing = false;
            //文章发布状态
            if (gotArticle.status > 0) {
              navigation.replace("文章详情", { article: createArticle });
            } else {
              navigation.goBack();
            }
          } else {
            let { data } = await createArticle({
              variables: {
                title,
                body
              },
              refetchQueries: result => [
                {
                  query: draftsQuery
                }
              ]
            });
            this.publishing = false;
            navigation.replace("私密文章");
          }
        })
        .catch(error => {
          throw new Error(error);
        });
    } else {
      this.publishing = false;
      navigation.goBack();
    }
  };

  //点击发布
  publish = () => {
    //更改发布状态（防止点击发布两次）
    this.publishing = true;
    const { createArticle, editArticle, navigation } = this.props;
    //异步获取编辑器内容
    Promise.all([this.richtext.getContentHtml(), this.richtext.getTitleText()])
      .then(async ([body, title]) => {
        //文章已经创建=>更新发布（或者发布更新）
        if (this.gotArticle.id) {
          let flag = { ...this.gotArticle }; //这里是保存第一次query的article（因为editArticleMutation后会使query重新fetch给gotArticle赋值）
          // 先提交编辑后的文章
          let { data } = await editArticle({
            variables: {
              id: this.gotArticle.id,
              title,
              body,
              is_publish: this.gotArticle.status == 0
            }
          });
          this.publishing = false;
          //如果没有发布就发布更新否则更新发布
          if (flag.status < 1) {
            navigation.replace("发布分享", { article: data.editArticle });
          } else {
            navigation.replace("文章详情", { article: data.editArticle });
          }
        } else {
          //创建并发布
          let { data } = await createArticle({
            variables: {
              title,
              body,
              is_publish: true
            }
          });
          this.publishing = false;
          navigation.replace("发布分享", { article: data.createArticle });
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  }
});

export default compose(
  withApollo,
  graphql(createdArticleMutation, { name: "createArticle" }),
  graphql(editArticleMutation, { name: "editArticle" }),
  connect(store => ({ user: store.users.user }))
)(CreationScreen);
