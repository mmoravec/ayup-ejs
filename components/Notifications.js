import React from 'react';
import _ from "lodash";
import {
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from 'react-redux';
import MyText from './common/MyText';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect(data => Notifications.getDataProps(data))
export default class Notifications extends React.Component {
  static getDataProps(data) {
    return {
      phone: data.phone,
      event: data.events.selectedEvent,
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
         }).start(); }, 8000);
      return true;
    } else {
      return false;
    }
  }
  render() {
    let {fontLoaded} = this.props.phone;
    if (fontLoaded) {
      return (
        <Animated.View style={[styles.container, {top: this.state.top}]}>
          <TouchableOpacity onPress={this._handleClick}>
            <MyText style={styles.message} >{this.props.phone.notification.data.body}</MyText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.close} onPress={this._close}>
            <MaterialIcons size={36} name={"close"} />
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

  _handleClick = () => {
    let sId = this.props.event ? this.props.event.id : "";
    let id = this.props.phone.notification.data.event_id;
    if (!id) {
      return;
    } else if (id !== sId) {
      this.props.dispatch(Actions.selectEvent(this.props.phone.notification.data.event_id));
      this.props.dispatch(Actions.routeChange('Event'));
    } 
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingBottom: 20,
    width: width * 0.90,
    backgroundColor: '#fff',
    zIndex: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    left: width * 0.05,
    paddingLeft: 20,
    paddingRight: 40,
  },
  close: {
    position: 'absolute',
    right: 10,
    top: 25,
  },
  message: {
    fontSize: 18,
    marginTop: 30,
  },
});
