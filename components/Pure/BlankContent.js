import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

class BlankContent extends Component {
	render() {
		let { size = 70, fontSize = 16, customStyle = {}, remind = "这里还木有内容哦 ~", children } = this.props;
		return (
			<View style={styles.container}>
				<Iconfont name={"blank"} size={size} color={Colors.lightFontColor} />
				{children ? children : <Text style={{ fontSize, color: Colors.tintFontColor, marginTop: 12 }}>{remind}</Text>}
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
	}
});

export default BlankContent;
