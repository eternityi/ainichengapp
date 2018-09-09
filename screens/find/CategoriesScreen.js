import React from "react";
import { FlatList, StyleSheet, ScrollView, Text, View, Image, Dimensions, TouchableWithoutFeedback } from "react-native";

import Screen from "../Screen";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../components/Pure";
import CategoryCard from "../../components/Card/CategoryCard";
import OfficialCategories from "./OfficialCategories";
import RecommendCategory from "./RecommendCategory";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { topCategoriesQuery } from "../../graphql/category.graphql";
import { followCategoryMutation, userFollowedCategoriesQuery } from "../../graphql/user.graphql";
import { Query, Mutation, compose, withApollo } from "react-apollo";

const { width, height } = Dimensions.get("window");

class CategoriesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      //当前tab页，点击tabbar跳转到顶部并刷新页面
      tabBarOnPress: ({ scene, previousScene, jumpToIndex }) => {
        let scrollToTop = navigation.getParam("scrollToTop", null);
        if (scene.focused && scrollToTop) {
          scrollToTop();
        } else {
          jumpToIndex(scene.index);
        }
      }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      fetchingMore: true
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this._scrollToTop
    });
  }

  render() {
    let { navigation, user } = this.props;
    return (
      <View style={styles.container}>
        <Query query={userFollowedCategoriesQuery} variables={{ user_id: user.id }}>
          {({ loading, error, data, fetchMore, refetch }) => {
            let categories;
            if (error || !(data && data.categories) || data.categories.length < 1) {
              categories = [];
            }
            if (data && data.categories) {
              categories = data.categories;
            }
            return (
              <FlatList
                ref={scrollview => {
                  this.scrollview = scrollview;
                }}
                data={categories}
                ListHeaderComponent={() => (
                  <View>
                    <OfficialCategories navigation={navigation} />
                    {categories.length > 0 && (
                      <View style={{ marginTop: 15, marginLeft: 15 }}>
                        <Text style={{ fontSize: 14 }}>关注的专题</Text>
                      </View>
                    )}
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this._renderCategoryItem}
                refreshing={loading}
                onRefresh={() => {
                  refetch();
                }}
                onEndReached={() => {
                  if (data.categories) {
                    fetchMore({
                      variables: {
                        offset: data.categories.length
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!(fetchMoreResult && fetchMoreResult.categories && fetchMoreResult.categories.length > 0)) {
                          this.setState({
                            fetchingMore: false
                          });
                          return prev;
                        }
                        return Object.assign({}, prev, {
                          categories: [...prev.categories, ...fetchMoreResult.categories]
                        });
                      }
                    });
                  } else {
                    this.setState({
                      fetchingMore: false
                    });
                  }
                }}
                ListEmptyComponent={() => <RecommendCategory />}
                ListFooterComponent={() => {
                  if (categories.length > 0) {
                    return (
                      <TouchableWithoutFeedback onPress={() => navigation.navigate("全部专题")}>
                        <View style={styles.refresh}>
                          <Iconfont name="fresh" size={14} color={Colors.themeColor} />
                          <Text style={styles.refreshText}>关注更多专题</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  } else {
                    return <View />;
                  }
                }}
              />
            );
          }}
        </Query>
      </View>
    );
  }

  _renderCategoryItem = ({ item, index }) => {
    return (
      <View style={styles.categoryCardWrap}>
        <CategoryCard category={item} />
      </View>
    );
  };

  _scrollToTop = () => {
    if (this.scrollview) {
      this.scrollview.scrollToOffset({ x: 0, y: 0, animated: true });
      // this.props.client.query({
      //   query: topCategoriesQuery,
      //   fetchPolicy: "network-only"
      // });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  },
  categoryCardWrap: {
    marginHorizontal: 15,
    marginTop: 15
  },
  followCategory: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  categoryListWrap: {
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 15
  },
  refresh: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 10
  },
  refreshText: {
    fontSize: 14,
    color: Colors.themeColor,
    marginLeft: 4
  }
});

export default compose(
  withApollo,
  connect(store => ({ categories: store.categories, user: store.users.user }))
)(CategoriesScreen);
