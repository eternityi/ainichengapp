import React, { Component } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";

class SingleSearchBar extends Component {
	render() {
		let { placeholder, keywords, changeKeywords, handleSearch } = this.props;
		return (
			<View style={styles.searchBar}>
				<TextInput
					words={false}
					underlineColorAndroid="transparent"
					selectionColor={Colors.themeColor}
					style={styles.textInput}
					autoFocus={true}
					placeholder={placeholder}
					placeholderText={Colors.tintFontColor}
					onChangeText={changeKeywords}
					value={keywords}
				/>
				<TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
					<Iconfont name={"search"} size={22} color={Colors.tintFontColor} />
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	searchBar: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		height: 33,
		borderWidth: 1,
		borderColor: Colors.lightBorderColor,
		backgroundColor: Colors.lightGray,
		borderRadius: 4
	},
	textInput: {
		flex: 1,
		fontSize: 16,
		padding: 0,
		paddingLeft: 10,
		color: Colors.primaryFontColor
	},
	searchButton: {
		paddingHorizontal: 10,
		borderLeftWidth: 1,
		borderLeftColor: Colors.tintBorderColor
	}
});

export default SingleSearchBar;
