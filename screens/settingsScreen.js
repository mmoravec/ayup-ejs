import React from 'react';
import {
  View,
  ListView,
  StyleSheet,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import TouchableNativeFeedback from '@exponent/react-native-touchable-native-feedback-safe';
import Actions from '../state/Actions';
import LocalStorage from '../utils/LocalStorage';

@connect()
export default class SettingsScreen extends React.Component {

  render() {
    return (
      <View>
        <TouchableNativeFeedback onPress={this._signOut}>
          <View style={styles.signOutButton}>
            <Text>
              Sign Out
            </Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={this._signIn}>
          <View style={styles.signOutButton}>
            <Text>
              Go to Login
            </Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={this._home}>
          <View style={styles.signOutButton}>
            <Text>
              Back to Homescreen
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
  _signOut = () => {
    LocalStorage.clearAllAsync();
    this.props.dispatch(Actions.routeChange('home'));
  }
  _signIn = () => {
    LocalStorage.clearAllAsync();
    this.props.dispatch(Actions.routeChange('login'));
  }
  _home = () => {
    this.props.navigator.pop();
  }
}

const styles = StyleSheet.create({
  signOutButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 5,
    width: 250,
  },
});
