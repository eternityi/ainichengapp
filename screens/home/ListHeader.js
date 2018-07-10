import React, { PureComponent } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, FlatList } from "react-native";
import { NavigationActions } from "react-navigation";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import { Avatar } from "../../components/Pure";
import { userFollowedCategoriesQuery } from "../../graphql/user.graphql";
import { connect } from "react-redux";
import { Query } from "react-apollo";

class ListHeader extends PureComponent {
	render() {
		let { id } = this.props;
		if (!id) {
			return null;
		}
		return (
			<View style={styles.officialColumnWarp}>
				<Query query={userFollowedCategoriesQuery} variables={{ user_id: id }}>
					{({ loading, error, data, refetch }) => {
						if (!(data && data.categories)) return null;
						if (data.categories.length < 1) return null;
						return (
							<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
								<FlatList
									style={{ flex: 1 }}
									horizontal={true}
									data={data.categories}
									keyExtractor={item => item.id.toString()}
									renderItem={this._renderItem}
									ListFooterComponent={this._renderFooter}
								/>
							</ScrollView>
						);
					}}
				</Query>
			</View>
		);
	}

	_renderItem = ({ item, index }) => {
		const { navigation } = this.props;
		let { logo, name } = item;
		return (
			<TouchableOpacity
				key={index.toString()}
				style={styles.category}
				onPress={() => {
					const navigateAction = NavigationActions.navigate({
						routeName: "专题详情",
						params: { category: item }
					});
					navigation.dispatch(navigateAction);
				}}
			>
				<Avatar uri={logo} size={50} type="category" />
				<View>
					<Text style={styles.text} numberOfLines={1}>
						{name}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	_renderFooter = () => {
		const { navigation } = this.props;
		return (
			<TouchableOpacity style={[styles.category, { marginHorizontal: 20 }]} onPress={() => navigation.navigate("推荐专题")}>
				<View style={styles.addMore}>
					<Iconfont name="add" size={25} color={Colors.tintFontColor} />
				</View>
				<View>
					<Text style={styles.text} numberOfLines={1}>
						发现更多专题
					</Text>
				</View>
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	officialColumnWarp: {
		flexDirection: "row",
		alignItems: "center",
		height: 100,
		paddingVertical: 12,
		borderBottomWidth: 6,
		borderBottomColor: Colors.lightBorderColor
	},
	category: {
		width: 50,
		height: 70,
		marginLeft: 20,
		justifyContent: "space-between"
	},
	text: {
		fontSize: 12,
		color: Colors.primaryFontColor,
		textAlign: "center"
	},
	addMore: {
		width: 50,
		height: 50,
		borderWidth: 1,
		borderColor: Colors.lightBorderColor,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "center"
	}
});

export default connect(store => ({ id: store.users.user.id }))(ListHeader);
