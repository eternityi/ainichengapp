import React, { Component } from "react";
import { StyleSheet, View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import Colors from "../../../constants/Colors";
import PlainArticleItem from "../../../components/Article/PlainArticleItem";
import { ContentEnd, LoadingMore, LoadingError, BlankContent, SpinnerLoading } from "../../../components/Pure";

import { connect } from "react-redux";
import actions from "../../../store/actions";
import { hotArticlesQuery } from "../../../graphql/article.graphql";
import { graphql, Query } from "react-apollo";

class HotTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchingMore: false
    };
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Query query={hotArticlesQuery}>
          {({ loading, error, data, refetch, fetchMore }) => {
            if (error) return <LoadingError reload={() => refetch()} />;
            if (!(data && data.articles)) return <SpinnerLoading />;
            if (data.articles.length < 1) return <BlankContent />;
            return (
              <FlatList
                refreshing={loading}
                onRefresh={() => {
                  refetch();
                }}
                data={data.articles}
                keyExtractor={(item, index) => (item.key ? item.key : index.toString())}
                renderItem={({ item }) => (
                  <View>
                    <TouchableOpacity onPress={() => navigate("文章详情", { articleId: item.id })}>
                      <PlainArticleItem article={item} />
                    </TouchableOpacity>
                  </View>
                )}
                onEndReachedThreshold={0.3}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  }
});

export default connect(store => ({
  user_articles_dynamic: store.articles.user_articles_dynamic
}))(HotTab);
