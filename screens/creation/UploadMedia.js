import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import MediaModal from "../../components/Modal/MediaModal";

class UploadMedia extends Component {
	render() {
		let {
			navigation,
			image_urls,
			showMediaSelect,
			progress,
			cancelUploa,
			onPressPhotoUpload,
			onPressVideoUpload,
			selectMedia,
			cancelUpload,
			completed,
			uploadId
		} = this.props;
		return (
			<ScrollView>
				<View style={styles.inputText}>
					<TextInput
						ref="textInput"
						style={styles.input}
						placeholder="这一刻的想法"
						underlineColorAndroid="transparent"
						selectionColor="#000"
						multiline={true}
						textAlignVertical={"top"}
						onChangeText={body => {
							this.setState({
								body
							});
						}}
					/>
				</View>
				<View style={styles.add}>
					<View
						style={{
							flexWrap: "wrap",
							alignItems: "flex-start",
							flexDirection: "row",
							borderColor: Colors.lightGray
						}}
					>
						{image_urls.map((image_url, index) => <Image key={index} style={styles.picture} source={{ uri: image_url }} />)}
						<TouchableOpacity onPress={showMediaSelect}>
							<View style={image_urls == "" ? styles.icon : styles.icon2}>
								<Iconfont name={"add"} size={100} color={Colors.lightGray} />
							</View>
							<MediaModal
								visible={selectMedia}
								handleVisible={showMediaSelect}
								navigation={navigation}
								onPressPhotoUpload={onPressPhotoUpload}
								onPressVideoUpload={onPressVideoUpload}
							/>
						</TouchableOpacity>
					</View>
					{uploadId == null ? null : !completed ? (
						<View style={{ flexDirection: "row" }}>
							<Text style={{ textAlign: "center" }}>上传进度:{progress}%</Text>
							<TouchableOpacity onPress={cancelUpload}>
								<Text style={{ color: Colors.themeColor, marginLeft: 5 }}>取消上传</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View style={{ flexDirection: "row" }}>
							<Text style={{ color: Colors.themeColor }}>上传完成 !</Text>
						</View>
					)}
				</View>
				<TouchableOpacity>
					<View style={styles.item}>
						<Iconfont name={"person-outline"} size={22} style={{ paddingRight: 15 }} color={"#000000"} />
						<Text style={{ color: "#000", fontSize: 15 }}>谁可以看</Text>
						<Text style={{ position: "absolute", right: 15 }}>公开</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate("文章投稿")}>
					<View style={styles.item}>
						<Iconfont name={"aite"} size={22} style={{ paddingRight: 15 }} color={"#000000"} />
						<Text style={{ color: "#000", fontSize: 15 }}>提醒谁看</Text>
					</View>
				</TouchableOpacity>
			</ScrollView>
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
		paddingTop: 3,
		height: 100,
		justifyContent: "flex-start"
		// marginTop:10,
	},

	add: {
		flexDirection: "column",
		justifyContent: "center",
		marginHorizontal: 18,
		backgroundColor: Colors.skinColor,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightGray
	},
	icon: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
		height: 100,
		width: 100,
		marginBottom: 120,
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
		marginBottom: 70,
		marginLeft: 3,
		borderWidth: 1,
		borderColor: Colors.lightGray
	},
	picture: {
		borderWidth: 0.5,
		height: 100,
		width: 100,
		marginHorizontal: 4,
		marginTop: 8
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 20,
		paddingVertical: 20,
		backgroundColor: Colors.skinColor,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightGray
	}
});

export default UploadMedia;
