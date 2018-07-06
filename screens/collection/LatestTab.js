import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity } from "react-native";

import NoteItem from "../../components/Article/NoteItem";
import { ContentEnd, LoadingMore, BlankContent, SpinnerLoading, LoadingError } from "../../components/Pure";

import Colors from "../../constants/Colors";
import { collectionArticlesByLatestQuery } from "../../graphql/collection.graphql";
import { Mutation, Query } from "react-apollo";

class LatestTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchingMore: true
    };
  }

  render() {
    const { navigation, scrollEnabled, onScroll, collection, gotArticleLength } = this.props;
    return (
      <View style={styles.container}>
        <Query
          query={collectionArticlesByLatestQuery}
          variables={{
            id: collection.id
          }}
        >
          {({ loading, error, data, refetch, fetchMore }) => {
            if (error) return <LoadingError reload={() => refetch()} />;
            if (!(data && data.articles)) return <SpinnerLoading />;
            gotArticleLength(data.articles.length);
            if (data.articles.length < 1) return <BlankContent />;
            return (
              <FlatList
                onScroll={onScroll}
                scrollEnabled={scrollEnabled}
                data={data.articles}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("文章详情", {
                          article: item
                        })}
                    >
                      <NoteItem post={item} navigation={navigation} />
                    </TouchableOpacity>
                  </View>
                )}
                getItemLayout={(data, index) => ({
                  length: 150,
                  offset: 150 * index,
                  index
                })}
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
                ListFooterComponent={this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />}
              />
            );
          }}
        </Query>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  }
});

export default LatestTab;
