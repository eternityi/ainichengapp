import React, { Component } from "react";
import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";

class LoginInput extends Component {
	constructor(props) {
		super(props);
		this.value = props.value;
		this.state = { visibility: true, changes: 0, value: "" };
	}

	componentDidMount() {
		if (this.props.secure) {
			this.setState({ visibility: false });
		}
	}

	render() {
		let { visibility, value } = this.state;
		let { secure = false, keys, name, emptyValue, placeholder, focusItem, focusKey, changeValue, customStyle = {} } = this.props;
		let combineStyle = StyleSheet.flatten([styles.inputWrap, customStyle]);
		return (
			<View style={combineStyle}>
				<Iconfont name={name} size={18} color={Colors.tintFontColor} style={{ marginHorizontal: 22 }} />
				<TextInput
					underlineColorAndroid="transparent"
					selectionColor={Colors.themeColor}
					style={styles.textInput}
					autoFocus={keys == focusItem}
					placeholder={placeholder}
					placeholderText={Colors.tintFontColor}
					onChangeText={value => {
						this.setState({ value });
						changeValue(keys, value);
					}}
					value={value}
					defaultValue={this.value}
					onFocus={() => focusKey(keys)}
					secureTextEntry={!visibility}
					ref={ref => (this.textInput = ref)}
				/>
				{secure ? (
					focusItem == keys ? (
						<TouchableOpacity
							style={styles.inputOperation}
							onPress={() => this.setState(prevState => ({ visibility: !prevState.visibility }))}
						>
							<Iconfont name={"browse"} size={19} color={visibility ? Colors.themeColor : Colors.lightFontColor} />
						</TouchableOpacity>
					) : (
						<View style={styles.inputOperation} />
					)
				) : focusItem == keys ? (
					<TouchableOpacity
						style={styles.inputOperation}
						onPress={() => {
							this.setState({ value: "" });
							emptyValue(keys);
						}}
					>
						<Iconfont name={"close"} size={18} color={Colors.lightFontColor} />
					</TouchableOpacity>
				) : (
					<View style={styles.inputOperation} />
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	inputWrap: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: Colors.tintBorderColor
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		height: 22,
		lineHeight: 22,
		padding: 0,
		color: Colors.primaryFontColor
	},
	inputOperation: {
		width: 46,
		height: 46,
		justifyContent: "center",
		alignItems: "center"
	}
});

export default LoginInput;
