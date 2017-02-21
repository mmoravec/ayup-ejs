import Exponent from 'exponent';
import React from 'react';
import {
  NavigationContext,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import { Provider, connect } from 'react-redux';
import Router from './navigation/Router';
import Store from './state/Store';

const navigationContext = new NavigationContext({
  store: Store,
  router: Router,
});

class AppContainer extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <NavigationProvider context={navigationContext}>
          <App {...this.props} />
        </NavigationProvider>
      </Provider>
    );
  }
}

@connect(data => App.getDataProps(data))
class App extends React.Component {
  static getDataProps(data) {
    return {
      user: data.user,
    };
  }
  render() {
    if (!this.props.user.get('id') && !this.props.user.get('new')) {
      return <Exponent.Components.AppLoading />;
    } else {
      let route = 'login';
      if (this.props.user.get('id') && this.props.user.get('authToken')) {
        route = 'home';
      }
      return (
        <StackNavigation
          id="root"
          initialRoute={Router.getRoute(route)}
        />
      );
    }
  }
}

Exponent.registerRootComponent(AppContainer);
