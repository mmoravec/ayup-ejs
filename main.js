import Exponent from 'exponent';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationProvider, withNavigation, StackNavigation } from '@exponent/ex-navigation';
import { Provider as ReduxProvider, connect } from 'react-redux';

import Actions from './state/Actions';
import Router from './navigation/Router';
import Store from './state/Store';
import { User } from './state/Records';
import LocalStorage from './state/LocalStorage';

class AppContainer extends React.Component {
  render() {
    return (
     <ReduxProvider store={Store}>
        <NavigationProvider router={Router}>
          <App {...this.props} />
        </NavigationProvider>
     </ReduxProvider>
    );
  }
}


@withNavigation
@connect(data => App.getDataProps)
class App extends React.Component {
  static getDataProps(data) {
    return {
      currentUser: data.currentUser,
    };
  }

  state = {
    dataReady: false,
  };

  async componentDidMount() {
    await this._loadCacheAsync();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.dataReady) {
      return;
    }

    const rootNavigator = this.props.navigation.getNavigator('root');
    const previouslySignedIn = isSignedIn(prevProps.currentUser) &&
      prevState.dataReady === this.state.dataReady;
    const currentlySignedIn = isSignedIn(this.props.currentUser);

    if (!previouslySignedIn && currentlySignedIn) {
      rootNavigator.replace('home');
    } else if (previouslySignedIn && !currentlySignedIn) {
      rootNavigator.replace('home');
    }
  }


  _loadCacheAsync = async () => {
    let user = new User(await LocalStorage.getUserAsync());
    this.props.dispatch(Actions.setCurrentUser(user));

    this.setState({
      dataReady: true,
    });
  }

  render() {
    if (!this.state.dataReady) {
      return <Exponent.Components.AppLoading />;
    }

    return (
      <View style={styles.container}>
        <StackNavigation
          id="root"
          initialRoute={Router.getRoute('home')}
        />
      </View>
    );
  }
}


function isSignedIn(userState) {
  return !!userState.authToken || userState.isGuest;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Exponent.registerRootComponent(AppContainer);
