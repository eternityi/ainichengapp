import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

// import { Client } from "bugsnag-react-native";
// const bugsnag = new Client();

// 测试bugsnag 汇报错误
// bugsnag.notify(new Error("Test error"));

AppRegistry.registerComponent(appName, () => App);
