import React, { PureComponent } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import OfficialColumn from "../../components/Category/OfficialColumn";

const official_categories = [
	{
		id: 1,
		avatar: "https://dongmeiwei.com/images/app/follows.png",
		name: "全部关注",
		type: "全部关注"
	},
	{
		id: 2,
		avatar: "https://www.dongmeiwei.com/images/app/rank.png",
		name: "排行榜",
		type: "排行榜"
	},
	{
		id: 11,
		avatar: "https://www.dongmeiwei.com/images/app/choiceness.png",
		name: "官方课堂",
		type: "专题详情"
	},
	{
		id: 102,
		avatar: "https://dongmeiwei.com/images/app/fruits.png",
		name: "水果",
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
		name: "湘菜",
		type: "专题详情"
	},
	{
		id: 19,
		avatar: "https://dongmeiwei.com/images/app/yuecai.png",
		name: "粤菜",
		type: "专题详情"
	},
	{
		id: 18,
		avatar: "https://dongmeiwei.com/images/app/chuangcai.png",
		name: "川菜",
		type: "专题详情"
	},
	{
		id: 60,
		avatar: "https://dongmeiwei.com/images/app/lucai.png",
		name: "鲁菜",
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
		name: "闽菜",
		type: "专题详情"
	},
	{
		id: 100,
		avatar: "https://dongmeiwei.com/images/app/huicai.png",
		name: "徽菜",
		type: "专题详情"
	},
	{
		id: 61,
		avatar: "https://dongmeiwei.com/images/app/sucai.png",
		name: "苏菜",
		type: "专题详情"
	},
	{
		id: 82,
		avatar: "https://dongmeiwei.com/images/app/zhecai.png",
		name: "浙菜",
		type: "专题详情"
	}
];

class ListHeader extends PureComponent {
	render() {
		return (
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} removeClippedSubviews={true}>
				<View style={styles.officialColumnWarp}>
					{official_categories.map((item, index) => {
						return this._renderItem(item, index);
					})}
				</View>
			</ScrollView>
		);
	}

	_renderItem = (item, index) => {
		const { navigation } = this.props;
		return (
			<TouchableOpacity key={index.toString()} style={{ marginRight: 25 }} onPress={() => navigation.navigate(item.type, { category: item })}>
				<OfficialColumn data={item} />
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	officialColumnWarp: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingLeft: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	}
});

export default ListHeader;
