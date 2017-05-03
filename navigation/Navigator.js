import { StackNavigator } from 'react-navigation';

import HomeScreen from '../screens/homeScreen';
import LoginScreen from '../screens/loginScreen';
import NewEventScreen from '../screens/newEventScreen';
import ActivitiesScreen from '../screens/activitiesScreen';
import EventScreen from '../screens/eventScreen';
import SettingsScreen from '../screens/settingsScreen';
import ProfileScreen from '../screens/profileScreen';
import MyEventsScreen from '../screens/myEventsScreen';

const Navigator = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  NewEvent: {
    screen: NewEventScreen,
  },
  Event: {
    screen: EventScreen,
  },
  Activities: {
    screen: ActivitiesScreen,
  },
  MyEvents: {
    screen: MyEventsScreen,
  },
  Settings: {
    screen: SettingsScreen,
  },
  Profile: {
    screen: ProfileScreen,
  },
},
{
  headerMode: 'none',
  initialRouteName: 'Login',
  navigationOptions: {
    cardStack: {
      gesturesEnabled: false,
    },
  },
});

export default Navigator;
