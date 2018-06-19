import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Animated, Easing } from "react-native";

import Color from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

class RefreshControl extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rotateValue: new Animated.Value(0)
		};
	}

	render() {
		let { refreshing, refresh, size = 14, color = Color.tintFontColor } = this.props;
		return (
			<TouchableOpacity
				style={{ flexDirection: "row", alignItems: "center" }}
				onPress={() => {
					if (!refreshing) {
						refresh();
						this.refreshAnimation();
					}
				}}
			>
				<Animated.View
					style={{
						transform: [
							{
								rotate: this.state.rotateValue.interpolate({
									inputRange: [0, 1],
									outputRange: ["0deg", "720deg"]
								})
							}
						]
					}}
				>
					<Iconfont name={"fresh"} size={size} color={color} />
				</Animated.View>
				<Text style={{ fontSize: size - 2, color, marginLeft: size / 3 }}>换一批</Text>
			</TouchableOpacity>
		);
	}

	refreshAnimation = () => {
		let { refreshing } = this.props;
		let { rotateValue } = this.state;
		rotateValue.setValue(0);
		Animated.timing(rotateValue, {
			toValue: 1,
			duration: 1000,
			easing: Easing.linear
		}).start(() => {
			if (refreshing) {
				this.refreshAnimation();
			} else {
				return null;
			}
		});
	};
}

const styles = StyleSheet.create({});

export default RefreshControl;
