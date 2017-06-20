import React from 'react';
import _ from "lodash";
import {
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from 'react-redux';
import MyText from './common/MyText';
const {height, width} = Dimensions.get('window');

@connect(data => Notifications.getDataProps(data))
export default class Notifications extends React.Component {
  static getDataProps(data) {
    return {
      phone: data.phone,
    };
  }

  state = {
    top: new Animated.Value(- height * 0.2),
  }

  shouldComponentUpdate(nextProps, nextState) {    
    if (nextProps.phone.notification.data !== this.props.phone.notification.data) {
       Animated.timing(this.state.top, {toValue:0, duration: 1000}).start();
       _.delay(() => {
         Animated.timing(this.state.top, {toValue:- height * 0.2, duration: 200,
         }).start(); }, 5000);
      return true;
    } else {
      return false;
    }
  }
  render() {
    let {fontLoaded} = this.props.phone;
    debugger;
    if (fontLoaded) {
      return (
        <Animated.View style={[styles.container, {top: this.state.top}]}>
          <MyText style={styles.message} >{this.props.phone.notification.body}</MyText>
          <TouchableOpacity style={styles.close} onPress={this._close}>
            <MaterialIcons size={30} name={"close"} />
          </TouchableOpacity>
        </Animated.View>
      );
    } else {
      return null;
    }
  }

  _close = () => {
    Animated.timing(this.state.top, {toValue:- height * 0.2, duration: 200}).start();
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
  close: {
    position: 'absolute',
    right: 15,
    top: 30,
  },
  message: {
    margin: 30,
    fontSize: 22,
    marginTop: 50,
  },
});
