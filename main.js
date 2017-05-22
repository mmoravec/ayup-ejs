import Expo from 'expo';
import React from 'react';
import { BackAndroid, View } from 'react-native';
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
  constructor(props) {
    super(props);
    if (this.props.user.get('secret') !== null) {
      this.props.dispatch(Actions.routeChange('Home'));
    }
  }
  static getDataProps(data) {
    return {
      startup: data.phone,
      user: data.user,
      nav: data.navigation,
    };
  }
  handleBackPress = () => {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: nav,
    });
    navigation.goBack();
    return true;
  };
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  render() {
    let {fontLoaded, userLoaded, filtersLoaded, imagesLoaded} = this.props.startup;
    if (fontLoaded && userLoaded && filtersLoaded && imagesLoaded) {
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
}

Expo.registerRootComponent(AppContainer);
