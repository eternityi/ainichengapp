import { StyleSheet, Dimensions, Platform } from "react-native";
import { NavigationActions } from "react-navigation";

const divece = Dimensions.get("window");

//navigation.dispatch(navigationAction)
function navigationAction({ routeName, params = null, action = null, key = routeName + Math.random().toString() }) {
	return NavigationActions.navigate({
		routeName,
		params,
		action,
		key
	});
}

//需要登录验证的操作
function userOperationMiddleware({ login, action, navigation }) {
	if (login) {
		action();
	} else {
		navigation.dispatch(navigationAction({ routeName: "登录注册" }));
	}
}

//查看内容详情页
function goContentScreen(navigation, data) {
	let { type } = data;
	let routeName = type == "video" ? "视频详情" : type == "post" ? "动态详情" : "文章详情";
	let params = type == "video" ? { video: data } : { article: data };
	navigation.dispatch(navigationAction({ routeName, params }));
}

// response images
function imageSize({ width, height }, maxWidth) {
	var scale;
	var size = {};
	// if(Platform.OS=="ios"){
	// 	switch (device.width) {
	// 		//iPhone4/4S and iPhone5/5S
	// 	  		case 320:
	// 			scale = 0.77;
	// 			break;
	// 		//iPhone6/6S
	// 	  		case 375:
	// 			scale = 0.902;
	// 			break;
	// 		//iPhone6plus/6Splus
	// 	  		case 414:
	// 			scale = 1;
	// 			break;
	// 		//iPad
	// 		default:
	// 			scale = 1;
	// 	}
	// }else {
	// 	if (device.width <= 414) {
	// 		//Android smartphones
	// 		scale = device.width / 414;
	// 	} else{
	// 		//Android tablets
	// 		scale = 1;
	// 	}
	// }
	if (width > maxWidth) {
		size.width = maxWidth;
		size.height = Math.round((maxWidth * height) / width);
	}
	return size;
}

export { navigationAction, userOperationMiddleware, goContentScreen, imageSize };
