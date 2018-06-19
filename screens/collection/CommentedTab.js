import React, { Component } from "react";
import { StyleSheet, View, FlatList, ScrollView, TouchableOpacity } from "react-native";

import BasicArticleItem from "../../components/Article/BasicArticleItem";
import { ContentEnd, LoadingMore, BlankContent, SpinnerLoading, LoadingError } from "../../components/Pure";

import Colors from "../../constants/Colors";
import { collectionArticlesByCommentedQuery } from "../../graphql/collection.graphql";
import { Mutation, Query } from "react-apollo";

class CommentedTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchingMore: true
    };
  }

  render() {
    const { navigation, scrollEnabled, onScroll, collection } = this.props;
    return (
      <View style={styles.container}>
        <Query
          query={collectionArticlesByCommentedQuery}
          variables={{
            id: collection.id
          }}
        >
          {({ loading, error, data, refetch, fetchMore }) => {
            if (error) return <LoadingError reload={() => refetch()} />;
            if (!(data && data.articles)) return <SpinnerLoading />;
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
                      <BasicArticleItem article={item} navigation={navigation} />
                    </TouchableOpacity>
                  </View>
                )}
                getItemLayout={(data, index) => ({
                  length: 180,
                  offset: 180 * index,
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

export default CommentedTab;
