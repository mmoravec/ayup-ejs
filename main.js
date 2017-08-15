import Expo from 'expo';
import React from 'react';
import { BackHandler, View, Linking, Alert, Platform } from 'react-native';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import Navigation from './navigation/Navigator';
import Store from './state/Store';
import Actions from './state/Actions';
import Notifications from './components/Notifications';
// import Actions from './state/Actions';

class AppContainer extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <App />
      </Provider>
    );
  }
}

@connect(data => App.getDataProps(data))
class App extends React.Component {
  static getDataProps(data) {
    return {
      startup: data.phone,
      nav: data.navigation,
    };
  }
  //TODO: move this to a saga
  handleBackPress = () => {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: nav,
    });
    let lastRoute = navigation.state.routes[navigation.state.routes.length - 1];
    let secondToLast = navigation.state.routes[navigation.state.routes.length - 2];
    if (lastRoute.routeName === "Event") {
      this.props.dispatch(Actions.zeroSelectedEvent());
      this.props.dispatch(Actions.zeroSelectedComment());
    } else if (secondToLast.routeName === "Event" && lastRoute === "NewEvent") {
      this.props.dispatch(Actions.zeroForm());
    }
    if (lastRoute.routeName === "Home") {
      return false;
    }
    navigation.goBack();
    return true;
  };
  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    let url;
    Expo.DangerZone.Branch.subscribe(({ error, params }) => {
      if (params && !error) {
        // grab deep link data and route appropriately.
        this._handleURL(params);
      }
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  render() {
    // console.log(this.props.startup);
    let {fontLoaded, credLoaded, filtersLoaded, imagesLoaded} = this.props.startup;
    if (fontLoaded && credLoaded && filtersLoaded && imagesLoaded) {
      return (
        <View style={{flex: 1}}>
          <Notifications />
          <Navigation
            navigation={addNavigationHelpers({
              dispatch: this.props.dispatch,
              state: this.props.nav,
            })}
          />
        </View>
      );
    } else {
      return <Expo.AppLoading />;
    }
  }

  _handleURL = (action) => {
    this.props.dispatch(Actions.handleURL(action));
  }

}

Expo.registerRootComponent(AppContainer);
