import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { Avatar } from "../../components/Pure";
import { UserGroup, CategoryGroup } from "../../components/MediaGroup";

class FollowItem extends Component {
	render() {
		let { data, navigation } = this.props;
		return (
			<View>
				{data.user ? (
					<UserGroup
						navigation={navigation}
						customStyle={{ avatar: 42, height: 45, nameSize: 17 }}
						user={{
							avatar: data.user.avatar,
							name: data.user.name
						}}
					/>
				) : (
					<CategoryGroup
						navigation={navigation}
						customStyle={{ logo: 42, height: 45, nameSize: 17 }}
						category={{
							logo: data.category.logo,
							name: data.category.name,
							count_articles: data.category.count_articles,
							count_follows: data.category.count_follows
						}}
					/>
				)}
				<View style={{ paddingLeft: 50, marginTop: 20 }}>
					<View>
						<Text numberOfLines={3} style={[styles.recommendInfo, data.category && { lineHeight: 22 }]}>
							{data.user ? data.user.describe : data.category.describe}
						</Text>
					</View>
					{data.user && (
						<View style={styles.latestUpdataWrap}>
							<View style={[styles.latestUpdata, { marginBottom: 6 }]}>
								<Iconfont name={"collection"} size={14} color={Colors.tintFontColor} style={{ marginRight: 8 }} />
								<Text numberOfLines={1} style={styles.recommendInfo}>
									{data.user.latest_article[0]}
								</Text>
							</View>
							<View style={styles.latestUpdata}>
								<Iconfont name={"collection"} size={14} color={Colors.tintFontColor} style={{ marginRight: 8 }} />
								<Text numberOfLines={1} style={styles.recommendInfo}>
									{data.user.latest_article[1]}
								</Text>
							</View>
						</View>
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	recommendWrap: {
		paddingVertical: 20
	},
	recommendInfo: {
		fontSize: 13,
		color: Colors.tintFontColor,
		lineHeight: 18
	},
	latestUpdataWrap: {
		marginTop: 10,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: Colors.lightBorderColor
	},
	latestUpdata: {
		flexDirection: "row",
		alignItems: "center"
	}
});

export default FollowItem;
