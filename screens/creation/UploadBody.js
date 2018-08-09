import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput, Platform } from "react-native";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";

import DialogSelected from "../../components/Pure/AlertSelected";

import * as Progress from "react-native-progress";
const selectedArr = ["图片", "视频"];

class UploadBody extends Component {
	render() {
		let { navigation, covers, progress, completed, uploadId, uploadType, changeBody, selectCategories, selectCategory } = this.props;
		return (
			<View style={{ backgroundColor: Colors.darkGray, flex: 1 }}>
				<TouchableOpacity onPress={() => navigation.navigate("选择专题", { callback: selectCategory, selectCategories })}>
					<View style={styles.item}>
						<Text style={{ color: "#000", fontSize: 14 }}>发布到</Text>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center"
							}}
						>
							<Text style={{ color: Colors.darkGray, fontSize: 14 }}>
								{selectCategories.length > 0 ? selectCategories[0].name : "请选择投稿的专题"}{" "}
							</Text>
							<Iconfont name={"right"} size={14} color={Colors.darkGray} />
						</View>
					</View>
				</TouchableOpacity>
				<View style={styles.inputText}>
					<TextInput
						ref="textInput"
						style={styles.input}
						placeholder="内容"
						underlineColorAndroid="transparent"
						selectionColor="#000"
						multiline={true}
						textAlignVertical={"top"}
						onChangeText={changeBody}
					/>
				</View>
				<View style={styles.uploadPreview}>
					<View
						style={{
							flexWrap: "wrap",
							alignItems: "flex-start",
							flexDirection: "row",
							borderColor: Colors.lightGray
						}}
					>
						{covers.map((cover, index) => <Image key={index} style={styles.picture} source={{ uri: cover }} />)}
						{
							//TODO: 视频在ios渲染预览有问题，参照https://facebook.github.io/react-native/docs/images.html#static-non-image-resources
							//用require 方式，或者用react-native-video 来渲染video
						}
						{/*<TouchableOpacity onPress={covers.length > 0 ? onPressPhotoUpload : showAlertSelected}>
							{uploadType < 0 ? null : (
								<View style={covers == "" ? styles.icon : styles.icon2}>
									<Iconfont name={"add"} size={100} color={Colors.lightGray} />
								</View>
							)}
						</TouchableOpacity>*/}
						{uploadType < 0 ? (
							<Progress.Circle
								style={uploadId == null || completed ? styles.complete : styles.nocomplete}
								size={100}
								progress={progress / 100}
								indeterminate={false}
								color={Colors.lightGray}
								showsText={true}
							/>
						) : null}
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						{selectCategories.map((elem, index) => (
							<View
								style={{
									flexDirection: "row",
									borderColor: Colors.themeColor,
									borderWidth: 1,
									borderRadius: 30,
									paddingVertical: 5,
									paddingHorizontal: 10,
									marginRight: 10
								}}
								key={index}
							>
								<Text style={{ fontSize: 13, color: Colors.themeColor }}>{elem.name}</Text>
								<TouchableOpacity
									onPress={() => {
										selectCategories = selectCategories.filter((query, index) => {
											return query.id !== elem.id;
										});
										selectCategory(selectCategories);
									}}
								>
									<Iconfont name={"chacha"} size={14} color={Colors.themeColor} style={{ marginLeft: 5 }} />
								</TouchableOpacity>
							</View>
						))}
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	inputText: {
		backgroundColor: Colors.skinColor
		// marginTop:10,
	},
	input: {
		backgroundColor: "transparent",
		fontSize: 16,
		padding: 0,
		paddingLeft: 20,
		paddingTop: 10,
		height: 180,
		justifyContent: "flex-start"
		// marginTop:10,
	},

	uploadPreview: {
		flexDirection: "column",
		justifyContent: "center",
		paddingHorizontal: 18,
		backgroundColor: Colors.skinColor,
		paddingBottom: 10
	},
	icon: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
		height: 100,
		width: 100,
		borderWidth: 1,
		borderColor: Colors.lightGray
	},
	icon2: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
		height: 100,
		width: 100,
		marginLeft: 3,
		borderWidth: 1,
		borderColor: Colors.lightGray
	},
	picture: {
		height: 100,
		width: 100,
		marginHorizontal: 4,
		marginTop: 8
	},
	nocomplete: {
		position: "absolute",
		backgroundColor: "rgba(255,255,255,0.5)",
		marginTop: 8,
		marginLeft: 4
	},
	complete: {
		display: "none"
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: 10,
		paddingHorizontal: 20,
		paddingVertical: 15,
		backgroundColor: Colors.skinColor
	}
});

export default UploadBody;
