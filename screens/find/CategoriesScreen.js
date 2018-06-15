import React from "react";
import { FlatList, StyleSheet, ScrollView, Text, View, Image, Button, TextInput, StatusBar, Dimensions, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import { DivisionLine, ContentEnd, LoadingMore, LoadingError, SpinnerLoading } from "../../components/Pure";
import OfficialColumn from "../../components/Category/OfficialColumn";
import CategoryItem from "../../components/Category/CategoryItem";
import Screen from "../Screen";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { topCategoriesQuery } from "../../graphql/category.graphql";
import { Query } from "react-apollo";

const { width, height } = Dimensions.get("window");

const official_categories = [
  {
    id: 1,
    avatar: "https://ainicheng.com/app/follows.png",
    name: "关注的专题",
    type: "全部关注",
    filter: "关注的专题"
  },
  {
    id: 64,
    avatar: "https://www.ainicheng.com/app/teaching.png",
    name: "官方课堂",
    type: "视频详情"
  },
  {
    id: 11,
    avatar: "https://ainicheng.com/app/moba.png",
    name: "MOBA",
    type: "专题详情"
  },
  {
    id: 101,
    avatar: "https://ainicheng.com/app/sheji.png",
    name: "射击",
    type: "专题详情"
  },
  {
    id: 99,
    avatar: "https://ainicheng.com/app/jingsong.png",
    name: "惊悚",
    type: "专题详情"
  },
  {
    id: 69,
    avatar: "https://ainicheng.com/app/gedou.png",
    name: "格斗",
    type: "专题详情"
  },
  {
    id: 58,
    avatar: "https://ainicheng.com/app/maoxian.png",
    name: "冒险",
    type: "专题详情"
  },
  {
    id: 19,
    avatar: "https://ainicheng.com/app/jingsu.png",
    name: "竞速",
    type: "专题详情"
  },
  {
    id: 18,
    avatar: "https://ainicheng.com/app/kapai.png",
    name: "卡牌",
    type: "专题详情"
  },
  {
    id: 60,
    avatar: "https://ainicheng.com/app/qipai.png",
    name: "棋牌",
    type: "专题详情"
  },
  {
    id: 99,
    avatar: "https://ainicheng.com/app/jishizhanlue.png",
    name: "即时战略",
    type: "专题详情"
  },
  {
    id: 100,
    avatar: "https://ainicheng.com/app/jingyingcelue.png",
    name: "经营策略",
    type: "专题详情"
  },
  {
    id: 55,
    avatar: "https://ainicheng.com/app/moniyangc.png",
    name: "模拟养成",
    type: "专题详情"
  },
  {
    id: 61,
    avatar: "https://ainicheng.com/app/yizhi.png",
    name: "益智",
    type: "专题详情"
  },
  {
    id: 82,
    avatar: "https://ainicheng.com/app/music.png",
    name: "音乐",
    type: "专题详情"
  }
];

class CategoriesScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      fetchingMore: true
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Query query={topCategoriesQuery}>
          {({ loading, error, data, fetchMore, refetch }) => {
            if (error) return <LoadingError reload={() => refetch()} />;
            if (!(data && data.categories)) return null;
            return (
              <FlatList
                data={data.categories}
                ListHeaderComponent={this._renderHeader.bind(this)}
                keyExtractor={(item, index) => (item.key ? item.key : index.toString())}
                renderItem={this._renderCategoryItem}
                numColumns={3}
                columnWrapperStyle={{ paddingBottom: 20, justifyContent: "space-around" }}
                refreshing={loading}
                onRefresh={() => {
                  refetch();
                }}
                onEndReachedThreshold={0.3}
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

  _renderHeader = () => {
    // let { official_categories } = this.state;
    return (
      <View style={{ marginBottom: 15 }}>
        <View style={{ flex: 1, paddingBottom: 20 }}>
          <View style={styles.officialList}>
            {official_categories.slice(0, 5).map((elem, index) => {
              return this._renderColumnItem({
                item: elem,
                index
              });
            })}
          </View>
          <View style={styles.officialList}>
            {official_categories.slice(5, 10).map((elem, index) => {
              return this._renderColumnItem({
                item: elem,
                index
              });
            })}
          </View>
          <View style={styles.officialList}>
            {official_categories.slice(10, 15).map((elem, index) => {
              return this._renderColumnItem({
                item: elem,
                index
              });
            })}
          </View>
        </View>
        <DivisionLine />
      </View>
    );
  };

  _renderColumnItem = ({ item, index }) => {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity
        key={index}
        style={{ flex: 1 }}
        onPress={() => navigate(item.type, item.type == "专题详情" ? { category: item } : { filter: item.filter })}
      >
        <OfficialColumn data={item} />
      </TouchableOpacity>
    );
  };

  _renderCategoryItem = ({ item, index }) => {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity onPress={() => navigate("专题详情", { category: item })}>
        <CategoryItem category={item} />
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  },
  followCategory: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  officialList: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 20
  },
  categoryListWrap: {
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 15
  }
});

export default connect(store => ({ categories: store.categories }))(CategoriesScreen);
