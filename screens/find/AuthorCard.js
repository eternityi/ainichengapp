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
					<Avatar uri={user.avatar} size={64} />
				</View>
				<View>
					<Text numberOfLines={1} style={styles.name}>
						{user.name}
					</Text>
				</View>
				<View>
					<Text numberOfLines={1} style={styles.latestFollower}>
						{user.followings.length ? user.followings[0].name + "关注" : Config.AppName + "推荐"}
					</Text>
				</View>
				<FollowButton type={"user"} id={user.id} status={user.followed_status} customStyle={styles.followWrap} fontSize={14} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	cardWrap: {
		borderRadius: 4,
		backgroundColor: Colors.skinColor,
		width: 115,
		padding: 12,
		alignItems: "center"
	},
	name: {
		fontSize: 14,
		color: Colors.darkFontColor,
		paddingTop: 8
	},
	latestFollower: {
		fontSize: 11,
		color: Colors.tintFontColor,
		paddingVertical: 6
	},
	followWrap: {
		width: "auto",
		height: 28,
		alignSelf: "stretch",
		marginHorizontal: 4,
		borderRadius: 15
	}
});

export default AuthorCard;
