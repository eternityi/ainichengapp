import React, { Component } from "react";

import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import OfficialColumn from "../../components/Category/OfficialColumn";

import Colors from "../../constants/Colors";
import { official_categories } from "../../constants/AppData";

class OfficialCategories extends React.Component {
	render() {
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
