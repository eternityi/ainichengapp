import React, { Component } from "react";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { StyleSheet, View, TouchableWithoutFeedback, Text } from "react-native";

class SearchBar extends Component {
  render() {
    let { navigation, placeholder = "搜索懂美味的内容和朋友", height = 38, iconSize = 18, textStyle = {} } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate("搜索中心")}>
        <View style={[styles.searchWrap, { height, borderRadius: height / 2 }]}>
          <Iconfont name={"search"} size={iconSize} color={Colors.tintFontColor} />
          <Text style={[styles.placeholderStyle, textStyle]}>{placeholder}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  searchWrap: {
    backgroundColor: Colors.lightGray,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  placeholderStyle: {
    fontSize: 15,
    marginLeft: 8,
    color: Colors.lightFontColor
  }
});

export default SearchBar;
