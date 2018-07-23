import React, { Component } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import { navigationAction } from "../../constants/Methods";

class SlideWrite extends Component {
	render() {
		let { style = {}, size = 30, color = "#fff", navigation } = this.props;
		return (
			<TouchableWithoutFeedback
				onPress={() =>
					navigation.dispatch(
						navigationAction({ routeName: "发布动态" })
					)}
			>
				<View style={[styles.write, style]} elevation={5}>
					<Iconfont name="write" size={25} color={color} />
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	write: {
		backgroundColor: "rgba(0, 0, 0, 0.85)",
		justifyContent: "center",
		alignItems: "center",
		width: 46,
		height: 46,
		borderRadius: 23
	}
});

export default SlideWrite;
