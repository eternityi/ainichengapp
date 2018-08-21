import React, { Component } from "react";
import { StyleSheet, View, TextInput, Platform } from "react-native";

import Colors from "../../constants/Colors";

class Input extends Component {
	render() {
		let {
			inputRef,
			changeText,
			onFocus,
			value,
			style = {},
			placeholder = "说点什么呗~",
			placeholderText = Colors.lightFontColor,
			selectionColor = Colors.themeColor,
			textAlignVertical = "top",
			multiline,
			autoFocus,
			words = true
		} = this.props;
		return (
			<TextInput
				words={words}
				placeholder={placeholder}
				placeholderText={placeholderText}
				textAlignVertical={textAlignVertical}
				underlineColorAndroid="transparent"
				selectionColor={selectionColor}
				multiline={multiline}
				autoFocus={autoFocus}
				onFocus={onFocus}
				style={style}
				onChangeText={changeText}
				value={value}
				ref={inputRef}
			/>
		);
	}
}

const styles = StyleSheet.create({});

export default Input;
