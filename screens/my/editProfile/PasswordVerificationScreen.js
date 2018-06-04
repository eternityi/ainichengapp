import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";

import Colors from "../../../constants/Colors";
import Header from "../../../components/Header/Header";
import SettingItem from "../../../components/Setting/SettingItem";
import PrettyButton from "../../../components/Button/PrettyButton";
import Screen from "../../Screen";

// import { commentsQuery, addCommentMutation } from "../../../graphql/comment.graphql";
import { Query, Mutation } from "react-apollo";

class PasswordVerificationScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);

		this.state = {
			oldPassword: "",
			newPassword: "",
			retypePassword: "",
			disabled: true
		};
	}

	render() {
		let { oldPassword, newPassword, retypePassword, disabled } = this.state;
		let { navigation } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header navigation={navigation} />
					<View style={{ height: 10, backgroundColor: Colors.lightGray }} />
					<View style={styles.textWrap}>
						<TextInput
							textAlignVertical="center"
							underlineColorAndroid="transparent"
							placeholder="请输入当前密码"
							placeholderText={Colors.tintFontColor}
							selectionColor={Colors.themeColor}
							style={styles.textInput}
							onChangeText={oldPassword => this.setState({ oldPassword })}
							value={oldPassword + ""}
							secureTextEntry={true}
						/>
					</View>
					<View style={styles.textWrap}>
						<TextInput
							textAlignVertical="center"
							underlineColorAndroid="transparent"
							placeholder="请输入新密码"
							placeholderText={Colors.tintFontColor}
							selectionColor={Colors.themeColor}
							style={styles.textInput}
							onChangeText={newPassword => this.setState({ newPassword })}
							value={newPassword + ""}
							secureTextEntry={true}
						/>
					</View>
					<View style={styles.textWrap}>
						<TextInput
							textAlignVertical="center"
							underlineColorAndroid="transparent"
							placeholder="请再次输入新密码"
							placeholderText={Colors.tintFontColor}
							selectionColor={Colors.themeColor}
							style={styles.textInput}
							onChangeText={retypePassword => this.setState({ retypePassword })}
							value={retypePassword + ""}
							secureTextEntry={true}
						/>
					</View>
					<View style={{ margin: 15 }}>
						<PrettyButton
							name="完成"
							disabled={oldPassword && newPassword && retypePassword ? false : true}
							buttonStyle={{ backgroundColor: Colors.themeColor, height: 48 }}
						/>
					</View>
				</View>
			</Screen>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	},
	textWrap: {
		paddingHorizontal: 15,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	textInput: {
		fontSize: 16,
		color: Colors.primaryFontColor,
		padding: 0,
		height: 50
	}
});

export default PasswordVerificationScreen;
