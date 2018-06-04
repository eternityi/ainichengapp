import React, { Component } from "react";
import Colors from "../../constants/Colors";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

class Hollow extends Component {
  _action() {
    this.props.onPress ? this.props.onPress() : null;
  }

  render() {
    let { size = 14, onPress = () => null, name = "", color = "rgba(66,192,46,0.9)" } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={[styles.buttonWrap, { borderColor: color }]}>
        <Text style={{ textAlign: "center", color, fontSize: size }}>{name ? name : this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Hollow;
