import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";

class VideoMark extends Component {
	render() {
		let { width = 46, size = 21 } = this.props;
		let fix = Math.floor(size / 4);
		return (
			<View style={[styles.videoMark, { width, height: width, borderRadius: width / 2 }]}>
				<Iconfont name="videoMark" size={size} color={"#fff"} style={{ marginLeft: fix }} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	videoMark: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden"
	}
});

export default VideoMark;
