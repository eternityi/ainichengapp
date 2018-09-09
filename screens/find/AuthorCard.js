import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Button, TouchableOpacity, Platform } from "react-native";

import { FollowButton } from "../../components/Button";
import Colors from "../../constants/Colors";
import { Avatar } from "../../components/Pure";

import Config from "../../constants/Config";
import { connect } from "react-redux";
import actions from "../../store/actions";

class AuthorCard extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		let { user } = this.props;
		return (
			<View style={styles.cardWrap}>
				<View>
					<Avatar uri={user.avatar} size={60} />
				</View>
				<View>
					<Text numberOfLines={1} style={styles.name}>
						{user.name}
					</Text>
				</View>
				<View>
					<Text numberOfLines={1} style={styles.latestFollower}>
						{user.followings.length ? user.followings[0].name + "关注" : Config.AppDisplayName + "推荐"}
					</Text>
				</View>
				<View>
					<FollowButton type={"user"} id={user.id} status={user.followed_status} customStyle={styles.followWrap} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	cardWrap: {
		borderRadius: 4,
		backgroundColor: Colors.skinColor,
		width: 120,
		height: 160,
		alignItems: "center",
		justifyContent: "center"
	},
	name: {
		fontSize: 14,
		lineHeight: 18,
		color: Colors.darkFontColor,
		paddingTop: 8
	},
	latestFollower: {
		fontSize: 11,
		color: Colors.tintFontColor,
		paddingVertical: 6
	},
	followWrap: {
		height: 28,
		alignSelf: "stretch",
		borderRadius: 14
	}
});

export default AuthorCard;
