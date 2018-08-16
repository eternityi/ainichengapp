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
		let { navigation, covers, uploadType, onPressPhotoUpload, onPressVideoUpload } = this.props;
		return (
			<View style={styles.body}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity onPress={onPressPhotoUpload} disabled={uploadType < 0 ? true : false}>
						<Iconfont
							name={"image"}
							size={22}
							color={uploadType < 0 ? "#999" : "#666"}
							style={{ paddingRight: 20 }}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={onPressVideoUpload} disabled={covers.length > 0 ? true : false}>
						<Iconfont
							name={"upload"}
							size={21}
							color={covers.length > 0 ? "#999" : "#666"}
							style={{ paddingRight: 20 }}
						/>
					</TouchableOpacity>
				</View>
				{/*	<Iconfont name={"add"} size={22} color={"#666"} />*/}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	body: {
		// position: "absolute",

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
