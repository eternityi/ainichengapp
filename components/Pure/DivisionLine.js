import React, { Component } from "react";
import Colors from "../../constants/Colors";

import { StyleSheet, View } from "react-native";

class DivisionLine extends Component {
  render() {
    let { height = 10, noBorder = false } = this.props;
    return <View style={[styles.divisionLine, { height: height }, noBorder && { borderColor: Colors.lightGray }]} />;
  }
}

const styles = StyleSheet.create({
  divisionLine: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.lightBorderColor,
    backgroundColor: Colors.lightGray
  }
});

export default DivisionLine;
