import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { Avatar, ContentEnd } from "../../components/Pure";
import { FollowButton } from "../../components/Button";
import UserListHorizontal from "../../components/User/UserListHorizontal";

import { connect } from "react-redux";
import actions from "../../store/actions";
import { Query, Mutation } from "react-apollo";

class CategoryTopInfo extends Component {
	render() {
		let { category = {}, navigation } = this.props;
		let { logo, name, count_follows, count_articles, followed, id, description, authors } = category;
		return (
			<View>
				<View style={styles.infoTop}>
					<View>
						<Avatar type={"category"} uri={logo} size={70} />
					</View>
					<View style={{ flex: 1, marginHorizontal: 10 }}>
						<View>
							<Text
								style={{
									fontSize: 18,
									color: Colors.darkFontColor
								}}
							>
								{name}
							</Text>
						</View>
						<View style={[styles.layoutFlexRow, { marginVertical: 8 }]}>
							<View style={{ marginRight: 10 }}>
								<Text style={styles.metaText}>{"关注 " + count_follows}</Text>
							</View>
							<View>
								<Text style={styles.metaText}>{"帖子 " + count_articles}</Text>
							</View>
						</View>
					</View>
					<View style={{ width: 70, height: 32 }}>
						<FollowButton
							customStyle={{ flex: 1, width: "auto" }}
							theme={Colors.themeColor}
							status={followed}
							id={id}
							type={"category"}
							fontSize={14}
						/>
					</View>
				</View>
				<View style={styles.setTopBox}>
					<TouchableOpacity style={styles.topItem} onPress={() => navigation.navigate("专题介绍", { category })}>
						<View>
							<Text style={styles.linkText}>简介</Text>
						</View>
						<View style={{ flex: 1, marginLeft: 10 }}>
							<Text style={styles.metaText} numberOfLines={1}>
								{description ? description : "暂时还没有freestyle"}
							</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.topItem, { borderBottomColor: "transparent" }]}
						onPress={() => navigation.navigate("专题成员", { category })}
					>
						<View>
							<Text style={styles.linkText}>成员</Text>
						</View>
						<View style={{ marginLeft: 10 }}>
							<UserListHorizontal users={authors.slice(0, 6)} radius={14} />
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	infoTop: {
		flexDirection: "row",
		alignItems: "center",
		padding: 15,
		borderBottomWidth: 6,
		borderBottomColor: Colors.lightBorderColor
	},
	setTopBox: {
		paddingHorizontal: 15,
		borderBottomWidth: 6,
		borderBottomColor: Colors.lightBorderColor
	},
	topItem: {
		height: 40,
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	linkText: {
		fontSize: 14,
		color: Colors.linkColor
	},
	metaText: {
		fontSize: 14,
		color: "#666"
	},
	layoutFlexRow: {
		flexDirection: "row",
		alignItems: "center"
	}
});

export default CategoryTopInfo;
