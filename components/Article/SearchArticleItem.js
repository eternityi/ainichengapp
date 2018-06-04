import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native';

import Colors from "../../constants/Colors";

class SearchArticleItem extends Component {
  render() {
    let { navigation,keywords,article } = this.props;
    return (
    	<TouchableOpacity
    		style={styles.articleItem}
    		onPress={() => navigation.navigate("文章详情", { article })}
    	>
    		<Text style={styles.articleTitle}>{this._matchingText(keywords,article.title)}</Text>
    		<Text style={styles.articleText} numberOfLines={3}>{this._matchingText(keywords,article.description)}</Text>
    		<Text style={[styles.articleText,{marginTop: 10}]}>{article.user.name + " 著"}</Text>
    	</TouchableOpacity>
    );
  }

  _matchingText(keywords,content) {
  	// todo 可以替换 但是不能创建React Element
  	// var reg = new RegExp(keywords,"g");
  	// if(reg.test(content)&&keywords) {
  	// 	// var highlightKeywords = React.createElement(Text,{style:{styles.focused}},keywords);
  	// 	var enhanceContent = content.replace(reg,`<Text style={styles.focused}>${keywords}</Text>`);
  	// 	return enhanceContent;
  	// }else {
  	// 	return content;
  	// }
  	return content;
  }
}

const styles = StyleSheet.create({
	articleItem: {
		marginHorizontal: 15,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor
	},
	articleTitle: {
		fontSize: 16,
		lineHeight: 22,
		fontWeight: "500",
		color: Colors.primaryFontColor,
		paddingVertical: 16
	},
	articleText: {
		fontSize: 13,
		lineHeight: 17,
		color: Colors.tintFontColor
	}
});


export default SearchArticleItem;