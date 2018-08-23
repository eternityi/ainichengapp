"use strict";

import React, { Component } from "react";
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity, Dimensions, FlatList } from "react-native";
import Video from "react-native-video";
import Spinner from "react-native-spinkit";

import VideoStatus from "./VideoStatus";
import VideoControl from "./VideoControl";
import { Colors, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

const { width, height } = Dimensions.get("window");

class Player extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTime: 0,
			duration: 0,
			paused: true,
			loading: true,
			over: false,
			error: false,
			fullscreen: false,
			controlVisible: false
		};
	}

	componentDidMount() {
		let { navigation } = this.props;
		this.willBlurSubscription = navigation.addListener("willBlur", payload => {
			this.setState({
				paused: true
			});
		});
	}

	componentWillUnmount() {
		this.bufferingInterval && clearTimeout(this.bufferingInterval);
		this.controlIntervel && clearTimeout(this.controlIntervel);
		this.willBlurSubscription.remove();
	}

	render() {
		let { paused, loading, over, error } = this.state;
		let { navigation, video } = this.props;
		return (
			<View style={styles.playerContainer}>
				<TouchableOpacity activeOpacity={1} onPress={this.controlSwitch} style={styles.videoWrap}>
					<Video
						source={{ uri: video.video_url }}
						poster={video.cover}
						posterResizeMode="cover"
						style={{
							width,
							height: (width * 9) / 16
						}}
						rate={1}
						muted={false}
						volume={1}
						paused={paused}
						resizeMode={"contain"}
						repeat={false} // 是否重复播放
						onBuffer={this._onBuffering}
						onLoadStart={this._onLoadStart} // 当视频开始加载时的回调函数
						onLoad={this._onLoaded} // 当视频加载完毕时的回调函数
						onProgress={this._onProgressChanged} //  进度控制，每250ms调用一次，以获取视频播放的进度
						onEnd={this._onPlayEnd} // 当视频播放完毕后的回调函数
						onError={this._onPlayError}
						ref={ref => (this.videoRef = ref)}
					/>
					<VideoControl
						{...this.state}
						playButtonHandler={this.playButtonHandler}
						onSliderValueChange={this.onSliderValueChange}
						onSlidingComplete={this.onSlidingComplete}
						onSwitchLayout={this.onSwitchLayout}
					/>
				</TouchableOpacity>
				<VideoStatus loading={loading} over={over} error={error} replay={this.onReplayVideo} />
			</View>
		);
	}

	/// 监听安卓物理返回键，横屏时点击返回键回到竖屏，再次点击回到上个界面
	// _backButtonPress = () => {
	// if (this.state.isFullScreen) {
	// 	Orientation.lockToPortrait();
	// } else {
	// 	this.props.navigation.goBack();
	// }
	// return true;
	// };

	/// 屏幕旋转时宽高发生变化
	// _onLayoutChange = event => {
	// 	let { x, y, width, height } = event.nativeEvent.layout;
	// 	console.log("x: " + x);
	// 	console.log("y: " + y);
	// 	console.log("width: " + width);
	// 	console.log("height: " + height);

	// 	let isLandscape = width > height;
	// 	if (isLandscape) {
	// 		this.setState({
	// 			x: topInset,
	// 			y: 0,
	// 			videoWidth: width - topInset - topInset,
	// 			videoHeight: height,
	// 			isFullScreen: true
	// 		});
	// 	} else {
	// 		this.setState({
	// 			x: 0,
	// 			y: topInset,
	// 			videoWidth: width,
	// 			videoHeight: videoHeight,
	// 			isFullScreen: false
	// 		});
	// 	}
	// 	Orientation.unlockAllOrientations();
	// };

	/// Video组件的方法

	//缓冲中
	// _onBuffering = () => {
	// 	this.bufferingInterval && clearInterval(this.bufferingInterval);
	// 	console.log("_onBuffering");
	// 	let { duration } = this.state;
	// 	duration = duration < 20 ? duration * 2000 : 20000;
	// 	this.setState({
	// 		loading: true
	// 	});
	// 	// 设置最长缓冲时间
	// 	this.bufferingInterval = setTimeout(() => {
	// 		if (this.state.loading) {
	// 			this.setState({
	// 				loading: false,
	// 				error: true
	// 			});
	// 		}
	// 	}, duration);
	// };
	// 视频开始加载
	_onLoadStart = () => {
		console.log("_onLoadStart");
	};
	// 视频加载完成
	_onLoaded = data => {
		this.bufferingInterval && clearInterval(this.bufferingInterval);
		console.log("_onLoaded");
		if (!Divice.isIos) {
			// 修复Android此次播放画面不动的问题
			this.videoRef.seek(0);
		}
		this.setState({
			duration: data.duration,
			paused: false
		});
	};
	// 视频播放进度
	_onProgressChanged = data => {
		this.bufferingInterval && clearInterval(this.bufferingInterval);
		console.log("_onProgressChanged");
		if (!this.state.paused) {
			this.setState({
				currentTime: data.currentTime
			});
			if (this.state.loading) {
				this.setState({
					loading: false
				});
			}
		}
	};
	// 视频播放结束
	_onPlayEnd = () => {
		console.log("_onPlayEnd");
		this.setState({
			loading: false,
			paused: true,
			over: true,
			controlVisible: false
		});
	};
	// 视频播放错误
	_onPlayError = () => {
		console.log("_onPlayError");
		this.setState({
			loading: false,
			error: true
		});
	};

	// 重播
	onReplayVideo = () => {
		this.videoRef.seek(0);
		this.setState(
			{
				currentTime: 0,
				over: false,
				error: false
			},
			() => {
				// 故意延迟，修复Android不播放的问题
				this.setState({
					paused: false
				});
			}
		);
	};

	// video control visible
	controlSwitch = () => {
		this.controlIntervel && clearInterval(this.controlIntervel);
		this.setState(
			prevState => ({ controlVisible: !prevState.controlVisible }),
			() => {
				if (this.state.controlVisible && !this.state.paused) {
					this.setControlInterval();
				}
			}
		);
	};

	/// 播放/暂停按钮
	playButtonHandler = () => {
		this.controlIntervel && clearInterval(this.controlIntervel);
		this.setState(
			prevState => ({
				paused: !prevState.paused
			}),
			() => {
				// 点击播放后videoControl也是三秒后消失
				if (!this.state.paused) {
					this.setControlInterval();
				}
			}
		);
	};

	// 进度控制
	onSliderValueChange = currentTime => {
		this.controlIntervel && clearInterval(this.controlIntervel);
		this.videoRef.seek(currentTime);
		this.setState(
			{
				currentTime,
				controlVisible: true
			},
			this.setControlInterval
		);
	};

	onSlidingComplete = currentTime => {
		this.videoRef.seek(currentTime);
	};

	/// 点击了工具栏上的全屏按钮
	onSwitchLayout = () => {
		if (this.state.fullScreen) {
			this.videoRef.presentFullscreenPlayer();
			// Orientation.lockToPortrait();
		} else {
			this.videoRef.presentFullscreenPlayer();
			// Orientation.lockToLandscapeRight();
		}
	};

	setControlInterval = () => {
		this.controlIntervel = setTimeout(() => {
			this.setState({ controlVisible: false });
		}, 3000);
	};
}

const styles = StyleSheet.create({
	playerContainer: {
		position: "relative",
		backgroundColor: "#212121"
	},
	videoWrap: {
		position: "relative"
	}
	// pausedStyle: {
	// 	position: "absolute",
	// 	top: "50%",
	// 	left: "50%",
	// 	width: 50,
	// 	height: 50,
	// 	opacity: 0.7,
	// 	marginLeft: -25,
	// 	marginTop: -25,
	// 	justifyContent: "center",
	// 	alignItems: "center"
	// }
});

export default Player;
