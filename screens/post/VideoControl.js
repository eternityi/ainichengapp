"use strict";

import React, { Component } from "react";
import { StyleSheet, View, Slider, TouchableOpacity, Text, Dimensions } from "react-native";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const defaultVideoHeight = (screenWidth * 9) / 16;

class VideoControl extends Component {
	render() {
		let {
			controlVisible,
			currentTime,
			duration,
			paused,
			fullscreen,
			onSliderValueChange,
			onSlidingComplete,
			playButtonHandler,
			onSwitchLayout
		} = this.props;
		if (!controlVisible) {
			return null;
		}
		return (
			<View style={styles.videoControl}>
				{fullscreen && (
					<TouchableOpacity activeOpacity={1} onPress={onSwitchLayout} style={styles.headerControl}>
						<Iconfont name="video" size={22} color="#fff" />
					</TouchableOpacity>
				)}
				<View style={styles.centerControl}>
					<TouchableOpacity activeOpacity={1} style={styles.pauseMark} onPress={playButtonHandler}>
						<Iconfont name={paused ? "play" : "paused"} size={40} color="#fff" />
					</TouchableOpacity>
				</View>
				<View style={styles.bottomControl}>
					<Text style={styles.timeText}>{formatTime(currentTime)}</Text>
					<Slider
						style={{ flex: 1, marginHorizontal: 10 }}
						maximumTrackTintColor="rgba(225,225,225,0.5)" //滑块右侧轨道的颜色
						minimumTrackTintColor={Colors.themeColor} //滑块左侧轨道的颜色
						thumbTintColor="#fff"
						value={currentTime}
						minimumValue={0}
						maximumValue={Number(duration)}
						onValueChange={onSliderValueChange}
						onSlidingComplete={onSlidingComplete}
					/>
					<Text style={styles.timeText}>{formatTime(duration)}</Text>
					<TouchableOpacity onPress={onSwitchLayout} style={styles.layoutButton}>
						<Iconfont name={fullscreen ? "fullscreen" : "exitFullscreen"} size={20} color="#fff" />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

function formatTime(second) {
	let h = 0,
		i = 0,
		s = parseInt(second);
	if (s > 60) {
		i = parseInt(s / 60);
		s = parseInt(s % 60);
	}
	// 补零
	let zero = function(v) {
		return v >> 0 < 10 ? "0" + v : v;
	};
	return [zero(h), zero(i), zero(s)].join(":");
}

const styles = StyleSheet.create({
	videoControl: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "transparent",
		justifyContent: "space-between"
	},
	headerControl: {
		position: "absolute",
		top: 20,
		left: 20,
		width: 30,
		height: 30,
		flexDirection: "row",
		alignItems: "center"
	},
	centerControl: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center"
	},
	pauseMark: {
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center"
	},
	bottomControl: {
		position: "absolute",
		left: 20,
		right: 20,
		bottom: 10,
		flexDirection: "row",
		alignItems: "center"
	},
	layoutButton: {
		marginLeft: 20,
		width: 30,
		height: 30,
		alignItems: "center",
		justifyContent: "center"
	},
	timeText: {
		fontSize: 12,
		color: "#fff"
	}
});

export default VideoControl;
