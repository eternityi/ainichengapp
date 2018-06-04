import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Button, TouchableOpacity } from "react-native";

import { FollowButton } from "../../components/Button";
import Color from "../../constants/Colors";
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
					<Avatar uri={user.avatar} size={66} />
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
				<FollowButton type={"user"} id={user.id} status={user.followed_status} customStyle={styles.followWrap} fontSize={16} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	cardWrap: {
		borderWidth: 0.5,
		borderRadius: 4,
		borderColor: Color.tintBorderColor,
		backgroundColor: Color.skinColor,
		width: 152,
		paddingVertical: 15,
		paddingHorizontal: 10,
		alignItems: "center"
	},
	name: {
		fontSize: 17,
		color: Color.darkFontColor,
		paddingTop: 8
	},
	latestFollower: {
		fontSize: 13,
		color: Color.tintFontColor,
		paddingTop: 12
	},
	followWrap: {
		alignSelf: "stretch",
		marginTop: 20,
		height: 34,
		width: "auto"
	}
});

export default AuthorCard;
