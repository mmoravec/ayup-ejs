import {
    StackNavigator,
} from 'react-navigation';

import HomeScreen from '../screens/homeScreen';
import LoginScreen from '../screens/loginScreen';
import NewEventScreen from '../screens/newEventScreen';
import ActivitiesScreen from '../screens/activitiesScreen';
import EventScreen from '../screens/eventScreen';
import SettingsScreen from '../screens/settingsScreen';

const Nav = StackNavigator({
  Home: {screen: HomeScreen},
  Login: {screen: LoginScreen},
  NewEvent: {screen: NewEventScreen},
  Activities: {screen: ActivitiesScreen},
  Event: {screen: EventScreen},
  Settings: {screen: SettingsScreen},
}, {
  initialRouteName: 'Home',
});

export default Nav;
