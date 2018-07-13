import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";

import Colors from "../../constants/Colors";

class Input extends Component {
	render() {
		let {
			placeholder = "说点什么呗~",
			placeholderText = Colors.lightFontColor,
			selectionColor = Colors.themeColor,
			textAlignVertical = "top",
			multiline,
			autoFocus,
			onFocus,
			style = {},
			onChangeText,
			defaultValue,
			ref
		} = this.props;
		return (
			<TextInput
				placeholder={placeholder}
				placeholderText={placeholderText}
				textAlignVertical={textAlignVertical}
				underlineColorAndroid="transparent"
				selectionColor={selectionColor}
				multiline={multiline}
				autoFocus={autoFocus}
				onFocus={onFocus}
				style={style}
				onChangeText={onChangeText}
				defaultValue={defaultValue}
				ref={ref}
			/>
		);
	}
}

const styles = StyleSheet.create({});

export default Input;
