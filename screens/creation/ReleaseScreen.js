import React from "react";
import ReactNative from "react-native";
import { ScrollView, Text, StyleSheet, Button, View, TextInput, TouchableOpacity, Dimensions, Modal, TouchableHighlight, Image } from "react-native";

import ImagePicker from "react-native-image-crop-picker";
import Screen from "../Screen";
import Colors from "../../constants/Colors";
import Config from "../../constants/Config";
import { Iconfont } from "../../utils/Fonts";
import { Header } from "../../components/Header";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { draftsQuery } from "../../graphql/user.graphql";
import { articleContentQuery, createdArticleMutation, editArticleMutation } from "../../graphql/article.graphql";
import { withApollo, compose, graphql, Query } from "react-apollo";
import { Mutation } from "react-apollo";

const { width, height } = Dimensions.get("window");

class ReleaseScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      body: null,
      image_urls: [],
      image_ids: [],
      routeName: "　"
    };
  }

  render() {
    const { navigation } = this.props;
    let { image_urls, routeName } = this.state;
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
        <ScrollView>
          <View style={styles.inputText}>
            <TextInput
              ref="textInput"
              style={styles.input}
              placeholder="这一刻的想法"
              underlineColorAndroid="transparent"
              selectionColor="#000"
              multiline={true}
              textAlignVertical={"top"}
              onChangeText={body => {
                this.setState({
                  body
                });
              }}
            />
          </View>
          <View style={styles.add}>
            <View
              style={{
                flexWrap: "wrap",
                alignItems: "flex-start",
                flexDirection: "row",
                borderColor: Colors.lightGray
              }}
            >
              {image_urls.map((image_url, index) => <Image key={index} style={styles.picture} source={{ uri: image_url }} />)}
              <TouchableOpacity onPress={this._openPicker.bind(this)}>
                <View style={image_urls == "" ? styles.icon : styles.icon2}>
                  <Iconfont name={"add"} size={100} color={Colors.lightGray} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/*          <TouchableOpacity>
              <View style={styles.ait}>
                <Iconfont name={"person"} size={22} style={styles.title} /> 
                <Text style={{ color: "#000", fontSize: 15 }}>所在位置</Text>
                <Text style={{ position: "absolute", right: 15 }}>{this.state.scene ? this.state.scene : "请选择"}</Text>
              </View>
            </TouchableOpacity>*/}
          <TouchableOpacity>
            <View style={styles.item}>
              <Iconfont name={"person-outline"} size={22} style={{ paddingRight: 15 }} color={"#000000"} />
              <Text style={{ color: "#000", fontSize: 15 }}>谁可以看</Text>
              <Text style={{ position: "absolute", right: 15 }}>{this.state.sex ? this.state.sex : "公开"}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.item}>
              <Iconfont name={"aite"} size={22} style={{ paddingRight: 15 }} color={"#000000"} />
              <Text style={{ color: "#000", fontSize: 15 }}>提醒谁看</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  _openPicker() {
    let _this = this;
    ImagePicker.openPicker({
      multiple: true,
      mediaType: "video"
    }).then(
      images => {
        let { image_urls } = _this.state;
        images.map(image => {
          //optmistic update
          image_urls.push(image.path);
          //upload ..
          _this.saveImage(image.path);
          console.log("视频地址path");
          console.log(image.path);
        });
        _this.setState({
          image_urls
        });
      },
      error => {
        console.log(error);
        add;
      }
    );
  }

  saveImage = imagePath => {
    const { token } = this.props.users.user;
    var data = new FormData();
    data.append("image", {
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

    let _this = this;
    fetch(Config.ServerRoot + "/api/image?api_token=" + token, config)
      .then(response => response.json())
      .then(image => {
        var { image_ids } = _this.state;
        image_ids.push(image.id);
        _this.setState({
          image_ids
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor,
    paddingTop: 24
  },
  inputText: {
    backgroundColor: Colors.skinColor
    // marginTop:10,
  },
  input: {
    backgroundColor: "transparent",
    fontSize: 16,
    padding: 0,
    paddingLeft: 20,
    paddingTop: 3,
    height: 100,
    justifyContent: "flex-start"
    // marginTop:10,
  },
  add: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    backgroundColor: Colors.skinColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    height: 100,
    width: 100,
    marginBottom: 120,
    borderWidth: 1,
    borderColor: Colors.lightGray
  },
  icon2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    height: 100,
    width: 100,
    marginBottom: 70,
    marginLeft: 3,
    borderWidth: 1,
    borderColor: Colors.lightGray
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.skinColor,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray
  },
  picture: {
    borderWidth: 0.5,
    height: 100,
    width: 100,
    marginHorizontal: 4,
    marginTop: 8
  }
});
export default connect(store => store)(ReleaseScreen);
