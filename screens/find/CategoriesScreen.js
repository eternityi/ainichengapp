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
    avatar: "https://dongmeiwei.com/images/app/followed.png",
    name: "关注的专题",
    type: "全部关注"
  },
  {
    id: 2,
    avatar: "https://dongmeiwei.com/images/app/rank.png",
    name: "排行榜",
    type: "排行榜"
  },
  {
    id: 11,
    avatar: "https://dongmeiwei.com/images/app/choiceness.png",
    name: "官方课堂",
    type: "专题详情"
  },
  {
    id: 102,
    avatar: "https://dongmeiwei.com/images/app/wallet.png",
    name: "我的糖果",
    type: "专题详情"
  },
  {
    id: 102,
    avatar: "https://dongmeiwei.com/images/app/fruits.png",
    name: "水果大全",
    type: "专题详情"
  },
  {
    id: 101,
    avatar: "https://dongmeiwei.com/images/app/ccake.png",
    name: "中式糕点",
    type: "专题详情"
  },
  {
    id: 58,
    avatar: "https://dongmeiwei.com/images/app/xiangcai.png",
    name: "湘菜大全",
    type: "专题详情"
  },
  {
    id: 19,
    avatar: "https://dongmeiwei.com/images/app/yuecai.png",
    name: "粤菜大全",
    type: "专题详情"
  },
  {
    id: 18,
    avatar: "https://dongmeiwei.com/images/app/chuangcai.png",
    name: "川菜大全",
    type: "专题详情"
  },
  {
    id: 60,
    avatar: "https://dongmeiwei.com/images/app/lucai.png",
    name: "鲁菜大全",
    type: "专题详情"
  },
  {
    id: 69,
    avatar: "https://dongmeiwei.com/images/app/cake.png",
    name: "西式糕点",
    type: "专题详情"
  },
  {
    id: 99,
    avatar: "https://dongmeiwei.com/images/app/mincai.png",
    name: "闽菜大全",
    type: "专题详情"
  },
  {
    id: 100,
    avatar: "https://dongmeiwei.com/images/app/huicai.png",
    name: "徽菜大全",
    type: "专题详情"
  },
  {
    id: 61,
    avatar: "https://dongmeiwei.com/images/app/sucai.png",
    name: "苏菜大全",
    type: "专题详情"
  },
  {
    id: 82,
    avatar: "https://dongmeiwei.com/images/app/zhecai.png",
    name: "浙菜大全",
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
                columnWrapperStyle={{ paddingBottom: 20, paddingLeft: 15 }}
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
        <TouchableOpacity
          style={styles.followCategory}
          onPress={() =>
            this.props.navigation.navigate("全部关注", {
              filter: "只看专题"
            })}
        >
          <Image style={{ marginRight: 10, width: 22, height: 22 }} source={require("../../assets/images/xinxin.png")} />
          <Text
            style={{
              fontSize: 14,
              color: Colors.primaryFontColor
            }}
          >
            我关注的专题
          </Text>
        </TouchableOpacity>
        <DivisionLine />
      </View>
    );
  };

  _renderColumnItem = ({ item, index }) => {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity key={index} style={{ flex: 1 }} onPress={() => navigate(item.type, { category: item })}>
        <OfficialColumn data={item} />
      </TouchableOpacity>
    );
  };

  _renderCategoryItem = ({ item, index }) => {
    const { navigate } = this.props.navigation;
    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={() => navigate("专题详情", { category: item })}>
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
