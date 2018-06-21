import React, { PureComponent } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import OfficialColumn from "../../components/Category/OfficialColumn";
import { NavigationActions } from "react-navigation";

const official_categories = [
	{
		id: 1,
		avatar: "https://ainicheng.com/images/appicons/wodeguanzhu.png",
		name: "全部关注",
		type: "全部关注",
		filter: "USER_CATEGORY"
	},
	{
		id: 64,
		avatar: "https://www.ainicheng.com/images/appicons/guanfangketang.png",
		name: "官方课堂",
		type: "视频详情"
	},
	{
		id: 60,
		avatar: "https://ainicheng.com/images/appicons/jingxuantougao.png",
		name: "精选投稿",
		type: "专题详情"
	},
	{
		id: 60,
		avatar: "https://ainicheng.com/images/appicons/youxizixun.png",
		name: "游戏资讯",
		type: "专题详情"
	},
	{
		id: 18,
		avatar: "https://ainicheng.com/images/appicons/steam.png",
		name: "steam",
		type: "专题详情"
	},
	{
		id: 11,
		avatar: "https://ainicheng.com/images/appicons/yingxionglianmeng.png",
		name: "英雄联盟",
		type: "专题详情"
	},
	{
		id: 101,
		avatar: "https://ainicheng.com/images/appicons/juedidataosha.png",
		name: "绝地逃生",
		type: "专题详情"
	},
	{
		id: 99,
		avatar: "https://ainicheng.com/images/appicons/wangzerongyao.png",
		name: "王者荣耀",
		type: "专题详情"
	},
	{
		id: 69,
		avatar: "https://ainicheng.com/images/appicons/dota2.png",
		name: "dota2",
		type: "专题详情"
	},
	{
		id: 58,
		avatar: "https://ainicheng.com/images/appicons/duanyou.png",
		name: "端游",
		type: "专题详情"
	},
	{
		id: 100,
		avatar: "https://ainicheng.com/images/appicons/shouyou.png",
		name: "手游",
		type: "专题详情"
	},
	{
		id: 19,
		avatar: "https://ainicheng.com/images/appicons/biaoqingbao.png",
		name: "表情包",
		type: "专题详情"
	},
	{
		id: 60,
		avatar: "https://ainicheng.com/images/appicons/touxiang.png",
		name: "头像",
		type: "专题详情"
	},
	{
		id: 99,
		avatar: "https://ainicheng.com/images/appicons/nicheng.png",
		name: "昵称",
		type: "专题详情"
	},
	{
		id: 100,
		avatar: "https://ainicheng.com/images/appicons/xinqing.png",
		name: "心情",
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
			<TouchableOpacity
				key={index.toString()}
				style={{ marginRight: 25 }}
				onPress={() => {
					// navigation.navigate(item.type, { category: item }, {}, "official_column");
					const navigateAction = NavigationActions.navigate({
						routeName: item.type,
						params: { category: item },
						action: null,
						key: "screen-123"
					});

					navigation.dispatch(navigateAction);
				}}
			>
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
