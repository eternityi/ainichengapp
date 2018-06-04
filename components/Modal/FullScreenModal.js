import React, { Component } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity, Dimensions, Platform, BackHandler } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

const { width, height } = Dimensions.get("window");

class FullScreenModal extends Component {
  render() {
    const { visible, handleVisible, headerLeft, headerRight, modalName = "", evenHandler = () => null, children } = this.props;
    return (
      <Modal animationType="fade" transparent={false} visible={visible} onRequestClose={handleVisible}>
        <View
          style={styles.modalShade}
          onStartShouldSetResponder={evt => true}
          onResponderStart={handleVisible}
          onStartShouldSetResponderCapture={evt => false}
        >
          <View style={styles.modalInner} onStartShouldSetResponder={evt => true}>
            {
              <View style={styles.header}>
                {headerLeft ? (
                  headerLeft
                ) : (
                  <TouchableOpacity style={styles.modalLeft} onPress={handleVisible}>
                    <Iconfont name={"back-ios"} size={23} color={Colors.primaryFontColor} style={{ marginRight: 15 }} />
                    <Text
                      style={{
                        fontSize: 17,
                        color: Colors.primaryFontColor
                      }}
                    >
                      {modalName}
                    </Text>
                  </TouchableOpacity>
                )}
                {headerRight ? (
                  headerRight
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      evenHandler();
                      handleVisible();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                        color: Colors.weixinColor
                      }}
                    >
                      完成
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            }
            {children}
          </View>
        </View>
        {Platform.OS == "ios" && <KeyboardSpacer />}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalShade: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalInner: {
    width,
    flex: 1,
    backgroundColor: Colors.skinColor
  },
  header: {
    height: Platform.OS === "ios" ? 65 : 45,
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorderColor,
    backgroundColor: Colors.skinColor
  },
  modalLeft: {
    flexDirection: "row",
    alignItems: "center"
  }
});

export default FullScreenModal;
