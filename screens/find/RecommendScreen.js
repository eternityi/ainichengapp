import React from "react";
import { FlatList, StyleSheet, ScrollView, Text, View, Image, Dimensions, TouchableOpacity, RefreshControl } from "react-native";
import Swiper from "react-native-swiper";
import Poster from "./Poster";

import Colors from "../../constants/Colors";
import NoteItem from "../../components/Article/NoteItem";
import { ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../components/Pure";
import RecommendAuthor from "./RecommendAuthor";
import Screen from "../Screen";

import { recommendArticlesQuery, topArticleWithImagesQuery } from "../../graphql/article.graphql";
import { Mutation, Query, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import actions from "../../store/actions";

const { width, height } = Dimensions.get("window");

const sliderWidth = width;
const itemWidth = width - 40;

class RecommendScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      //当前tab页，点击tabbar跳转到顶部并刷新页面
      tabBarOnPress: ({ scene, jumpToIndex }) => {
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
    this.state = { fetchingMore: true };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      scrollToTop: this._scrollToTop
    });
  }

  render() {
    let { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Query query={recommendArticlesQuery}>
          {({ loading, error, data, refetch, fetchMore }) => {
            if (error) return <LoadingError reload={() => refetch()} />;
            if (!(data && data.articles)) return <SpinnerLoading />;
            return (
              <FlatList
                ref={scrollview => {
                  this.scrollview = scrollview;
                }}
                ListHeaderComponent={() => {
                  return (
                    <View>
                      <Query query={topArticleWithImagesQuery}>
                        {({ loading, error, data }) => {
                          if (!(data && data.articles)) return null;
                          return <Poster data={data.articles} />;
                        }}
                      </Query>
                      <RecommendAuthor navigation={navigation} />
                    </View>
                  );
                }}
                refreshing={loading}
                onRefresh={() => {
                  refetch();
                }}
                data={data.articles}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <NoteItem post={item} popoverMenu options={["不感兴趣"]} popoverHandler={() => null} />}
                onEndReached={() => {
                  if (data.articles) {
                    fetchMore({
                      variables: {
                        offset: data.articles.length
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!(fetchMoreResult && fetchMoreResult.articles && fetchMoreResult.articles.length > 0)) {
                          this.setState({
                            fetchingMore: false
                          });
                          return prev;
                        }
                        return Object.assign({}, prev, {
                          articles: [...prev.articles, ...fetchMoreResult.articles]
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

  _renderCarouselItem() {
    <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("文章详情", { article: article })}>
      <Image style={styles.posterImage} source={{ uri: article.top_image }} />
      <View style={styles.posterTitle}>
        <Text style={styles.posterTitleText} numberOfLines={1}>
          {article.title}
        </Text>
      </View>
    </TouchableOpacity>;
  }

  _renderSwiperImage(poster) {
    var posterList = [];
    poster.forEach((article, index) => {
      posterList.push(
        <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("文章详情", { article: article })}>
          <Image style={styles.posterImage} source={{ uri: article.top_image }} />
          <View style={styles.posterTitle}>
            <Text style={styles.posterTitleText} numberOfLines={1}>
              {article.title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
    return posterList;
  }

  _scrollToTop = () => {
    if (this.scrollview) {
      this.scrollview.scrollToOffset({ x: 0, y: 0, animated: true });
      this.props.client.query({
        query: recommendArticlesQuery,
        fetchPolicy: "network-only"
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  swiperContainer: {
    height: width * 0.5
  },
  posterImage: {
    width,
    height: width * 0.5,
    resizeMode: "cover"
  },
  posterTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 32,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  posterTitleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff"
  }
});

export default compose(
  withApollo,
  connect(store => ({ articles: store.articles.articles }))
)(RecommendScreen);
