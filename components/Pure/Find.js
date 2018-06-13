import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { withNavigation } from "react-navigation";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import { connect } from "react-redux";

class Find extends Component {
	render() {
		let { navigation, size = 70, fontSize = 16, customStyle = {}, remind = "更多有趣的作者和专题 ~", children, user } = this.props;
		return (
			<View style={styles.container}>
				<Iconfont name={"find"} size={size} color={Colors.lightFontColor} />
				<Text style={{ fontSize, color: Colors.tintFontColor, marginTop: 20 }}>
					去发现
					<Text
						style={{ color: Colors.linkColor }}
						onPress={() => {
							if (user.token) {
								navigation.navigate("推荐关注");
							} else {
								navigation.navigate("登录注册");
							}
						}}
					>
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

export default connect(store => ({ user: store.users.user }))(withNavigation(Find));
