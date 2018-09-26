import React from "react";
import { FlatList, StyleSheet, ScrollView, Text, View, Image, Dimensions, TouchableOpacity, RefreshControl } from "react-native";

import { Colors, Divice } from "../../constants";
import Carousel from "./Carousel";
import RecommendAuthors from "./RecommendAuthors";
import NoteItem from "../../components/Article/NoteItem";
import { ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../components/Pure";
import Screen from "../Screen";

import { recommandDynamicQuery } from "../../graphql/article.graphql";
import { Mutation, Query, compose, withApollo } from "react-apollo";
import { connect } from "react-redux";
import actions from "../../store/actions";

const { width, height } = Dimensions.get("window");

const sliderWidth = width;
const itemWidth = width - 40;

class FollowedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fetchingMore: true };
  }

  render() {
    let { navigation, user } = this.props;
    return (
      <View style={styles.container}>
        {user.id ? (
          <Query query={recommandDynamicQuery} variables={{ user_id: user.id }}>
            {({ loading, error, data, refetch, fetchMore }) => {
              if (error) return <LoadingError reload={() => refetch()} />;
              if (!(data && data.articles)) return <SpinnerLoading />;
              let articles = data.articles;
              return (
                <FlatList
                  refreshing={loading}
                  onRefresh={() => {
                    refetch();
                  }}
                  data={articles}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => <NoteItem post={item} popoverHandler={() => null} />}
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
                    return articles.length > 0 ? this.state.fetchingMore ? <LoadingMore /> : <ContentEnd /> : <View />;
                  }}
                />
              );
            }}
          </Query>
        ) : (
          <ScrollView>
            <Image style={styles.banner} source={require("../../assets/images/planebg.png")} />
            <RecommendAuthors navigation={navigation} />
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  banner: { width: Divice.wp("100%"), height: 100, resizeMode: "cover" }
});

export default compose(
  withApollo,
  connect(store => ({ user: store.users.user }))
)(FollowedScreen);
