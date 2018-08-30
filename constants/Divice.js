import { Dimensions, Platform, StatusBar } from "react-native";

const isIos = Platform.OS == "ios";
const { width, height } = Dimensions.get("window");
const STATUSBAR_HEIGHT = isIos ? 20 : StatusBar.currentHeight;

export default {
	isSmallDevice: width < 375,
	isIos,
	width,
	height,
	HEADER_HEIGHT: 65,
	BOTTOM_BAR_HEIGHT: 50,
	STATUSBAR_HEIGHT
};
