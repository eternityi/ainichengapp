import React, { Component } from "react";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

class HeaderLeft extends Component {
  render() {
    const { navigation, routeName, goBack = true, color = Colors.primaryFontColor } = this.props;
    return (
      <View style={styles.headerLeft}>
        {goBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Iconfont name={"back-ios"} size={23} color={color} style={{ marginRight: 15 }} />
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 17, color }}>{routeName ? routeName : navigation.state.routeName}</Text>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  }
});

export default HeaderLeft;
