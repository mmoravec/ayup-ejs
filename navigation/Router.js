import {
  createRouter,
} from '@exponent/ex-navigation';

import HomeScreen from '../screens/homeScreen';
import LoginScreen from '../screens/loginScreen';
import NewEventScreen from '../screens/newEventScreen';

const Router = createRouter(() => ({
  home: () => HomeScreen,
  login: () => LoginScreen,
  newEvent: () => NewEventScreen,
}));

export default Router;
