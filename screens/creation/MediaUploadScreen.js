import React from "react";
import ReactNative from "react-native";
import {
  ScrollView,
  Text,
  StyleSheet,
  Button,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableHighlight,
  Image,
  Platform
} from "react-native";

import Screen from "../Screen";
import UploadMedia from "./UploadMedia";
import Colors from "../../constants/Colors";
import Config from "../../constants/Config";
import { Iconfont } from "../../utils/Fonts";
import { Header } from "../../components/Header";
import MediaModal from "../../components/Modal/MediaModal";

import Upload from "react-native-background-upload";
import ImagePicker from "react-native-image-picker";
import { throttle } from "lodash";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { draftsQuery } from "../../graphql/user.graphql";
import { articleContentQuery, createdArticleMutation, editArticleMutation } from "../../graphql/article.graphql";
import { withApollo, compose, graphql, Query } from "react-apollo";
import { Mutation } from "react-apollo";

class MediaUploadScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.showMediaSelect = this.showMediaSelect.bind(this);
    this.state = {
      uploadId: null,
      progress: null,
      completed: false,
      covers: [],
      routeName: "　",
      selectMedia: false
    };
  }

  render() {
    let { covers, routeName, selectMedia, completed, progress, uploadId } = this.state;
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
          showMediaSelect={this.showMediaSelect}
          progress={progress}
          cancelUpload={this.cancelUpload}
          completed={completed}
          uploadId={uploadId}
          onPressPhotoUpload={() =>
            this.onPressPhotoUpload({
              url: "https://www.ainicheng.com/video",
              field: "uploaded_media",
              type: "multipart"
            })}
          onPressVideoUpload={() =>
            this.onPressVideoUpload({
              url: "https://www.ainicheng.com/video",
              field: "uploaded_media",
              type: "multipart"
            })}
        />
      </View>
    );
  }

  onPressVideoUpload = options => {
    const imagePickerOptions = {
      mediaType: "video"
    };

    ImagePicker.launchImageLibrary(imagePickerOptions, response => {
      let didChooseVideo = true;
      const { customButton, didCancel, error, path, uri, data } = response;
      let { covers } = this.state;

      if (didCancel) {
        didChooseVideo = false; //用户取消选择视频
      }
      if (error) {
        console.warn("ImagePicker error:", response);
        didChooseVideo = false;
      }
      if (!didChooseVideo) {
        return;
      }
      if (Platform.OS === "android") {
        if (path) {
          this.startUpload(Object.assign({ path }, options));
          let source = "file://" + path; //本地视频路径
          covers.push(source);
          this.setState({
            covers
          });
        } else {
          return;
        }
      } else {
        // You can also display the image using data:
        this.startUpload(Object.assign({ path: uri }, options));
      }
    });
    this.setState(prevState => ({ selectMedia: !prevState.selectMedia }));
  };

  onPressPhotoUpload = options => {
    const imagePickerOptions = {
      mediaType: "photo"
    };

    ImagePicker.launchImageLibrary(imagePickerOptions, response => {
      let didChooseVideo = true;
      const { customButton, didCancel, error, path, uri, data } = response;
      let { covers } = this.state;

      if (didCancel) {
        didChooseVideo = false; //用户取消选择图片
      }
      if (error) {
        console.warn("ImagePicker error:", response);
        didChooseVideo = false;
      }
      if (!didChooseVideo) {
        return;
      }
      if (Platform.OS === "android") {
        if (path) {
          this.startUpload(Object.assign({ path }, options));
          covers.push(uri); //图片资源
          this.setState({
            covers
          });
        } else {
          return;
        }
      } else {
        // You can also display the image using data:
        this.startUpload(Object.assign({ path: uri }, options));
      }
    });
    this.setState(prevState => ({ selectMedia: !prevState.selectMedia }));
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
            "content-type": metadata.mimeType // server requires a content-type header
          }
        },
        opts
      );

      Upload.startUpload(options)
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
            }); //上传完成
          });
        })
        .catch(function(err) {
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

  showMediaSelect() {
    this.setState(prevState => ({ selectMedia: !prevState.selectMedia }));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor,
    paddingTop: 24
  }
});
export default connect(store => store)(MediaUploadScreen);
