import {
  createRouter,
} from '@expo/ex-navigation';

import HomeScreen from '../screens/homeScreen';
import LoginScreen from '../screens/loginScreen';
import NewEventScreen from '../screens/newEventScreen';
import ActivitiesScreen from '../screens/activitiesScreen';
import EventScreen from '../screens/eventScreen';
import SettingsScreen from '../screens/settingsScreen';
import ProfileScreen from '../screens/profileScreen';
import MyEventsScreen from '../screens/myEventsScreen';

const Router = createRouter(() => ({
  home: () => HomeScreen,
  login: () => LoginScreen,
  newEvent: () => NewEventScreen,
  activities: () => ActivitiesScreen,
  myEvents: () => MyEventsScreen,
  event: () => EventScreen,
  settings: () => SettingsScreen,
  profile: () => ProfileScreen,
}));

export default Router;
