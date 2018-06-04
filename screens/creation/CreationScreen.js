import React from "react";
import { FlatList, StyleSheet, Text, Button, TextInput, Dimensions, View } from "react-native";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import Header from "../../components/Header/Header";
// import ImagePicker from "react-native-image-crop-picker";
const ImagePicker = null;
import { RichTextEditor, RichTextToolbar } from "react-native-zss-rich-text-editor";
import Screen from "../Screen";

import { connect } from "react-redux";
import actions from "../../store/actions";

let { width, height } = Dimensions.get("window");

export default class CreationScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
  }

  onEditorInitialized() {}

  render() {
    const { navigation } = this.props;
    return (
      <Screen>
        <View style={styles.container}>
          <Header navigation={navigation} />
          {/*
          <RichTextEditor
            ref={r => (this.richtext = r)}
            initialTitleHTML={"Title!!"}
            titlePlaceholder={"请输入标题"}
            initialContentHTML={"Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>"}
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
                width: 400,
                height: 400,
                cropping: true
              })
                .then(image => {
                  //TODO:: upload to server, get image url back ....
                  this.richtext.insertImage({
                    src: image.path,
                    width: width,
                    height: 100,
                    resizeMode: "cover" 
                  });
                })
                .catch(error => {});
            }}
          />
          **/}
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  }
});
