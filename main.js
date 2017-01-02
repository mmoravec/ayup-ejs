import Exponent from 'exponent';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import { Provider as ReduxProvider, connect } from 'react-redux';
import Home from './containers/HomeScreen';
import configureStore from './store';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const store = configureStore();


class AppContainer extends React.Component {
  render() {
    return (
      <ReduxProvider store={store}>
         <Router hideNavBar name="root">
           <Scene
             key="home"
             component={Home}
             title="Home"
           />
         </Router>
       </ReduxProvider>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Exponent.registerRootComponent(AppContainer);
