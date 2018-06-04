import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from "react-native";

import { Iconfont } from "../../../utils/Fonts";
import Colors from "../../../constants/Colors";
import { Header, HeaderLeft } from "../../../components/Header";
import { FollowedGroup } from "../../../components/MediaGroup";
import { CustomPopoverMenu } from "../../../components/Modal";
import { ContentEnd } from "../../../components/Pure";
import Screen from "../../Screen";

import { Query } from "react-apollo";
import gql from "graphql-tag";
import { connect } from "react-redux";
import actions from "../../../store/actions";

class AllFollowsScreen extends Component {
	static navigationOptions = {
		header: null
	};

	constructor(props) {
		super(props);
		let { params = {} } = this.props.navigation.state;
		let { filter = "全部关注" } = params;
		this.state = {
			filter: filter
		};
	}

	render() {
		let { filter } = this.state;
		let { navigation, all_follows } = this.props;
		return (
			<Screen>
				<View style={styles.container}>
					<Header
						navigation={navigation}
						search
						leftComponent={
							<HeaderLeft navigation={navigation} routeName={true}>
								<CustomPopoverMenu
									width={120}
									customOptionStyle={{
										optionWrapper: {
											alignItems: "flex-start",
											paddingLeft: 10
										}
									}}
									selectHandler={index => {
										switch (index) {
											case 0:
												this.setState({ filter: "全部关注" });
												break;
											case 1:
												this.setState({ filter: "只看用户" });
												break;
											case 2:
												this.setState({ filter: "只看专题" });
												break;
											case 3:
												this.setState({ filter: "只看文集" });
												break;
											case 4:
												this.setState({ filter: "只看推送更新" });
												break;
										}
									}}
									triggerComponent={
										<View
											style={{
												flexDirection: "row",
												alignItems: "center"
											}}
										>
											<Text
												style={{
													fontSize: 16,
													color: Colors.tintFontColor,
													marginRight: 5
												}}
											>
												{filter}
											</Text>
											<Iconfont name={"downward-arrow"} size={12} color={Colors.tintFontColor} />
										</View>
									}
									options={["全部关注", "只看用户", "只看专题", "只看文集", "只看推送更新"]}
								/>
							</HeaderLeft>
						}
					/>
					{all_follows.length && (
						<FlatList
							data={all_follows}
							keyExtractor={item => item.id.toString()}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() =>
										navigation.navigate(item.type == "user" ? "用户文章动态" : item.type == "category" ? "专题详情" : "文集详情", {
											[item.type]: item
										})}
								>
									<FollowedGroup followed={item} />
								</TouchableOpacity>
							)}
							getItemLayout={(data, index) => ({
								length: 85,
								offset: 85 * index,
								index
							})}
							ListFooterComponent={() => <ContentEnd />}
						/>
					)}
				</View>
			</Screen>

			/*<Query query={QUERY} variables={{filter}}>
	    		{({ loading, data }) => {
	    			if(!(data && data.allFollows)) return null;
	    			return (
	    				<View style={styles.container}>
	    					<FlatList
	    						data={data.drafts}
	    						keyExtractor={item => item.id.toString()}
	    						renderItem={this._renderItem.bind(this)}
	    						getItemLayout={(data, index) => ( {length: 90, offset: 90 * index, index} )}
	    						ListFooterComponent={() => <ContentEnd />}
	    					/>
	    				</View>
	    			);
	    		}}
	    	</Query>**/
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor
	}
});

export default connect(store => ({ all_follows: store.users.all_follows }))(AllFollowsScreen);
