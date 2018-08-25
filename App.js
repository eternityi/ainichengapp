import React from "react";
import { Platform, StatusBar, StyleSheet, View, Text, YellowBox, Dimensions, Image } from "react-native";
import codePush from "react-native-code-push";
import Spinner from "react-native-spinkit";
import Orientation from "react-native-orientation";

import ApolloApp from "./ApolloApp";
import Colors from "./constants/Colors";
import Config from "./constants/Config";

//redux
import { Provider, connect } from "react-redux";
import store from "./store";
import actions from "./store/actions";
import { Storage, ItemKeys } from "./store/localStorage";

//menu
import { MenuProvider } from "react-native-popup-menu";

const { width, height } = Dimensions.get("window");

class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  customBackHandler = instance => {
    if (instance.isMenuOpen()) {
      instance.closeMenu();
      return true;
    } else {
      return false;
    }
  };

  async componentWillMount() {
    YellowBox.ignoreWarnings(["Task orphaned"]);
    Orientation.lockToPortrait();
    await this._loadResourcesAsync();
  }

  render() {
    let { isLoadingComplete } = this.state;
    return (
      <View style={styles.container}>
        <MenuProvider backHandler={this.customBackHandler}>
          <Provider store={store}>
            <ApolloApp onReady={this._handleFinishLoading} />
          </Provider>
        </MenuProvider>
        {!isLoadingComplete && (
          <View style={styles.appLaunch}>
            <View style={styles.column}>
              <Spinner size={50} type="9CubeGrid" color={Colors.themeColor} />
            </View>
            <View style={styles.column}>
              <View style={styles.appName}>
                <Text style={styles.name}>{Config.AppDisplayName}</Text>
              </View>
              <View style={styles.appSlogan}>
                <Text style={styles.slogan}>{Config.AppSlogan}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  _loadResourcesAsync = async () => {
    let user = await Storage.getItem(ItemKeys.user);
    if (user) {
      store.dispatch(actions.signIn(user));
    }
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  appLaunch: {
    width,
    height,
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  column: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15
  },
  appName: {
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.themeColor
  },
  name: {
    fontSize: 22,
    color: Colors.themeColor,
    fontWeight: "300"
  },
  appSlogan: {
    marginTop: 10
  },
  slogan: { fontSize: 15, lineHeight: 20, color: Colors.tintFontColor }
});

export default codePush(App);
