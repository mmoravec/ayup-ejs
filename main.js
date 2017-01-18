import Exponent from 'exponent';
import React from 'react';
import {
  NavigationContext,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import { Provider } from 'react-redux';
import Router from './navigation/router'
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
          <StackNavigation
            id="root"
            initialRoute={Router.getRoute('login')}
          />
        </NavigationProvider>
       </Provider>
    );
  }
}

Exponent.registerRootComponent(AppContainer);
