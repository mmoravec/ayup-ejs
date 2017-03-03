import React from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import TimeSelector from './form/TimeSelector';
const {height, width} = Dimensions.get('window');

export default class FilterModal extends React.Component {

  state = {
    height: new Animated.Value(0),
    startTime: new Date(),
    endTime: new Date(),
    focus: [
      {stateKey: 'startTime', focus: false},
      {stateKey: 'endTime', focus: false},
    ],
  }

  render() {
    if (this.props.visible) {
      Animated.spring(this.state.height, {toValue: 'auto', tension: 20, friction: 4, velocity: 300}).start();
      return (
        <Animated.View style={[styles.modal, {height: this.state.height}]}>
          <TimeSelector
            ref="startTime"
            focus={this.state.focus}
            onFocus={this._focusElement}
            date={this.state.startTime}
            label={'Start Time'}
            onChange={this._onChange}
            stateKey={'startTime'}
          />
          <TimeSelector
            ref="endTime"
            focus={this.state.focus}
            onFocus={this._focusElement}
            date={this.state.endTime}
            label={'End Time'}
            onChange={this._onChange}
            stateKey={'endTime'}
          />
          <TouchableOpacity
            style={styles.hlightSave}
            onPress={this._saveBtnPress}>
            <Image
              style={styles.btnSave}
              source={require('../assets/images/btn_save.png')}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    } else {
      return null;
    }
  }
  _focusElement = (el) => {
    let focus = this.state.focus.map(input => {
      if (input.stateKey === el && !input.focus) {
        return {stateKey: input.stateKey, focus: true};
      } else {
        return {stateKey: input.stateKey, focus: false};
      }
    });
    this.setState({focus});
  }
  _onChange = (key, value) => {
    let obj = {};
    obj[key] = value;
    this.setState(obj);
  }
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    width,
    backgroundColor: '#fff',
  },
  hlightSave: {
    margin: 10,
    alignSelf: 'center',
  },
  btnSave: {
    height: 38,
    width: 140,
  },
});
