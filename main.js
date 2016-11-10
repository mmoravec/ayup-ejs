import Exponent from 'exponent';
import React from 'react';
import { NavigationProvider } from '@exponent/ex-navigation';
import App from './app';
import Router from './navigation/Router';
//import { Provider as ReduxProvider, connect } from 'react-redux'

class AppContainer extends React.Component {
  render() {
    return (
//      <ReduxProvider store={Store}>
        <NavigationProvider router={Router}>
          <App />
        </NavigationProvider>
//      </ReduxProvider>
    );
  }
}

Exponent.registerRootComponent(AppContainer);
