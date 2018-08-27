import React, { Component } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, BackHandler } from "react-native";
import Video from "react-native-video";
import Orientation from "react-native-orientation";

import VideoStatus from "./VideoStatus";
import VideoControl from "./VideoControl";
import { Colors, Divice } from "../../constants";
import { Iconfont } from "../../utils/Fonts";

class VideoPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: "loading", //视频播放状态
			controlVisible: false, //控制器
			paused: true, //视频是否暂停
			currentTime: 0, //视频当前时间
			duration: 0 //视频时长
		};
	}

	// 监听安卓物理返回键，横屏时点击回到竖屏，再次点击返回
	componentDidMount() {
		let { navigation } = this.props;
		if (!Divice.isIos) {
			this.didFocusSubscription = navigation.addListener("didFocus", payload => {
				BackHandler.addEventListener("hardwareBackPress", this._backButtonPress);
			});
			this.willBlurSubscription = navigation.addListener("willBlur", payload => {
				BackHandler.removeEventListener("hardwareBackPress", this._backButtonPress);
				//fix 退出页面视频还在播放的bug
				this.playButtonHandler();
			});
		} else {
			this.willBlurSubscription = navigation.addListener("willBlur", payload => {
				//fix 退出页面视频还在播放的bug
				this.playButtonHandler();
			});
		}
	}

	componentWillUnmount() {
		this.controlIntervel && clearTimeout(this.controlIntervel);
		if (!Divice.isIos) {
			this.didFocusSubscription.remove();
			this.willBlurSubscription.remove();
		} else {
			this.willBlurSubscription.remove();
		}
	}

	render() {
		let { video, isFullScreen, videoWidth, videoHeight } = this.props;
		let { paused, status } = this.state;
		return (
			<View style={styles.playerContainer}>
				<Video
					style={{ width: videoWidth, height: videoHeight }}
					ref={ref => (this.videoRef = ref)}
					source={{ uri: video.video_url }}
					rate={1.0}
					volume={1.0}
					muted={false}
					paused={paused}
					resizeMode={"contain"}
					playWhenInactive={false}
					playInBackground={false}
					onLoadStart={this._onLoadStart}
					onLoad={this._onLoaded}
					onProgress={this._onProgressChanged}
					onEnd={this._onPlayEnd}
					onError={this._onPlayError}
					onBuffer={this._onBuffering}
				/>
				<TouchableOpacity activeOpacity={1} onPress={this.controlSwitch} style={styles.controlContainer}>
					<VideoControl
						{...this.state}
						isFullScreen={isFullScreen}
						playButtonHandler={this.playButtonHandler}
						onSliderValueChanged={this.onSliderValueChanged}
						onSwitchLayout={this.onSwitchLayout}
					/>
				</TouchableOpacity>
				<VideoStatus isFullScreen={isFullScreen} status={status} replay={this.onReplayVideo} />
			</View>
		);
	}

	_onLoadStart = () => {
		console.log("_onLoadStart");
	};

	_onBuffering = () => {
		console.log("_onBuffering");
	};

	_onLoaded = data => {
		console.log("_onProgressChanged");
		this.setState({
			duration: data.duration,
			paused: false,
			status: null
		});
	};

	_onProgressChanged = data => {
		console.log("_onProgressChanged");
		if (!this.state.paused) {
			this.setState({
				currentTime: data.currentTime
			});
		}
	};

	_onPlayEnd = () => {
		console.log("_onPlayEnd");
		this.setState({
			paused: true,
			status: "end",
			controlVisible: false
		});
	};

	_onPlayError = () => {
		console.log("_onPlayError");
		this.setState({
			status: "error"
		});
	};

	// 重播
	onReplayVideo = () => {
		this.videoRef.seek(0);
		setTimeout(() => {
			this.setState({
				currentTime: 0,
				status: null,
				paused: false
			});
		}, 0);
	};

	// video control visible
	controlSwitch = () => {
		this.setState(
			prevState => ({ controlVisible: !prevState.controlVisible }),
			() => {
				if (this.state.controlVisible && !this.state.paused) {
					this.setControlInterval();
				}
			}
		);
	};

	// 播放/暂停
	playButtonHandler = () => {
		this.setState(
			prevState => ({
				paused: !prevState.paused
			}),
			() => {
				// 点击播放后videoControl也5秒后消失
				if (!this.state.paused) {
					this.setControlInterval();
				}
			}
		);
	};

	//全屏按钮
	onSwitchLayout = () => {
		Orientation.unlockAllOrientations();
		if (this.props.isFullScreen) {
			Orientation.lockToPortrait();
		} else {
			Orientation.lockToLandscape();
		}
	};

	// 进度条值改变
	onSliderValueChanged = currentTime => {
		this.videoRef.seek(currentTime);
		this.setState(
			{
				currentTime,
				controlVisible: true
			},
			this.setControlInterval
		);
	};

	// 进度条定时器
	setControlInterval = () => {
		this.controlIntervel && clearInterval(this.controlIntervel);
		this.controlIntervel = setTimeout(() => {
			this.setState({ controlVisible: false });
		}, 5000);
	};

	_backButtonPress = () => {
		if (this.props.isFullScreen) {
			Orientation.lockToPortrait();
		} else {
			this.props.navigation.goBack();
		}
		return true;
	};

	//外部调用
	//播放
	play = () => {
		this.setState({
			paused: true,
			showVideoCover: false
		});
	};

	//暂停
	pause = () => {
		this.setState({
			paused: false
		});
	};
}

const styles = StyleSheet.create({
	playerContainer: {
		position: "relative",
		backgroundColor: "#000"
	},
	controlContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	}
});

export default VideoPlayer;
