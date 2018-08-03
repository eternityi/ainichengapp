import React from "react";
import ReactNative from "react-native";
import { ScrollView, Text, StyleSheet, Button, View, TouchableOpacity, Dimensions, Modal, TouchableHighlight, Image, Platform } from "react-native";

import Screen from "../Screen";
import UploadMedia from "./UploadMedia";
import Colors from "../../constants/Colors";
import Config from "../../constants/Config";
import { Iconfont } from "../../utils/Fonts";
import { Header } from "../../components/Header";
import MediaModal from "../../components/Modal/MediaModal";
import DialogSelected from "../../components/Pure/AlertSelected";

// import Upload from "react-native-background-upload";
import Upload from "../../utils/VodUploader";

import ImagePicker from "react-native-image-crop-picker";
import { throttle } from "lodash";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { draftsQuery } from "../../graphql/user.graphql";
import { createPostMutation } from "../../graphql/article.graphql";
import { withApollo, compose, graphql, Query } from "react-apollo";
import { Mutation } from "react-apollo";

const selectedArr = ["图片", "视频"];

class CreatePostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.showAlertSelected = this.showAlertSelected.bind(this);
    this.callbackSelected = this.callbackSelected.bind(this);
    this.image_urls = [];
    this.body = "";
    this.state = {
      video_id: null,
      uploadId: null,
      progress: null,
      completed: false,
      covers: [],
      routeName: "　",
      selectMedia: false,
      uri: "",
      isImagePickerShowing: false,
      retype: 1
    };
  }

  render() {
    let { covers, routeName, selectMedia, completed, progress, uploadId, retype, uri } = this.state;
    const { navigation } = this.props;
    return (
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
        <UploadMedia
          navigation={navigation}
          selectMedia={selectMedia}
          covers={covers}
          showAlertSelected={() => {
            this.showAlertSelected();
          }}
          progress={progress}
          cancelUpload={this.cancelUpload}
          completed={completed}
          uploadId={uploadId}
          retype={retype}
          uri={uri}
          onPressPhotoUpload={() =>
            this.onPressPhotoUpload({
              url: "https://www.ainicheng.com/video",
              field: "uploaded_media",
              type: "multipart"
            })}
          changeBody={this.changeBody}
        />
        <DialogSelected
          ref={dialog => {
            this.dialog = dialog;
          }}
        />
      </View>
    );
  }

  publish = () => {
    console.log("publish");
    console.log(this.body, this.image_urls);
    let { navigation, createPost } = this.props;
    let { retype } = this.state;
    this.publishing = true;
    createPost({
      variables: {
        body: this.body,
        image_urls: this.image_urls
      }
      // video_id:
      // a_cids:
    })
      .then(({ data }) => {
        console.log("published");
        console.log("createPost", data.createPost);
        this.publishing = false;
        //如果没有发布就发布更新否则更新发布
        if (retype < 1) {
          console.log("retype", retype);
          navigation.navigate("视频详情", { video: data.createPost });
        } else {
          navigation.navigate("文章详情", { article: data.createPost });
        }
      })
      .catch(error => {
        this.publishing = false;
      });
  };

  changeBody = body => {
    this.body = body;
  };

  onPressVideoUpload = options => {
    //打开视频库
    ImagePicker.openPicker({
      multiple: false,
      mediaType: "video"
    }).then(
      image => {
        let { covers, uri } = this.state;
        covers.push(image.path); //图片资源
        this.setState({
          covers
        });
        console.log(image.mime);
        if (Platform.OS === "android") {
          this.startUpload(Object.assign({ path: image.path.substr(7) }, options));
        } else {
          this.startUpload(Object.assign({ path: image.path }, options));
        }
        this.setState(prevState => ({ selectMedia: !prevState.selectMedia }));
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
        let { covers, uri, retype } = this.state;
        this.imgs = [];
        images.map(image => {
          //optmistic update
          covers.push(image.path);
          this.saveImage(image.path);
          //upload ..
          // if (Platform.OS === "android") {
          //   this.setState({
          //     uri: image.path.substr(7)
          //   });
          // } else {
          //   this.setState({
          //     uri: image.path
          //   });
          // }
        });
        this.setState({
          covers
        });
        // this.startUpload(Object.assign({ path: this.state.uri }, options));
      },
      error => {
        console.log(error);
        add;
      }
    );
  };

  saveImage = imagePath => {
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

  startUpload = opts => {
    Upload.getFileInfo(opts.path).then(metadata => {
      const options = Object.assign(
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "content-type": metadata.mimeType // server requires a content-type header
          }
        },
        opts
      );
      let uploadtype = metadata.mimeType.indexOf("image");
      this.setState({
        retype: uploadtype
      });

      Upload.startUpload(options) //上传
        .then(uploadId => {
          console.log(`Upload started with options: ${JSON.stringify(options)}`);
          this.setState({ uploadId, progress: 0, completed: false }); //获取上传ID,进度归０,上传未完成
          Upload.addListener("progress", uploadId, data => {
            this.handleProgress(+data.progress); //上传进度
            console.log(`Progress: ${data.progress}%`);
          });
          Upload.addListener("error", uploadId, data => {
            console.log(`Error: ${data.error}%`);
          });
          Upload.addListener("completed", uploadId, data => {
            this.setState({
              completed: true
            });
            //上传完成,
            console.log(data.fileId); //数据库里的 vod fileid
            console.log(data.videoUrl); //云上的视频url

            //TODO,  api : http get /api/video/save?fileId=&videoUrl=,

            //得到数据的 video->id

            //this.state.video_id, 方便后面createPostMutation.
          });
        })
        .catch(err => {
          this.setState({ uploadId: null, progress: null });
          console.log("上传错误!", err);
        });
    });
  };

  cancelUpload = () => {
    let { covers } = this.state;
    if (!this.state.uploadId) {
      return; //没有上传的文件ＩＤ
    }

    Upload.cancelUpload(this.state.uploadId).then(props => {
      console.log(`Upload ${this.state.uploadId} canceled`);
      this.setState({ uploadId: null, progress: null }); //取消上传,移除上传文件的ID与进度
      covers.pop();
      this.setState({
        covers
      }); //取消上传时移除数组的最后一个
    });
  };

  showAlertSelected() {
    this.dialog.show("请选择上传内容", selectedArr, "#333333", this.callbackSelected);
  }
  // 回调
  callbackSelected(i) {
    const { token } = this.props.users.user;
    console.log(token);
    switch (i) {
      case 0: //图库
        this.onPressPhotoUpload({
          url: "https://www.ainicheng.com/video",
          field: "uploaded_media",
          type: "multipart"
        });
        break;
      case 1: // 视频库
        this.onPressVideoUpload({
          url: "https://ainicheng.com/api/video/save?api_token=" + token,
          field: "video",
          type: "multipart"
        });
        break;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor,
    paddingTop: 24
  }
});
export default compose(withApollo, connect(store => store), graphql(createPostMutation, { name: "createPost" }))(CreatePostScreen);
