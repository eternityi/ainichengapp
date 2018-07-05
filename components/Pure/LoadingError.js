import React, { Component } from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";

import Colors from "../../constants/Colors";
import HollowButton from "../Button/Hollow";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width * 0.6;

class LoadingError extends Component {
	render() {
		let { size = 70, fontSize = 16, reload = () => null, children } = this.props;
		return (
			<View style={styles.container}>
				<Image style={styles.image} source={require("../../assets/images/404.png")} />
				{children ? children : <Text style={{ fontSize, color: Colors.tintFontColor, marginVertical: 12 }}>哎呀，好像出了点问题( ´◔ ‸◔`)</Text>}
				<View style={styles.reload}>
					<HollowButton size={16} onPress={reload} name="重新加载" color={Colors.themeColor} />
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 20
	},
	image: {
		width: IMAGE_WIDTH,
		height: IMAGE_WIDTH / 2,
		resizeMode: "contain"
	},
	reload: {
		width: 80,
		height: 38
	}
});

export default LoadingError;
