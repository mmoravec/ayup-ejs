import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import MyText from '../common/MyText';
import Actions from '../../state/Actions';
const {height, width} = Dimensions.get('window');

@connect(data => EventActions.getDataProps(data))
export default class EventActions extends React.Component {

  static getDataProps(data) {
    return {
      event: data.events.selectedEvent,
      profile: data.profile,
    };
  }

  state = {
    active: false,
    top: new Animated.Value(- height * 0.5),
  }

  render() {
    if (this.props.profile.id === this.props.event.host.id) {
      return (
        <View style={styles.container}>
          {this._renderMenu()}
            {this._renderItems()}
        </View>
      );
    } else {
      return null;
    }
  }

  _renderItems = () => {
    if (this.props.event.completed) {
      return (
        <Animated.View style={[styles.settings, {top: this.state.top}]}>
          <View style={{marginTop: 40}}>
            <TouchableOpacity onPress={this._copyEvent}>
              <MyText style={styles.copy}>
                Copy
              </MyText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    } else {
      return (
        <Animated.View style={[styles.settings, {top: this.state.top}]}>
          <View style={{marginTop: 30}}>
            <TouchableOpacity onPress={this._modifyEvent}>
              <MyText style={styles.modify}>
                Modify
              </MyText>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._deleteEvent}>
              <MyText style={styles.delete}>
                Delete
              </MyText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }
  }

  _renderMenu = () => {
    if (!this.state.active) {
      return (
        <TouchableOpacity style={{right: 15, top: 25, position: 'absolute', zIndex: 2}} onPress={this._settingsPress}>
          <MaterialCommunityIcons
            size={42}
            name={'dots-vertical'}
            color={"#222"}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={{right: 25, top: 25, position: 'absolute', zIndex: 2}} onPress={this._settingsPress}>
          <MaterialCommunityIcons
            size={42}
            name={'window-close'}
            color={"#222"}
          />
        </TouchableOpacity>
      );
    }
  }

  _deleteEvent = () => {
    this.props.dispatch(Actions.deleteEvent(this.props.event.id));
  }

  _modifyEvent = () => {
    this.props.dispatch(Actions.modifyEvent());
    this._settingsPress();
  }

  _copyEvent = () => {
    this.props.dispatch(Actions.copyEvent());
    this._settingsPress();
  }

  _settingsPress = () => {
    this.setState({active: !this.state.active});
    if (this.state.active) {
      Animated.spring(this.state.top, {toValue: -height * 0.5, tension: 60, friction: 6, velocity: 300}).start();
    } else {
      Animated.spring(this.state.top, {toValue: 0, tension: 60, friction: 6, velocity: 300}).start();
    }

  }

}

const styles = StyleSheet.create({
  container: {
    width,
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    top: 0,
  },
  settings: {
    width: width * 0.9,
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: width * 0.05,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
  },
  delete: {
    fontSize: 24,
    marginBottom: 10,
    color: '#EE3870',
  },
  modify: {
    fontSize: 24,
    marginBottom: 10,
    color: '#222',
  },
  copy: {
    fontSize: 24,
    marginBottom: 20,
    color: '#222',
  },
});
