import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, TouchableNativeFeedback, Text, FlatList, ScrollView, Dimensions } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { CustomSlideMenu, BasicModal } from "../../components/Modal";
import { CategoryGroup } from "../../components/MediaGroup";
import { ContentEnd } from "../../components/Pure";

const { width, height } = Dimensions.get("window");

const slideOption = {
  optionWrapper: {
    height: 70,
    padding: 20,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorderColor
  }
};

class BeSelectedCategory extends Component {
  render() {
    let { categories, navigation } = this.props;
    if (!categories.length) {
      return null;
    }

    return (
      <View style={styles.beSelectedCategory}>
        <TouchableOpacity style={styles.beSelectedCategoryItem} onPress={() => navigation.navigate("专题详情", { category: categories[0] })}>
          <Text style={styles.beSelectedCategoryItemText}>{categories[0].name}</Text>
          <Iconfont name={"right"} size={16} color={Colors.themeColor} />
        </TouchableOpacity>
        {categories.length >= 2 && (
          <TouchableOpacity style={styles.beSelectedCategoryItem} onPress={() => navigation.navigate("专题详情", { category: categories[1] })}>
            <Text style={styles.beSelectedCategoryItemText}>{categories[1].name}</Text>
            <Iconfont name={"right"} size={16} color={Colors.themeColor} />
          </TouchableOpacity>
        )}

        {categories.length >= 3 && (
          <CustomSlideMenu
            triggerComponent={
              <View style={styles.beSelectedCategoryItem}>
                <Iconfont name={"more"} size={16} color={Colors.themeColor} style={{ marginHorizontal: 6 }} />
              </View>
            }
          >
            {
              <FlatList
                style={{ height: height * 0.6 }}
                data={categories}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <MenuOption value={item.id} customStyles={slideOption}>
                    <CategoryGroup category={item} miniButton />
                  </MenuOption>
                )}
                getItemLayout={(data, index) => ({
                  length: 70,
                  offset: 70 * index,
                  index
                })}
                ListFooterComponent={() => <ContentEnd />}
              />
            }
          </CustomSlideMenu>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  beSelectedCategory: {
    flexDirection: "row",
    alignItems: "center"
  },
  beSelectedCategoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.themeColor,
    borderRadius: 5
  },
  beSelectedCategoryItemText: {
    fontSize: 15,
    color: Colors.themeColor
  }
});

export default BeSelectedCategory;
