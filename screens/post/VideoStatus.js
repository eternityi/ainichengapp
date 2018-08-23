"use strict";
import React, { Component } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text, Platform } from "react-native";
import Spinner from "react-native-spinkit";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

class VideoStatus extends Component {
	render() {
		let { loading, over, error, replay } = this.props;
		if (!(loading || over || error)) {
			return null;
		}
		switch (true) {
			case error:
				return (
					<View style={styles.videoStatus}>
						<TouchableWithoutFeedback onPress={replay}>
							<View style={styles.status}>
								<Iconfont name="replay" size={40} color="#fff" />
								<Text style={styles.statusText}>好像迷路啦，请检查网络或者重试</Text>
							</View>
						</TouchableWithoutFeedback>
					</View>
				);
				break;
			case loading:
				return (
					<View style={styles.videoStatus}>
						<View style={styles.status}>
							<Spinner size={40} type="FadingCircleAlt" color="#fff" style={Platform.OS == "ios" && { marginBottom: 10 }} />
							<Text style={styles.statusText}>我在努力加载哦ヾ(◍°∇°◍)ﾉﾞ</Text>
						</View>
					</View>
				);
				break;
			case over:
				return (
					<View style={styles.videoStatus}>
						<TouchableWithoutFeedback onPress={replay}>
							<View style={styles.status}>
								<Iconfont name="replay" size={40} color="#fff" />
								<Text style={styles.statusText}>喜欢就请点个赞鼓励作者吧</Text>
							</View>
						</TouchableWithoutFeedback>
					</View>
				);
				break;
		}
	}
}

const styles = StyleSheet.create({
	videoStatus: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center"
	},
	status: {
		marginTop: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	statusText: {
		marginTop: 10,
		fontSize: 12,
		color: "#fff"
	}
});

export default VideoStatus;
