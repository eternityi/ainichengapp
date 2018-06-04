import React, { Component } from "react";
import BasicModal from "./BasicModal";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

class AddCommentModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			body: ""
		};
	}

	render() {
		const { visible, toggleCommentModal } = this.props;
		return (
			<BasicModal
				visible={visible}
				handleVisible={toggleCommentModal}
				customStyle={{
					width,
					position: "absolute",
					bottom: 0,
					left: 0,
					borderRadius: 0
				}}
			>
				<View>
					<TextInput
						textAlignVertical="top"
						underlineColorAndroid="transparent"
						multiline={true}
						autoFocus
						style={styles.textInput}
						onChangeText={body => this.setState({ body })}
						// onFocus={this._inputFocus.bind(this)}
						value={this.state.body + ""}
					/>
					<View style={styles.textBottom}>
						<View style={styles.textBottom}>
							<TouchableOpacity onPress={() => null}>
								<Iconfont name="aite" size={22} color={Colors.lightFontColor} style={{ marginHorizontal: 10 }} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => null}>
								<Iconfont name="smile" size={22} color={Colors.lightFontColor} style={{ marginHorizontal: 10 }} />
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							onPress={() => {
								toggleCommentModal();
								this.props.addComment({
									body: this.state.body
								});
								this.setState({
									body: ""
								});
							}}
							style={styles.publishComment}
						>
							<Text
								style={{
									fontSize: 14,
									color: Colors.weixinColor,
									textAlign: "center"
								}}
							>
								发表评论
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</BasicModal>
		);
	}
}

const styles = StyleSheet.create({
	textInput: {
		height: 80,
		padding: 10,
		marginBottom: 15,
		borderWidth: 1,
		borderColor: Colors.tintBorderColor,
		borderRadius: 3
	},
	textBottom: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between"
	},
	publishComment: {
		width: 80,
		height: 30,
		borderWidth: 1,
		borderColor: Colors.weixinColor,
		borderRadius: 3,
		justifyContent: "center"
	}
});

export default AddCommentModal;
