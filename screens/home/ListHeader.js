import React, { PureComponent } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import OfficialColumn from "../../components/Category/OfficialColumn";

const official_categories = [
	{
		id: 1,
		avatar: "https://ainicheng.com/images/appicons/follows.png",
		name: "全部关注",
		type: "全部关注"
	},
	{
		id: 2,
		avatar: "https://www.ainicheng.com/images/appicons/ranking.png",
		name: "排行榜",
		type: "排行榜"
	},
	{
		id: 64,
		avatar: "https://www.ainicheng.com/images/appicons/teaching.png",
		name: "官方课堂",
		type: "专题详情"
	},
	{
		id: 11,
		avatar: "https://ainicheng.com/images/appicons/moba.png",
		name: "MOBA",
		type: "专题详情"
	},
	{
		id: 101,
		avatar: "https://ainicheng.com/images/appicons/sheji.png",
		name: "射击",
		type: "专题详情"
	},
	{
		id: 58,
		avatar: "https://ainicheng.com/images/appicons/maoxian.png",
		name: "冒险",
		type: "专题详情"
	},
	{
		id: 19,
		avatar: "https://ainicheng.com/images/appicons/jingsu.png",
		name: "竞速",
		type: "专题详情"
	},
	{
		id: 18,
		avatar: "https://ainicheng.com/images/appicons/kapai.png",
		name: "卡牌",
		type: "专题详情"
	},
	{
		id: 60,
		avatar: "https://ainicheng.com/images/appicons/qipai.png",
		name: "棋牌",
		type: "专题详情"
	},
	{
		id: 69,
		avatar: "https://ainicheng.com/images/appicons/gedou.png",
		name: "格斗",
		type: "专题详情"
	},
	{
		id: 99,
		avatar: "https://ainicheng.com/images/appicons/jishizhanlue.png",
		name: "即时战略",
		type: "专题详情"
	},
	{
		id: 100,
		avatar: "https://ainicheng.com/images/appicons/jingyingcelue.png",
		name: "经营策略",
		type: "专题详情"
	},
	{
		id: 61,
		avatar: "https://ainicheng.com/images/appicons/yizhi.png",
		name: "益智",
		type: "专题详情"
	},
	{
		id: 82,
		avatar: "https://ainicheng.com/images/appicons/music.png",
		name: "音乐",
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
		paddingLeft: 20
	}
});

export default ListHeader;
