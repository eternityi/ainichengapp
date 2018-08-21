import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

import Header from "./Header";
import EmitInput from "../Native/EmitInput";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";

class SearchHeader extends Component {
  render() {
    let {
      navigation,
      name,
      handleSearch = () => null,
      changeKeywords = () => null,
      placeholder = "搜索文章、专题、用户、文集",
      headerRef
    } = this.props;
    return (
      <Header
        routeName={true}
        navigation={navigation}
        rightComponent={
          <View style={styles.searchWrap}>
            <EmitInput
              words={false}
              name={name}
              style={styles.textInput}
              autoFocus={true}
              placeholder={placeholder}
              onEmitterReady={changeKeywords}
              ref={headerRef}
            />
            <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
              <Iconfont name={"search"} size={22} color={Colors.tintFontColor} style={{ marginRight: 8 }} />
            </TouchableOpacity>
          </View>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  searchWrap: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: 22,
    lineHeight: 22,
    padding: 0,
    color: Colors.primaryFontColor
  },
  searchIcon: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: Colors.lightBorderColor
  }
});

export default SearchHeader;
