import React, { Component } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Image,
	ScrollView,
	TextInput,
	Platform,
	Dimensions
} from "react-native";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

class CreatePostBottom extends Component {
	render() {
		let {
			navigation,
			covers,
			uploadType,
			onPressPhotoUpload,
			onPressVideoUpload,
			selectCategories,
			selectCategory,
			publishing,
			publish,
			body
		} = this.props;
		return (
			<View style={styles.body}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity onPress={onPressVideoUpload} disabled={covers.length > 0 ? true : false}>
						<Iconfont
							name={"video-up"}
							size={26}
							color={covers.length > 0 ? "#999" : "#666"}
							style={{ paddingRight: 30 }}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={onPressPhotoUpload} disabled={uploadType < 0 ? true : false}>
						<Iconfont
							name={"picture"}
							size={22}
							color={uploadType < 0 ? "#999" : "#666"}
							style={{ paddingRight: 30 }}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate("选择专题", { callback: selectCategory, selectCategories })}
					>
						<Iconfont name={"category4"} size={25} color={"#666"} style={{ paddingRight: 30 }} />
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					onPress={!publishing ? publish : null}
					style={{ backgroundColor: !body ? "#999" : Colors.themeColor, borderRadius: 30 }}
					disabled={!body ? true : false}
				>
					<Text style={{ paddingVertical: 7, paddingHorizontal: 20, color: Colors.skinColor }}>发表</Text>
				</TouchableOpacity>
				{/*	<Iconfont name={"add"} size={22} color={"#666"} />*/}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	body: {
		bottom: 0,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: width,
		backgroundColor: Colors.skinColor,
		padding: 15
	}
});

export default CreatePostBottom;
