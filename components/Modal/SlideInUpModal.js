import React, { Component } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions } from "react-native";

import Modal from "react-native-modal";
import Colors from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

class SlideInUpModal extends Component {
  render() {
    let { visible, toggleVisible, children } = this.props;
    return (
      <Modal isVisible={visible} onBackButtonPress={toggleVisible} onBackdropPress={toggleVisible} backdropOpacity={0.4} style={{ justifyContent: "flex-end", margin: 0 }}>
        <View style={{ backgroundColor: Colors.skinColor }}>{children}</View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({});

export default SlideInUpModal;
