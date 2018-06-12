import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

class Find extends Component {
	render() {
		let { navigation, size = 70, fontSize = 16, customStyle = {}, remind = "更多有趣的作者和专题 ~", children } = this.props;
		return (
			<View style={styles.container}>
				<Iconfont name={"find"} size={size} color={Colors.lightFontColor} />
				<Text style={{ fontSize, color: Colors.tintFontColor, marginTop: 20 }}>
					去发现
					<Text style={{ color: Colors.linkColor }} onPress={() => navigation.navigate("推荐关注")}>
						{remind}
					</Text>
				</Text>
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

export default Find;
