import React from "react";
import { FlatList, StyleSheet, ScrollView, Text, View, Image, Dimensions, TouchableOpacity } from "react-native";

import Screen from "../Screen";
import Colors from "../../constants/Colors";
import { ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../components/Pure";
import CategoryCard from "../../components/Card/CategoryCard";
import OfficialCategories from "./OfficialCategories";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { topCategoriesQuery } from "../../graphql/category.graphql";
import { followCategoryMutation } from "../../graphql/user.graphql";
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
    let { navigation, login } = this.props;
    return (
      <View style={styles.container}>
        <Query query={topCategoriesQuery}>
          {({ loading, error, data, fetchMore, refetch }) => {
            if (error) return <LoadingError reload={() => refetch()} />;
            if (!(data && data.categories)) return null;
            return (
              <FlatList
                ref={scrollview => {
                  this.scrollview = scrollview;
                }}
                removeClippedSubviews
                data={data.categories}
                ListHeaderComponent={() => <OfficialCategories login={login} navigation={navigation} />}
                keyExtractor={(item, index) => (item.key ? item.key : index.toString())}
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
                ListFooterComponent={() => {
                  return this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />;
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
      this.props.client.query({
        query: topCategoriesQuery,
        fetchPolicy: "network-only"
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray
  },
  categoryCardWrap: {
    marginHorizontal: 15,
    marginBottom: 15
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
  }
});

export default compose(
  withApollo,
  connect(store => ({ categories: store.categories, login: store.users.login }))
)(CategoriesScreen);
