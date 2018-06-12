import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Spinner from "react-native-spinkit";

import Colors from "../../constants/Colors";

class Waiting extends Component {
	render() {
		let { size = 50, color = Colors.themeColor, type = "WanderingCubes", isVisible = true } = this.props;
		return (
			<View style={styles.container}>
				<Spinner isVisible={isVisible} size={size} type={type} color={color} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 0,
		left: 0,
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(255,255,255, 0.5)"
	}
});

export default Waiting;
