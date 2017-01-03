import {
  createRouter,
} from '@exponent/ex-navigation';

import HomeScreen from '../screens/homescreen';

const Router = createRouter(() => ({
  home: () => HomeScreen,
}));

export default Router;
