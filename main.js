import Exponent from 'exponent';
import React from 'react';
import { Provider, connect } from 'react-redux';
import {
    StackNavigator,
} from 'react-navigation';
import Store from './state/Store';
import HomeScreen from './screens/homeScreen';
import LoginScreen from './screens/loginScreen';
import NewEventScreen from './screens/newEventScreen';
import ActivitiesScreen from './screens/activitiesScreen';
import EventScreen from './screens/eventScreen';
import SettingsScreen from './screens/settingsScreen';

class AppContainer extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <App {...this.props} />
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
      let route = 'Login';
      if (this.props.user.get('id') && this.props.user.get('authToken')) {
        route = 'Home';
      }
      let Nav = StackNavigator({
        Home: {screen: HomeScreen},
        Login: {screen: LoginScreen},
        NewEvent: {screen: NewEventScreen},
        Activities: {screen: ActivitiesScreen},
        Event: {screen: EventScreen},
        Settings: {screen: SettingsScreen},
      }, {
        initialRouteName: route,
        headerMode: 'none',
      });
      return (
        <Nav />
      );
    }
  }
}


Exponent.registerRootComponent(AppContainer);
