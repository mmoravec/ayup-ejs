import Expo from 'expo';
import React from 'react';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import Navigation from './navigation/Navigator';
import Store from './state/Store';
import Actions from './state/Actions';

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
      startup: data.startup,
      user: data.user,
      nav: data.navigation,
    };
  }
  render() {
    let {fontLoaded, regionLoaded, userLoaded, filtersLoaded, imagesLoaded} = this.props.startup;
    if (fontLoaded && regionLoaded && userLoaded && filtersLoaded && imagesLoaded) {
      console.log(userLoaded);
      return (
        <Navigation
          navigation={addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav,
          })}
        />
      );
    } else {
      return <Expo.AppLoading />;
    }
  }
}

Expo.registerRootComponent(AppContainer);
