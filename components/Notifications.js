import React from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import MyText from './common/MyText';
const {height, width} = Dimensions.get('window');

@connect(data => Notifications.getDataProps(data))
export default class Notifications extends React.Component {
  static getDataProps(data) {
    return {
      notification: data.phone.notification,
    };
  }
  render() {
    if (this.props.notification.origin) {
      return (
        <Animated.View style={[styles.container]}>
          <MyText>{this.props.notification.origin}</MyText>
          <MyText>{JSON.stringify(this.state.notification.data)}</MyText>
        </Animated.View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: height * 0.2,
    width,
    backgroundColor: '#fff',
    zIndex: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
