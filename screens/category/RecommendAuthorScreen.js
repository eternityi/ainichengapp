import React, { Component } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import Colors from "../../constants/Colors";
import Header from "../../components/Header/Header";
import HeaderLeft from "../../components/Header/HeaderLeft";
import UserMetaGroup from "../../components/MediaGroup/UserMetaGroup";
import ContentEnd from "../../components/Pure/ContentEnd";
import LoadingMore from "../../components/Pure/LoadingMore";
import Screen from "../Screen";

class RecommendAuthorScreen extends Component {
  render() {
    const { navigation } = this.props;
    let { data = [] } = navigation.state.params;
    return (
      <Screen>
        <View style={styles.container}>
          <Header routeName={"专题推荐作者(" + data.length + ")"} navigation={navigation} />
          <FlatList
            style={{ paddingHorizontal: 20 }}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem.bind(this)}
            getItemLayout={(data, index) => ({
              length: 76,
              offset: 76 * index,
              index
            })}
            ListFooterComponent={() => {
              return <ContentEnd />;
            }}
          />
        </View>
      </Screen>
    );
  }

  _renderItem({ item }) {
    let { navigation } = this.props;
    return (
      <View style={styles.authorItem}>
        <UserMetaGroup user={item} navigation={navigation} customStyle={{ nameSize: 17 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  },
  authorItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBorderColor
  }
});

export default RecommendAuthorScreen;
