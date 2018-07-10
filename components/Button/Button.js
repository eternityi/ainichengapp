import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";

class Button extends Component {
	render() {
		let { bthStyle = {}, outline, theme = Colors.themeColor, name, fontSize = 14, icon, iconName, iconSize = fontSize, handler } = this.props;
		let mergeButton = StyleSheet.flatten([styles.button, { borderColor: theme }, !outline && { backgroundColor: theme }, bthStyle]);
		return (
			<TouchableOpacity onPress={handler} style={mergeButton}>
				{icon ? icon : iconName && <Iconfont name={iconName} size={iconSize} color={outline ? theme : "#fff"} />}
				<Text style={[{ fontSize, color: theme }, !outline && { color: "#fff" }]}>{name}</Text>
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
