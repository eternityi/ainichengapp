"use strict";

import React, { Component } from "react";

import { View, Modal } from "react-native";

import ImageViewer from "react-native-image-zoom-viewer";

class ImageView extends Component {
	render() {
		const { visible, handleVisible = () => null, imageUrls, onSwipeDown = handleVisible, onClick = handleVisible, initImage = 0 } = this.props;
		return (
			<View>
				<Modal visible={visible} transparent={true} onRequestClose={handleVisible}>
					<ImageViewer onClick={onClick} onSwipeDown={onSwipeDown} imageUrls={imageUrls} index={initImage} enableSwipeDown />
				</Modal>
			</View>
		);
	}
}

export default ImageView;
