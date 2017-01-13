import {
  createRouter,
} from '@exponent/ex-navigation';

import HomeScreen from '../screens/homeScreen';
import LoginScreen from '../screens/loginScreen';

const Router = createRouter(() => ({
  home: () => HomeScreen,
  login: () => LoginScreen,
}));

export default Router;
