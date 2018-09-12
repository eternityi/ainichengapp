import React, { Component } from "react";
import { StyleSheet, ScrollView, Image, View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import ImagePicker from "react-native-image-crop-picker";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Toast from "react-native-root-toast";

import Screen from "../Screen";
import { Iconfont } from "../../utils/Fonts";
import { Colors, Config } from "../../constants";
import { Button } from "../../components/Button";
import { ImageView } from "../../components/Modal";

import { createFeedbackMutation } from "../../graphql/user.graphql";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";

class FeedbackScreen extends Component {
	constructor(props) {
		super(props);
		this.selectImage = this.selectImage.bind(this);
		this.deleteImage = this.deleteImage.bind(this);
		this.img_path = "";
		this.feedbackImages = "";
		this.state = {
			selectImages: [],
			body: "",
			contact: "",
			imageViewVisible: false
		};
	}

	render() {
		let { selectImages, body, contact, imageViewVisible } = this.state;
		let { navigation } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<ScrollView style={styles.container}>
						<View style={[styles.formTitleWrap, { borderTopColor: "transparent" }]}>
							<Text style={styles.formTitle}>问题和意见</Text>
						</View>
						<View style={styles.inputWrap}>
							<TextInput
								selectionColor={Colors.themeColor}
								textAlignVertical="top"
								underlineColorAndroid="transparent"
								multiline={true}
								style={[styles.textInputStyle, { height: 92 }]}
								placeholder={"简要描述你要反馈的问题和意见"}
								placeholderTextColor={Colors.lightFontColor}
								onChangeText={body => this.setState({ body })}
								value={body + ""}
							/>
						</View>
						<View style={styles.formTitleWrap}>
							<Text style={styles.formTitle}>
								<Text>图片（选填，提供问题截图）</Text>
								<Text>
									{selectImages.length}
									/3
								</Text>
							</Text>
						</View>
						<ScrollView horizontal>
							<View style={styles.imagesWrap}>
								{selectImages &&
									selectImages.map((elem, index) => {
										return (
											<TouchableOpacity
												key={index}
												style={styles.imageWrap}
												onPress={() => {
													this.img_path = elem.path;
													this.toggleImageView();
												}}
											>
												<Image style={styles.image} source={{ uri: elem.path }} />
												<TouchableOpacity key={index} style={styles.chacha} onPress={() => this.deleteImage(index)}>
													<Iconfont name="chacha" size={15} color="#fff" />
												</TouchableOpacity>
											</TouchableOpacity>
										);
									})}
								{selectImages.length < 3 && (
									<TouchableOpacity onPress={this.selectImage} style={styles.addImage}>
										<Iconfont name={"add"} size={60} color={Colors.lightFontColor} />
									</TouchableOpacity>
								)}
							</View>
						</ScrollView>
						<View style={styles.formTitleWrap}>
							<Text style={styles.formTitle}>联系方式（选填）</Text>
						</View>
						<View style={styles.inputWrap}>
							<TextInput
								selectionColor={Colors.themeColor}
								textAlignVertical="center"
								underlineColorAndroid="transparent"
								style={[styles.textInputStyle, { height: 30 }]}
								placeholder={"微信/QQ/邮箱"}
								placeholderTextColor={Colors.lightFontColor}
								onChangeText={contact => this.setState({ contact })}
								value={contact + ""}
							/>
						</View>
						<Mutation mutation={createFeedbackMutation}>
							{createFeedback => {
								return (
									<View style={styles.buttonWrap}>
										<Button
											name="提交反馈"
											disabled={body.length < 3 ? true : false}
											handler={() => {
												if (selectImages.length > 0) {
													this.saveImage(selectImages);
												}
												createFeedback({
													variables: {
														content: body,
														contact,
														image_urls: this.feedbackImages
													},
													update: (cache, { data }) => {
														this.toast();
													}
												});
											}}
										/>
									</View>
								);
							}}
						</Mutation>
					</ScrollView>
					<ImageView
						visible={imageViewVisible}
						handleVisible={this.toggleImageView}
						imageUrls={[
							{
								url: this.img_path
							}
						]}
					/>
					{Platform.OS == "ios" && <KeyboardSpacer />}
				</View>
			</Screen>
		);
	}

	toggleImageView = () => {
		this.setState(prevState => ({
			imageViewVisible: !prevState.imageViewVisible
		}));
	};

	selectImage() {
		let { selectImages } = this.state;
		ImagePicker.openPicker({
			multiple: true,
			cropping: true
		})
			.then(images => {
				let { selectImages } = this.state;
				let count_images = selectImages.length;
				images.map(image => {
					selectImages.push({ path: image.path });
				});
				selectImages = selectImages.slice(0, 3);
				this.setState({
					selectImages
				});
			})
			.catch(error => {});
	}

	saveImage = images => {
		const { token } = this.props.user;
		var data = new FormData();
		images.map((elem, index) => {
			data.append("photo[]", {
				uri: elem.path,
				name: "image.jpg",
				type: "image/jpg"
			});
		});
		const config = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "multipart/form-data"
			},
			body: data
		};
		let uri = Config.ServerRoot + "/api/image?api_token=" + token;
		fetch(uri, config)
			.then(response => {
				console.log("response", response);
				response.text();
			})
			.then(photo => {
				console.log("photo", photo);
				this.feedbackImages = JSON.parse(photo);
			})
			.catch(err => {
				console.log(err);
			});
	};

	deleteImage(index) {
		this.setState(prevState => {
			prevState.selectImages.splice(index, 1);
			return {
				selectImages: prevState.selectImages
			};
		});
	}

	toast = () => {
		let toast = Toast.show("反馈成功，感谢您的建议", {
			duration: Toast.durations.LONG,
			position: 70,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 100,
			backgroundColor: Colors.nightColor
		});
		setTimeout(function() {
			Toast.hide(toast);
		}, 2000);
		this.props.navigation.goBack();
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	formTitleWrap: {
		padding: 15,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: Colors.lightBorderColor,
		backgroundColor: Colors.lightGray
	},
	formTitle: {
		fontSize: 13,
		color: Colors.tintFontColor,
		flexDirection: "row",
		justifyContent: "space-between"
	},
	inputWrap: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	textInputStyle: {
		fontSize: 17,
		color: Colors.primaryFontColor,
		lineHeight: 23,
		padding: 0
	},
	imagesWrap: {
		flexDirection: "row",
		paddingVertical: 6,
		paddingLeft: 15,
		paddingRight: 9
	},
	chacha: {
		position: "absolute",
		right: 4,
		top: 4,
		width: 18,
		height: 18,
		borderRadius: 8,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		justifyContent: "center",
		alignItems: "center"
	},
	addImage: {
		width: 100,
		height: 100,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: Colors.lightBorderColor,
		justifyContent: "center",
		alignItems: "center"
	},
	imageWrap: {
		borderRadius: 4,
		marginRight: 8
	},
	image: {
		width: 98,
		height: 98,
		resizeMode: "cover"
	},
	buttonWrap: {
		marginTop: 40,
		marginHorizontal: 15,
		height: 45
	}
});

export default connect(store => ({ user: store.users.user }))(FeedbackScreen);
