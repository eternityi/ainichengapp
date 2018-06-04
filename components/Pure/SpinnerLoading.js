import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Spinner from "react-native-spinkit";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

class SpinnerLoading extends Component {
	render() {
		let { size = 50, color = Colors.themeColor, type = "ThreeBounce", isVisible = true } = this.props;
		return (
			<View style={styles.container}>
				<Spinner isVisible={isVisible} size={size} type={type} color={color} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
});

export default SpinnerLoading;
