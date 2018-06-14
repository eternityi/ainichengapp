import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

import HollowButton from "../Button/Hollow";

class LoadingError extends Component {
	render() {
		let { size = 70, fontSize = 16, reload = () => null, children } = this.props;
		return (
			<View style={styles.container}>
				{children ? children : <Text style={{ fontSize, color: Colors.tintFontColor, marginBottom: 12 }}>哎呀，好像出了点问题( ´◔ ‸◔`)</Text>}
				<Iconfont name={"balloon"} size={size} color={Colors.lightFontColor} />
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
	reload: {
		width: 80,
		height: 38,
		marginTop: 12
	}
});

export default LoadingError;
