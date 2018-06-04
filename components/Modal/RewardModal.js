import React, { Component } from "react";
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, TextInput } from "react-native";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import BasicModal from "./BasicModal";
import PaymentModal from "./PaymentModal";

class RewardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      selectMoney: 2,
      inputMoney: "",
      paymentVisible: false
    };
    this.handlePaymentVisible = this.handlePaymentVisible.bind(this);
    this.selectMoney = this.selectMoney.bind(this);
    this.emptySelectMoney = this.emptySelectMoney.bind(this);
    this.customMoney = this.customMoney.bind(this);
  }

  handlePaymentVisible() {
    this.setState(prevState => ({ paymentVisible: !prevState.paymentVisible }));
  }

  selectMoney(money) {
    this.setState({ selectMoney: money });
  }

  customMoney(value) {
    let newValue = "";
    let numbers = "0123456789";
    for (var i = 0; i < value.length; i++) {
      if (numbers.indexOf(value[i]) > -1) {
        newValue = newValue + value[i];
      }
    }
    this.setState({ inputMoney: newValue });
  }

  emptySelectMoney() {
    this.setState({ selectMoney: "" });
  }

  rewardModalHeader() {
    return (
      <View style={styles.rewardModalHeader}>
        <Text style={{ fontSize: 18, marginRight: 8, color: Colors.primaryFontColor }}>给作者送糖</Text>
        <Iconfont name={"sweets"} size={20} color={Colors.themeColor} />
      </View>
    );
  }

  render() {
    const { visible, handleVisible } = this.props;
    return (
      <BasicModal visible={visible} handleVisible={handleVisible} header={this.rewardModalHeader()}>
        <View>
          <View style={{ marginTop: 20 }}>
            <View style={styles.rewardModalSelect}>
              <TouchableOpacity
                style={[styles.rewardModalSelectItem, this.state.selectMoney === 2 ? styles.selected : null]}
                onPress={() => this.selectMoney(2)}
              >
                <Text style={{ color: this.state.selectMoney === 2 ? Colors.themeColor : Colors.tintFontColor }}>
                  <Text style={styles.selectMoneyAmount}>2 </Text>
                  <Text style={{ fontSize: 14 }}>颗</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rewardModalSelectItem, this.state.selectMoney === 5 ? styles.selected : null]}
                onPress={() => this.selectMoney(5)}
              >
                <Text style={{ color: this.state.selectMoney === 5 ? Colors.themeColor : Colors.tintFontColor }}>
                  <Text style={styles.selectMoneyAmount}>5 </Text>
                  <Text style={{ fontSize: 14 }}>颗</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rewardModalSelectItem, this.state.selectMoney === 10 ? styles.selected : null]}
                onPress={() => this.selectMoney(10)}
              >
                <Text style={{ color: this.state.selectMoney === 10 ? Colors.themeColor : Colors.tintFontColor }}>
                  <Text style={styles.selectMoneyAmount}>10 </Text>
                  <Text style={{ fontSize: 14 }}>颗</Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rewardModalSelect}>
              <TouchableOpacity
                style={[styles.rewardModalSelectItem, this.state.selectMoney === 20 ? styles.selected : null]}
                onPress={() => this.selectMoney(20)}
              >
                <Text style={{ color: this.state.selectMoney === 20 ? Colors.themeColor : Colors.tintFontColor }}>
                  <Text style={styles.selectMoneyAmount}>20 </Text>
                  <Text style={{ fontSize: 14 }}>颗</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rewardModalSelectItem, this.state.selectMoney === 50 ? styles.selected : null]}
                onPress={() => this.selectMoney(50)}
              >
                <Text style={{ color: this.state.selectMoney === 50 ? Colors.themeColor : Colors.tintFontColor }}>
                  <Text style={styles.selectMoneyAmount}>50 </Text>
                  <Text style={{ fontSize: 14 }}>颗</Text>
                </Text>
              </TouchableOpacity>
              {this.state.selectMoney ? (
                <TouchableOpacity
                  style={[styles.rewardModalSelectItem, this.state.selectMoney === "自定义" ? styles.selected : null]}
                  onPress={this.emptySelectMoney}
                >
                  <Text style={{ color: Colors.tintFontColor }}>
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>自定义</Text>
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.rewardModalSelectItem, styles.selected]} onPress={this.emptySelectMoney}>
                  <TextInput
                    keyboardType="numeric"
                    style={[styles.rewardModalInput, { fontSize: 19, color: Colors.themeColor }]}
                    onChangeText={this.customMoney}
                    value={this.state.inputMoney + ""}
                    underlineColorAndroid="transparent"
                    autoFocus={true}
                    maxLength={5}
                    selectionColor={Colors.themeColor}
                    textAlign={"center"}
                  />
                  <Text style={{ fontSize: 14, color: Colors.themeColor, marginRight: 5 }}>颗</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.rewardModalLeaveMessage}>
            <Text style={styles.rewardModalText}>留言：</Text>
            <TextInput
              style={styles.rewardModalInput}
              onChangeText={message => this.setState({ message })}
              value={this.state.message}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.rewardModalAmount}>
            <Text style={{ fontSize: 20, color: Colors.themeColor, letterSpacing: 2 }}>
              <Iconfont name={"RMB"} size={18} />
              <Text>{this.state.selectMoney ? this.state.selectMoney : this.state.inputMoney ? this.state.inputMoney : 0}</Text>
            </Text>
            <Text style={{ fontSize: 15, color: Colors.primaryFontColor, marginRight: 10 }}> 使用微信钱包</Text>
            <TouchableOpacity onPress={this.handlePaymentVisible}>
              <Text style={{ fontSize: 15, color: Colors.linkColor }}>更换</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rewardModalFooter}>
            <Text style={{ fontSize: 16, color: Colors.themeColor }}>确认支付</Text>
            <Text style={{ fontSize: 16, color: Colors.themeColor, marginRight: 20 }} onPress={handleVisible}>
              取消
            </Text>
          </View>
        </View>
        <PaymentModal visible={this.state.paymentVisible} handleVisible={this.handlePaymentVisible} />
      </BasicModal>
    );
  }
}

const styles = StyleSheet.create({
  rewardModalHeader: {
    flexDirection: "row",
    alignItems: "center"
  },
  rewardModalSelect: {
    flexDirection: "row",
    marginHorizontal: -6
  },
  rewardModalSelectItem: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.tintBorderColor,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    marginHorizontal: 6
  },
  selectMoneyAmount: {
    fontSize: 20,
    fontWeight: "600"
  },
  selected: {
    borderColor: Colors.themeColor
  },
  rewardModalLeaveMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.skinColor,
    borderWidth: 1,
    borderColor: Colors.tintBorderColor,
    borderRadius: 3,
    paddingLeft: 8
  },
  rewardModalText: {
    fontSize: 15,
    color: Colors.primaryFontColor
  },
  rewardModalInput: {
    flex: 1,
    height: 38,
    fontSize: 15,
    padding: 0,
    color: Colors.primaryFontColor
  },
  rewardModalAmount: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tintBorderColor
  },
  rewardModalFooter: {
    marginTop: 20,
    flexDirection: "row-reverse"
  }
});

export default RewardModal;
