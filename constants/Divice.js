import { Dimensions, Platform, StatusBar, PixelRatio } from "react-native";

const isIos = Platform.OS == "ios";
let { width, height } = Dimensions.get("window");
let STATUSBAR_HEIGHT = isIos ? 20 : StatusBar.currentHeight;

//适配iPhone X
if (isIos && ((width === 375 && height === 812) || (height === 375 && width === 812))) {
	STATUSBAR_HEIGHT = 35;
}

const wp = widthPercent => {
	const elemWidth = parseFloat(widthPercent);
	return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
};

const hp = heightPercent => {
	const elemHeight = parseFloat(heightPercent);

	return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
};

const listenOrientationChange = () => {
	Dimensions.addEventListener("change", newDimensions => {
		width = newDimensions.window.width;
		height = newDimensions.window.height;

		this.setState({
			orientation: width < height ? "portrait" : "landscape"
		});
	});
};

const removeOrientationListener = () => {
	Dimensions.removeEventListener("change", () => {});
};

export default {
	isIos,
	width,
	height,
	STATUSBAR_HEIGHT,
	HEADER_HEIGHT: 40 + STATUSBAR_HEIGHT,
	BOTTOM_BAR_HEIGHT: 50,
	wp,
	hp,
	listenOrientationChange,
	removeOrientationListener
};
