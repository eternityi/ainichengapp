import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";

class Button extends Component {
	render() {
		let { bthStyle = {}, theme = Colors.themeColor, name, fontSize, iconName, iconSize = fontSize, handler } = this.props;
		return (
			<TouchableOpacity onPress={handler} style={[styles.button, { borderColor: theme }, bthStyle]}>
				{iconName && <Iconfont name={iconName} size={iconSize} color={theme} />}
				<Text style={{ fontSize, color: theme }}>{name}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		borderRadius: 4,
		borderWidth: 1
	}
});

export default Button;
