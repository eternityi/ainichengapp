import React, { Component } from "react";

import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import OfficialColumn from "../../components/Category/OfficialColumn";

import Colors from "../../constants/Colors";

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
		id: 13,
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

class OfficialCategories extends React.Component {
	render() {
		console.log("render");
		return (
			<View style={styles.officialWrap}>
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
				<View style={styles.categoryHeader}>
					<Text style={styles.boldText}>全部专题</Text>
				</View>
			</View>
		);
	}

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
}

const styles = StyleSheet.create({
	officialWrap: {
		backgroundColor: Colors.skinColor
	},
	officialList: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingTop: 20
	},
	categoryHeader: {
		marginTop: 20,
		paddingTop: 15,
		paddingHorizontal: 15,
		paddingBottom: 10,
		backgroundColor: Colors.lightGray
	},
	boldText: {
		fontSize: 16,
		fontWeight: "500",
		color: Colors.darkFontColor
	}
});

export default OfficialCategories;
