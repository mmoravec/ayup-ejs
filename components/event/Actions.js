import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import MyText from '../common/MyText';
import Actions from '../../state/Actions';
const {height, width} = Dimensions.get('window');

@connect()
export default class EventActions extends React.Component {

  state = {
    active: false,
    bottom: new Animated.Value(height),
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{zIndex: 5}} onPress={this._settingsPress}>
          {
            !this.state.active && <MaterialCommunityIcons
              style={{right: 15, top: 25, position: 'absolute'}}
              size={42}
              name={'dots-vertical'}
              color={"#222"}
                                  /> ||
              this.state.active && <MaterialCommunityIcons
                style={{right: 15, top: 25, position: 'absolute'}}
                size={42}
                name={'window-close'}
                color={"#222"}
                                   />
          }
        </TouchableOpacity>
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
  }

  _deleteEvent = () => {
    console.log('deleting event');
    this.props.dispatch(Actions.deleteEvent(this.props.event.id));
  }

  _settingsPress = () => {
    this.setState({active: !this.state.active});
    if (this.state.active) {
      Animated.spring(this.state.bottom, {toValue: height, tension: 20, friction: 4, velocity: 300}).start();
    } else {
      Animated.spring(this.state.bottom, {toValue: height * 0.8, tension: 20, friction: 4, velocity: 300}).start();
    }

  }

}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width,
    height,
    zIndex: 1,
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
