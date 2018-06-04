import React, { Component } from "react";
import { Iconfont } from "../../utils/Fonts";
import { StyleSheet, TouchableOpacity, Image } from "react-native";

class RecommendFollow extends Component {
  navigate() {
    this.props.navigation ? this.props.navigation.navigate("推荐关注") : () => null;
  }

  render() {
    const { customStyle = {}, color = "#515151" } = this.props;
    return (
      <TouchableOpacity onPress={() => this.navigate()}>
        <Iconfont name={"add-person"} size={22} style={customStyle} color={color} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({});

export default RecommendFollow;
