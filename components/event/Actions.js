import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Dimensions,
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
    bottom: new Animated.Value(height * 1.5),
  }

  render() {
    if (this.props.profile.id === this.props.event.host.id) {
      return (
        <View style={styles.container}>
          {this._renderMenu()}
          <Animated.View style={[styles.settings, {bottom: this.state.bottom}]}>
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
          </Animated.View>
        </View>
      );
    } else {
      return null;
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
        <TouchableOpacity style={{right: 15, top: 25, position: 'absolute', zIndex: 2}} onPress={this._settingsPress}>
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
    this.props.dispatch(Actions.modifyEvent(this.props.event.id));
    this._settingsPress();
  }

  _settingsPress = () => {
    this.setState({active: !this.state.active});
    if (this.state.active) {
      Animated.spring(this.state.bottom, {toValue: height * 0.5, tension: 20, friction: 4, velocity: 300}).start();
    } else {
      Animated.spring(this.state.bottom, {toValue: 0, tension: 20, friction: 4, velocity: 300}).start();
    }

  }

}

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.2,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    top: 0,
  },
  settings: {
    height: height * 0.4,
    width,
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
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
  }
});
