import { Dimensions, Platform, StatusBar } from "react-native";

const isIos = Platform.OS == "ios";
let { width, height } = Dimensions.get("window");
let STATUSBAR_HEIGHT = isIos ? 20 : StatusBar.currentHeight;

//适配iPhone X
if (isIos && ((width === 375 && height === 812) || (height === 375 && width === 812))) {
	STATUSBAR_HEIGHT = 35;
}

export default {
	isIos,
	width,
	height,
	STATUSBAR_HEIGHT,
	HEADER_HEIGHT: 40 + STATUSBAR_HEIGHT,
	BOTTOM_BAR_HEIGHT: 50
};
