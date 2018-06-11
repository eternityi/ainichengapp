import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";

import Colors from "../../../constants/Colors";
import Header from "../../../components/Header/Header";
import Screen from "../../Screen";

import { connect } from "react-redux";
import actions from "../../../store/actions";

import { updateUserIntroductionMutation } from "../../../graphql/user.graphql";
import { Query, Mutation } from "react-apollo";

class IntroduceScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			introduction: props.navigation.getParam("introduction", "")
		};
	}

	render() {
		const { navigation } = this.props;
		let { introduction } = this.state;
		return (
			<Screen>
				<View style={styles.container}>
					<Mutation mutation={updateUserIntroductionMutation}>
						{updateUserIntroduction => {
							return (
								<Header
									navigation={navigation}
									rightComponent={
										<TouchableOpacity
											onPress={() => {
												updateUserIntroduction({
													variables: {
														introduction
													}
												});
												this.props.dispatch(actions.updateIntroduction(introduction));
												navigation.goBack();
											}}
										>
											<Text
												style={{
													fontSize: 17,
													color: Colors.themeColor
												}}
											>
												确定
											</Text>
										</TouchableOpacity>
									}
								/>
							);
						}}
					</Mutation>
					<View style={styles.inputContainer}>
						<TextInput
							textAlignVertical="top"
							underlineColorAndroid="transparent"
							selectionColor={Colors.themeColor}
							multiline={true}
							autoFocus
							style={styles.textInput}
							onChangeText={introduction => this.setState({ introduction })}
							value={introduction ? introduction + "" : ""}
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
	inputContainer: {
		flex: 1,
		backgroundColor: Colors.skinColor,
		padding: 15
	},
	textInput: {
		height: 80,
		padding: 0,
		fontSize: 16,
		color: Colors.primaryFontColor,
		lineHeight: 24
	}
});

export default connect(store => ({
	user: store.users.user
}))(IntroduceScreen);
