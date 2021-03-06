import React, { Component } from "react";
import RootNavigation from "./navigation/RootNavigation";
import Config from "./constants/Config";
import { connect } from "react-redux";

import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";

import { recommendAuthors } from "./graphql/user.graphql";
import { unreadsQuery } from "./graphql/notification.graphql";
import { chatsQuery } from "./graphql/chat.graphql";
import { recommendArticlesQuery, topArticleWithImagesQuery, recommandDynamicQuery } from "./graphql/article.graphql";

class ApolloApp extends Component {
	_makeClient(user) {
		let { token } = user;
		this.client = new ApolloClient({
			uri: Config.ServerRoot + "/graphql",
			request: async operation => {
				operation.setContext({
					headers: {
						token
					}
				});
			},
			cache: new InMemoryCache()
		});
	}

	componentWillMount() {
		let { user = {} } = this.props;
		this.timer = setTimeout(() => {
			this.props.onReady();
		}, 5000);
		this._makeClient(user);
		let { query } = this.client;
		let promises = [query({ query: recommendArticlesQuery }), query({ query: topArticleWithImagesQuery }), query({ query: recommendAuthors })];
		if (user.token) {
			promises.concat([
				query({ query: unreadsQuery }),
				query({ query: chatsQuery }),
				query({ query: recommandDynamicQuery, variables: { user_id: user.id } })
			]);
		}
		Promise.all(promises)
			.then(fulfilled => {
				this.promiseTimer = setTimeout(() => {
					this.props.onReady();
				}, 1000);
			})
			.catch(rejected => {
				return null;
			});
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.user !== this.props.user) {
			this._makeClient(nextProps.user);
		}
	}

	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
		this.promiseTimer && clearTimeout(this.promiseTimer);
	}

	render() {
		return (
			<ApolloProvider client={this.client}>
				<RootNavigation />
			</ApolloProvider>
		);
	}
}

export default connect(store => {
	return { user: store.users.user };
})(ApolloApp);
