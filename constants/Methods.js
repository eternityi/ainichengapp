import { NavigationActions } from "react-navigation";

//navigation.dispatch(navigationAction)
function navigationAction({
	routeName,
	params = null,
	action = null,
	key = routeName + Math.random().toString()
}) {
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
	let routeName = type == "video" ? "视频详情" : "文章详情";
	let params = type == "video" ? { video: data } : { article: data };
	navigation.dispatch(navigationAction({ routeName, params }));
}

export { navigationAction, userOperationMiddleware, goContentScreen };
