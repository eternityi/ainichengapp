import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";

import Color from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import { RefreshControl, LoadingError } from "../../components/Pure";
import AuthorCard from "./AuthorCard";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { Query } from "react-apollo";
import { recommendAuthors } from "../../graphql/user.graphql";

class ScrollCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      page: 1
    };
  }

  render() {
    let { navigation } = this.props;
    return (
      <Query query={recommendAuthors}>
        {({ loading, error, data, refetch, fetchMore }) => {
          if (error) return <LoadingError reload={() => refetch()} />;
          if (!(data && data.users)) return null;
          return (
            <View style={styles.authorCard}>
              <View style={styles.title}>
                <View>
                  <Text style={styles.titleText}>推荐作者</Text>
                </View>
                <RefreshControl
                  refreshing={this.state.refreshing}
                  refresh={() => {
                    this.setState({
                      refreshing: true
                    });
                    if (data.users) {
                      fetchMore({
                        variables: {
                          offset: this.state.page * 10
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          this.setState({
                            refreshing: false,
                            page: this.state.page + 1
                          });
                          console.log("refreshing", this.state.refreshing);
                          if (!(fetchMoreResult && fetchMoreResult.users && fetchMoreResult.users.length > 0)) {
                            return prev;
                          }
                          return fetchMoreResult;
                        }
                      });
                    }
                  }}
                />
              </View>
              <ScrollView style={styles.scrollCard} horizontal={true} showsHorizontalScrollIndicator={false}>
                <FlatList
                  data={data.users}
                  horizontal={true}
                  keyExtractor={this._keyExtractor}
                  getItemLayout={(data, index) => ({
                    length: 202.5,
                    offset: 202.5 * index,
                    index
                  })}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate("用户详情", { user: item })}>
                      <AuthorCard user={item} />
                    </TouchableOpacity>
                  )}
                />
              </ScrollView>
            </View>
          );
        }}
      </Query>
    );
  }

  _keyExtractor = (item, index) => (item.key ? item.key : index.toString());
}

const styles = StyleSheet.create({
  authorCard: {
    paddingVertical: 15,
    paddingLeft: 9,
    backgroundColor: "#f0f0f0"
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 16,
    marginLeft: 3,
    paddingLeft: 5,
    paddingRight: 20,
    borderLeftWidth: 2,
    borderColor: Color.themeColor
  },
  titleText: {
    fontSize: 12,
    marginTop: -2,
    color: Color.tintFontColor
  },
  scrollCard: {
    paddingTop: 15
  }
});

export default ScrollCard;
