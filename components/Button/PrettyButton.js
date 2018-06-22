import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import Colors from "../../constants/Colors";

class PrettyButton extends Component {
	render() {
		let { onPress, name = "提交", disabled = false, buttonStyle = {}, fontStyle = {} } = this.props;
		return (
			<TouchableOpacity onPress={onPress} disabled={disabled}>
				<View style={[styles.button, buttonStyle, disabled && { opacity: 0.5 }]}>
					<Text style={[styles.buttonName, fontStyle]}>{name}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
		backgroundColor: Colors.weixinColor
	},
	buttonName: {
		fontSize: 16,
		fontWeight: "500",
		color: "#fff"
	}
});

export default PrettyButton;
