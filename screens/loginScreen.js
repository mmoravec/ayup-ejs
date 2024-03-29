import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Expo from 'expo';
import { connect } from 'react-redux';
import FadeIn from '@expo/react-native-fade-in-image';
import ActionTypes from '../state/ActionTypes';
import Actions from '../state/Actions';


@connect(data => AuthenticationScreen.getDataProps(data))
export default class AuthenticationScreen extends React.Component {
  static getDataProps(data) {
    return {
      user: data.user,
      phone: data.phone,
      nav: data.navigation,
    };
  }
  static route = {
    navigationBar: {
      visible: false,
    },
  }

  render() {
    return (
      <Image
        source={require('../assets/images/ayup_background.png')}
        style={styles.container}>
        { this._renderLogin() }
      </Image>
    );
  }

  _renderLogin = () => {
    if (this.props.phone.status === ActionTypes.INACTIVE) {
      return (
        <TouchableOpacity onPress={this._signInWithFacebook}>
          <Image
            source={require('../assets/images/fb_login.png')}
            style={styles.fblogin}
            size="large"
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      );
    } else {
      return <ActivityIndicator style={{marginBottom: 20, alignSelf: 'center'}} />
    }
  }

  _signInWithFacebook = () => {
    this.props.dispatch({
      type: ActionTypes.SIGN_IN,
    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'flex-end',
  },
  fblogin: {
    width: 300,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
