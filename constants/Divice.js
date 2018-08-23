import { Dimensions, Platform } from "react-native";

const isIos = Platform.OS == "ios";
const { width, height } = Dimensions.get("window");

export default {
	isSmallDevice: width < 375,
	isIos,
	width,
	height
};
