import React from "react";
import ReactNative from "react-native";
import { ScrollView, Text, StyleSheet, Button, View, TouchableOpacity, Modal, TouchableHighlight, Image, Platform, Keyboard } from "react-native";

import Screen from "../Screen";
import UploadBody from "./UploadBody";
import CreatePostBottom from "./CreatePostBottom";
import Colors from "../../constants/Colors";
import Config from "../../constants/Config";
import { Iconfont } from "../../utils/Fonts";
import { Header } from "../../components/Header";
import MediaModal from "../../components/Modal/MediaModal";

// import Upload from "react-native-background-upload";
import TXUGCUploader from "../../utils/TXUGCUploader";

import Toast from "react-native-root-toast";
import KeyboardSpacer from "react-native-keyboard-spacer";
import ImagePicker from "react-native-image-crop-picker";
import { throttle } from "lodash";
import { connect } from "react-redux";
import actions from "../../store/actions";
import { Waiting } from "../../components/Pure";

import { withApollo, compose, graphql, Query } from "react-apollo";
import { Mutation } from "react-apollo";
import { draftsQuery } from "../../graphql/user.graphql";
import { createPostMutation } from "../../graphql/article.graphql";

const selectedArr = ["图片", "视频"];

class CreatePostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.image_urls = [];
    // this.selectCategories = [];
    this.body = "";
    this.publishing = false;
    let category = props.navigation.getParam("category", {});

    this.state = {
      video_id: null,
      uploadId: null,
      progress: null,
      completed: false,
      covers: [],
      routeName: "　",
      uri: "",
      uploadType: 1,
      selectCategories: category.name == null ? [] : [category],
      category_ids: [],
      waitingVisible: false
    };
  }

  render() {
    let { covers, routeName, completed, progress, uploadId, uploadType, uri, selectCategories, category_ids, waitingVisible } = this.state;
    const { navigation } = this.props;
    return (
      <Screen>
        <View style={styles.container}>
          <Header
            navigation={navigation}
            routeName={routeName}
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
                  发表
                </Text>
              </TouchableOpacity>
            }
          />
          <UploadBody
            navigation={navigation}
            covers={covers}
            progress={progress}
            completed={completed}
            uploadId={uploadId}
            uploadType={uploadType}
            changeBody={this.changeBody}
            body={this.body}
            selectCategories={selectCategories}
            selectCategory={this.selectCategory}
            category_ids={category_ids}
          />
          <CreatePostBottom
            navigation={navigation}
            uploadType={uploadType}
            covers={covers}
            onPressPhotoUpload={this.onPressPhotoUpload}
            onPressVideoUpload={this.onPressVideoUpload}
          />
          {Platform.OS == "ios" && <KeyboardSpacer />}
        </View>
        <Waiting isVisible={waitingVisible} />
      </Screen>
    );
  }

  selectCategory = selectCategories => {
    // let { category_ids } = this.state;
    this.setState({ selectCategories });
  };

  publish = () => {
    let { navigation, createPost } = this.props;
    let { uploadType, video_id, selectCategories } = this.state;
    let category_ids = selectCategories.map((elem, i) => {
      return elem.id;
    });
    console.log("category_ids", category_ids);
    Keyboard.dismiss();
    this.publishing = true;
    if (!this.body) {
      this.toast();
    }
    this.setState({
      waitingVisible: true
    });
    //TODO:这里找后端核实下，这个统一的发布动态接口应该是可以兼容所有发布动态的场景的，前端也应该简化选择上传内容那的操作，
    //简化到和朋友圈一样，和雷坤做的web发布动态一样，无需用户选择图片还是视频这个模态框，直接选择了发布，或者是拍摄。
    createPost({
      variables: {
        body: this.body,
        image_urls: this.image_urls,
        a_cids: category_ids,
        video_id: video_id
      }
      // category_ids //TODO:: 选择专题，支持可以多选专
    })
      .then(({ data }) => {
        console.log("published");
        console.log("createPost", data.createPost);
        this.setState({
          waitingVisible: false
        });
        this.publishing = false;

        navigation.replace("动态详情", { post: data.createPost });
      })
      .catch(error => {
        this.publishing = false;
        this.setState({
          waitingVisible: false
        });
      });
  };

  changeBody = body => {
    this.body = body;
  };

  onPressVideoUpload = () => {
    //打开视频库
    ImagePicker.openPicker({
      multiple: false,
      mediaType: "video"
    }).then(
      video => {
        let { covers, uri } = this.state;
        covers.push(video.path); //视频资源
        this.setState({
          covers
        });
        console.log("covers:", covers);
        let path = video.path.substr(7);
        console.log("video path:", path);
        this.startUploadVideo({ path });
      },
      error => {
        console.log(error);
        add;
      }
    );
  };

  onPressPhotoUpload = options => {
    //打开相册
    ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo"
    }).then(
      images => {
        let { covers, uri, uploadType } = this.state;
        this.imgs = [];
        images.map(image => {
          //optmistic update
          covers.push(image.path);
          console.log("地址", covers);
          this.startUploadImage(image.path);
        });
        this.setState({
          covers
        });
      },
      error => {
        console.log(error);
        add;
      }
    );
  };

  startUploadImage = imagePath => {
    const { token } = this.props.users.user;
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
    console.log("config", config);
    fetch(Config.ServerRoot + "/api/image/save?api_token=" + token, config)
      .then(response => {
        console.log("response", response);
        return response.text();
      })
      .then(photo => {
        this.image_urls.push(photo);
        console.log("this.image_urls", this.image_urls);
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleProgress = throttle(progress => {
    this.setState({ progress });
  }, 200);

  startUploadVideo = opts => {
    let _this = this;
    TXUGCUploader.getFileInfo(opts.path).then(metadata => {
      const options = Object.assign(
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "content-type": metadata.mimeType
          }
        },
        opts
      );
      console.log("metadata:", metadata);
      let uploadtype = metadata.mimeType.indexOf("image");
      this.setState({
        uploadType: uploadtype
      });

      let __this = _this;
      TXUGCUploader.startUpload(options) //上传
        .then(uploadId => {
          // console.log(`Upload started with options: ${JSON.stringify(options)}`);
          this.setState({ uploadId, progress: 0, completed: false }); //获取上传ID,进度归０,上传未完成
          TXUGCUploader.addListener("progress", uploadId, data => {
            this.handleProgress(+parseInt(data.progress)); //上传进度
            console.log(`Progress: ${data.progress}%`);
          });
          TXUGCUploader.addListener("error", uploadId, data => {
            console.log(`Error: ${data.error}%`);
          });
          TXUGCUploader.addListener("completed", uploadId, data => {
            this.setState({
              completed: true
            });
            //上传完成,
            console.log("上传完成 data:", data);
            console.log(data.fileId); //数据库里的 vod fileid
            console.log(data.videoUrl); //云上的视频url

            let ___this = __this;
            const { token } = __this.props.users.user;
            fetch(Config.ServerRoot + "/api/video/save?from=qcvod&api_token=" + token, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                fileId: data.fileId,
                videoUrl: data.videoUrl
              })
            })
              .then(response => response.json())
              .then(video => {
                console.log("video:", video);
                ___this.setState({
                  video_id: video.id
                });
              });
          });
        })
        .catch(err => {
          this.setState({ uploadId: null, progress: null });
          console.log("上传错误!", err);
        });
    });
  };
  toast() {
    let toast = Toast.show("内容不能为空哦~", {
      duration: Toast.durations.LONG,
      position: -70,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 100,
      backgroundColor: Colors.nightColor
    });
    setTimeout(function() {
      Toast.hide(toast);
    }, 2000);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor,
    paddingTop: 24
  }
});
export default compose(
  withApollo,
  connect(store => store),
  graphql(createPostMutation, { name: "createPost" })
)(CreatePostScreen);
