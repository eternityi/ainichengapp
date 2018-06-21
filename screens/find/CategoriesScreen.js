import React from "react";
import {
  FlatList,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  Button,
  TextInput,
  StatusBar,
  Dimensions,
  TouchableOpacity
} from "react-native";

import Colors from "../../constants/Colors";
import {
  DivisionLine,
  ContentEnd,
  LoadingMore,
  LoadingError,
  SpinnerLoading
} from "../../components/Pure";
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
    avatar: "https://ainicheng.com/images/appicons/wodeguanzhu.png",
    name: "关注的专题",
    type: "全部关注",
    filter: "CATEGORY"
  },
  {
    id: 64,
    avatar: "https://www.ainicheng.com/images/appicons/guanfangketang.png",
    name: "官方课堂",
    type: "视频详情"
  },
  {
    id: 51,
    avatar: "https://ainicheng.com/images/appicons/jingxuantougao.png",
    name: "精选投稿",
    type: "专题详情"
  },
  {
    id: 5,
    avatar: "https://ainicheng.com/images/appicons/youxizixun.png",
    name: "游戏资讯",
    type: "专题详情"
  },
  {
    id: 85,
    avatar: "https://ainicheng.com/images/appicons/steam.png",
    name: "steam",
    type: "专题详情"
  },
  {
    id: 12,
    avatar: "https://ainicheng.com/images/appicons/yingxionglianmeng.png",
    name: "英雄联盟",
    type: "专题详情"
  },
  {
    id: 87,
    avatar: "https://ainicheng.com/images/appicons/juedidataosha.png",
    name: "绝地求生",
    type: "专题详情"
  },
  {
    id: 12,
    avatar: "https://ainicheng.com/images/appicons/wangzerongyao.png",
    name: "王者荣耀",
    type: "专题详情"
  },
  {
    id: 6,
    avatar: "https://ainicheng.com/images/appicons/dota2.png",
    name: "dota2",
    type: "专题详情"
  },
  {
    id: 86,
    avatar: "https://ainicheng.com/images/appicons/duanyou.png",
    name: "端游",
    type: "专题详情"
  },
  {
    id: 84,
    avatar: "https://ainicheng.com/images/appicons/shouyou.png",
    name: "手游",
    type: "专题详情"
  },
  {
    id: 46,
    avatar: "https://ainicheng.com/images/appicons/biaoqingbao.png",
    name: "表情包",
    type: "专题详情"
  },
  {
    id: 47,
    avatar: "https://ainicheng.com/images/appicons/touxiang.png",
    name: "头像",
    type: "专题详情"
  },
  {
    id: 1,
    avatar: "https://ainicheng.com/images/appicons/nicheng.png",
    name: "昵称",
    type: "专题详情"
  },
  {
    id: 72,
    avatar: "https://ainicheng.com/images/appicons/xinqing.png",
    name: "心情",
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
                keyExtractor={(item, index) =>
                  item.key ? item.key : index.toString()
                }
                renderItem={this._renderCategoryItem}
                numColumns={3}
                columnWrapperStyle={{
                  paddingBottom: 20,
                  justifyContent: "space-around"
                }}
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
                        if (
                          !(
                            fetchMoreResult &&
                            fetchMoreResult.categories &&
                            fetchMoreResult.categories.length > 0
                          )
                        ) {
                          this.setState({
                            fetchingMore: false
                          });
                          return prev;
                        }
                        return Object.assign({}, prev, {
                          categories: [
                            ...prev.categories,
                            ...fetchMoreResult.categories
                          ]
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
                  return this.state.fetchingMore ? (
                    <LoadingMore />
                  ) : (
                    <ContentEnd />
                  );
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
        onPress={() =>
          navigate(
            item.type,
            item.type == "专题详情"
              ? { category: item }
              : { filter: item.filter }
          )
        }
      >
        <OfficialColumn data={item} />
      </TouchableOpacity>
    );
  };

  _renderCategoryItem = ({ item, index }) => {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity
        onPress={() => navigate("专题详情", { category: item })}
      >
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

export default connect(store => ({ categories: store.categories }))(
  CategoriesScreen
);
