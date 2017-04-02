import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import FadeIn from '@expo/react-native-fade-in-image';
import ActionTypes from '../state/ActionTypes';
import Actions from '../state/Actions';


@connect(data => AuthenticationScreen.getDataProps(data))
export default class AuthenticationScreen extends React.Component {
  static getDataProps(data) {
    return {
      user: data.user,
    };
  }
  static route = {
    navigationBar: {
      visible: false,
    },
  }

  componentWillMount() {
    if (this.props.user.get('secret') !== null) {
      this.props.dispatch(Actions.routeChange('Home'));
    }
  }

  // <FadeIn placeholderStyle={{backgroundColor: 'transparent'}}>
  //   <Image
  //     style={{width: 150, height: 244, marginBottom: 30,}}
  //     source={require('../assets/images/logo.png')}
  //   />
  // </FadeIn>
  render() {
    return (
      <View style={styles.container}>
        <TouchableNativeFeedback onPress={this._signInWithFacebook}>
          <View style={styles.facebookButton}>
            <Text>
              Sign in with Facebook
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 5,
    width: 250,
  },
  guestButton: {
    marginTop: 15,
    backgroundColor: '#eee',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    width: 250,
  },
  facebookButtonText: {
    fontSize: 15,
    color: '#fff',
  },
  guestButtonText: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.9)',
  },
});
