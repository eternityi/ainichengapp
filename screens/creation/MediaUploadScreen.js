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
      isImagePickerShowing: false,
      uploadId: null,
      progress: null,
      image_urls: [],
      routeName: "　",
      selectMedia: false
    };
  }

  render() {
    let { image_urls, routeName, selectMedia } = this.state;
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
          image_urls={image_urls}
          showMediaSelect={this.showMediaSelect}
          progress={this.state.progress}
          cancelUpload={this.cancelUpload}
          onPressPhotoUpload={() =>
            this.onPressPhotoUpload({
              url: "https://www.ainicheng.com/video",
              field: "uploaded_media",
              type: "multipart"
            })
          }
          onPressVideoUpload={() =>
            this.onPressVideoUpload({
              url: "https://www.ainicheng.com/video",
              field: "uploaded_media",
              type: "multipart"
            })
          }
        />
      </View>
    );
  }

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
          this.setState({ uploadId, progress: 0 });
          Upload.addListener("progress", uploadId, data => {
            this.handleProgress(+data.progress);
            console.log(`Progress: ${data.progress}%`);
          });
          Upload.addListener("error", uploadId, data => {
            console.log(`Error: ${data.error}%`);
          });
          Upload.addListener("completed", uploadId, data => {
            console.log("Completed!");
          });
        })
        .catch(function(err) {
          this.setState({ uploadId: null, progress: null });
          console.log("Upload error!", err);
        });
    });
  };
  onPressVideoUpload = options => {
    if (this.state.isImagePickerShowing) {
      return;
    }

    this.setState({ isImagePickerShowing: true });

    const imagePickerOptions = {
      title: "选择",
      cancelButtonTitle: "取消",
      takePhotoButtonTitle: null,
      chooseFromLibraryButtonTitle: null,
      mediaType: "video"
    };

    ImagePicker.launchImageLibrary(imagePickerOptions, response => {
      let didChooseVideo = true;

      console.log("ImagePicker response: ", response);
      const { customButton, didCancel, error, path, uri, data } = response;

      if (didCancel) {
        didChooseVideo = false;
      }

      if (error) {
        console.warn("ImagePicker error:", response);
        didChooseVideo = false;
      }

      // TODO: Should this happen higher?
      this.setState({ isImagePickerShowing: false });

      if (!didChooseVideo) {
        return;
      }

      if (Platform.OS === "android") {
        if (path) {
          // Video is stored locally on the device
          // TODO: What here?
          this.startUpload(Object.assign({ path }, options));
          let source = { uri: "file://" + path };
          this.setState({
            image_urls: source
          });
        } else {
          // Video is stored in google cloud
          // TODO: What here?
          this.props.onVideoNotFound();
        }
      } else {
        // You can also display the image using data:
        this.startUpload(Object.assign({ path: uri }, options));
      }
    });
    this.setState(prevState => ({ selectMedia: !prevState.selectMedia }));
  };

  onPressPhotoUpload = options => {
    if (this.state.isImagePickerShowing) {
      return;
    }

    this.setState({ isImagePickerShowing: true });

    const imagePickerOptions = {
      title: "选择",
      cancelButtonTitle: "取消",
      takePhotoButtonTitle: null,
      chooseFromLibraryButtonTitle: null,
      mediaType: "photo"
    };

    ImagePicker.launchImageLibrary(imagePickerOptions, response => {
      let didChooseVideo = true;

      console.log("ImagePicker response: ", response);
      const { customButton, didCancel, error, path, uri, data } = response;
      let { image_urls } = this.state;

      if (didCancel) {
        didChooseVideo = false;
      }

      if (error) {
        console.warn("ImagePicker error:", response);
        didChooseVideo = false;
      }

      // TODO: Should this happen higher?
      this.setState({ isImagePickerShowing: false });

      if (!didChooseVideo) {
        return;
      }

      if (Platform.OS === "android") {
        if (path) {
          // Video is stored locally on the device
          // TODO: What here?
          this.startUpload(Object.assign({ path }, options));
          image_urls.push(uri);
          this.setState({
            image_urls
          });
          console.log("图片对象");
          console.log(image_urls);
        } else {
          // Video is stored in google cloud
          // TODO: What here?
          this.props.onVideoNotFound();
        }
      } else {
        // You can also display the image using data:
        this.startUpload(Object.assign({ path: uri }, options));
      }
    });
    this.setState(prevState => ({ selectMedia: !prevState.selectMedia }));
  };

  cancelUpload = () => {
    if (!this.state.uploadId) {
      console.log("Nothing to cancel!");
      return;
    }

    Upload.cancelUpload(this.state.uploadId).then(props => {
      console.log(`Upload ${this.state.uploadId} canceled`);
      this.setState({ uploadId: null, progress: null });
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
