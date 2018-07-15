import React, { PureComponent } from "react";
import { ScrollView, StyleSheet, View, Image, TouchableOpacity, Text, FlatList } from "react-native";
import { NavigationActions } from "react-navigation";

import Colors from "../../constants/Colors";
import { Iconfont } from "../../utils/Fonts";
import { Avatar } from "../../components/Pure";
import { userFollowedCategoriesQuery } from "../../graphql/user.graphql";
import { connect } from "react-redux";
import { Query, compose, graphql } from "react-apollo";

class ListHeader extends React.Component {
	render() {
		return (
			<View style={styles.officialColumnWarp}>
				<View style={{ padding: 15 }}>
					<Text style={styles.tintText}>最近逛的专题</Text>
				</View>
				<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
					{this._renderContent()}
					{this._renderFooter()}
				</ScrollView>
			</View>
		);
	}

	_renderContent = () => {
		let { data } = this.props;
		if (!(data && data.categories && data.categories.length > 0)) {
			return null;
		} else {
			return data.categories.map((item, index) => {
				return this._renderItem({ item, index });
			});
		}
	};

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
					<Text style={styles.darkText} numberOfLines={1}>
						{name}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	_renderFooter = () => {
		const { navigation } = this.props;
		return (
			<TouchableOpacity style={styles.lastChild} onPress={() => navigation.navigate("推荐专题")}>
				<View style={styles.addMore}>
					<Iconfont name="add" size={30} color={Colors.tintFontColor} />
				</View>
				<View>
					<Text style={styles.darkText}>发现更多</Text>
				</View>
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	officialColumnWarp: {
		paddingBottom: 15,
		borderBottomWidth: 6,
		borderBottomColor: Colors.lightBorderColor
	},
	category: {
		width: 50,
		height: 70,
		marginLeft: 15,
		justifyContent: "space-between"
	},
	logo: {
		width: 50,
		height: 50,
		resizeMode: "cover"
	},
	lastChild: {
		height: 70,
		marginHorizontal: 15,
		justifyContent: "space-between"
	},
	addMore: {
		width: 50,
		height: 50,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: Colors.lightBorderColor,
		alignItems: "center",
		justifyContent: "center"
	},
	darkText: {
		fontSize: 12,
		color: Colors.primaryFontColor,
		textAlign: "center"
	},
	tintText: {
		fontSize: 13,
		color: Colors.tintFontColor
	}
});

export default compose(
	connect(store => ({ id: store.users.user.id })),
	graphql(userFollowedCategoriesQuery, {
		options: props => ({
			variables: {
				user_id: props.id
			}
		})
	})
)(ListHeader);
