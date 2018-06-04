import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Avatar from "../Pure/Avatar";
import Colors from "../../constants/Colors";

class FollowedGroup extends Component {
	render() {
		let { followed = {} } = this.props;
		return (
			<View style={styles.groupWrap}>
				<Avatar type={followed.type == "user" ? "user" : "category"} uri={followed.type == "user" ? followed.avatar : followed.logo} />
				<View style={styles.followedInfo}>
					<View style={styles.topInfo}>
						<Text numberOfLines={1} style={{ color: Colors.primaryFontColor, fontSize: 17 }}>
							{followed.name || ""}
						</Text>
						{followed.updates > 0 && (
							<View style={styles.updates}>
								<View style={styles.indicator} />
								<Text numberOfLines={1} style={{ color: Colors.tintFontColor, fontSize: 12 }}>
									{followed.updates + "篇文章"}
								</Text>
							</View>
						)}
					</View>
					<View>
						<Text numberOfLines={1} style={{ color: Colors.tintFontColor, fontSize: 13 }}>
							{followed.latest_update || ""}
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	groupWrap: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 20,
		paddingLeft: 15,
		paddingRight: 10,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	followedInfo: {
		flex: 1,
		paddingLeft: 15
	},
	topInfo: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6
	},
	updates: {
		flexDirection: "row",
		alignItems: "center"
	},
	indicator: {
		width: 10,
		height: 10,
		marginHorizontal: 5,
		borderRadius: 5,
		backgroundColor: Colors.linkColor
	}
});

export default FollowedGroup;
