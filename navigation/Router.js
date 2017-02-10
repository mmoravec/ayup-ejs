import {
  createRouter,
} from '@exponent/ex-navigation';

import HomeScreen from '../screens/homeScreen';
import LoginScreen from '../screens/loginScreen';
import NewEventScreen from '../screens/newEventScreen';
import ActivitiesScreen from '../screens/activitiesScreen';

const Router = createRouter(() => ({
  home: () => HomeScreen,
  login: () => LoginScreen,
  newEvent: () => NewEventScreen,
  activities: () => ActivitiesScreen,
}));

export default Router;
