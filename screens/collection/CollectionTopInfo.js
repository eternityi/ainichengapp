import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity } from "react-native";

import { Iconfont } from "../../utils/Fonts";
import Colors from "../../constants/Colors";
import Avatar from "../../components/Pure/Avatar";
import ContentEnd from "../../components/Pure/ContentEnd";
import FollowCategoryButton from "../../components/Button/FollowCategory";

import { connect } from "react-redux";
import actions from "../../store/actions";

class CollectionTopInfo extends Component {
	render() {
		let { collection = {}, navigation, user_articles } = this.props;
		return (
			<View style={styles.collectionInfo}>
				<View style={styles.collectionInfoTop}>
					<View>
						<Avatar type={"collection"} uri={collection.logo} size={80} />
					</View>
					<View style={{ marginTop: 10, marginLeft: 20 }}>
						<View style={{ marginBottom: 10 }}>
							<Text
								style={{
									fontSize: 20,
									color: Colors.primaryFontColor
								}}
							>
								{collection.name}
							</Text>
						</View>
						<View>
							<Text
								style={{
									fontSize: 16,
									color: "#666"
								}}
							>
								<Text
									style={{
										color: Colors.linkColor
									}}
									onPress={() => navigation.navigate("用户详情", { user: collection.user })}
								>
									{collection.user.name + " "}
								</Text>
								编·{collection.count_articles}篇文章
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.collectionButton}>
					<FollowCategoryButton
						size={15}
						id={collection.id}
						type={"collection"}
						followed={collection.followed}
						follows={collection.count_follows}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	collectionInfo: {
		padding: 20
	},
	collectionInfoTop: {
		flexDirection: "row",
		paddingBottom: 20
	},
	collectionDescription: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10
	},
	collectionButton: {
		height: 42
	}
});

export default connect(store => ({ user_articles: store.users.user_articles }))(CollectionTopInfo);
