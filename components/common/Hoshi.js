import React from 'react';
import {
  Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';
import BaseInput from './BaseInput';
import Actions from '../../state/Actions';

const PADDING = 24;

@connect()
export default class Hoshi extends BaseInput {

  static defaultProps = {
    borderColor: 'red',
    height: 48,
  };

  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
      maskColor,
      borderColor,
      height: inputHeight,
    } = this.props;
    const {
      width,
      focusedAnim,
      value,
    } = this.state;
    let top = this.props.multiline ? 5 : 15;
    return (
      <View
        style={[styles.container, containerStyle, {
          height: inputHeight + PADDING,
          width,
        }]}
        onLayout={this._onLayout}
      >
        <TextInput
          ref="input"
          {...this.props}
          style={[styles.textInput, inputStyle, {
            width: width * 0.9,
            height: inputHeight,
          }]}
          value={value}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={'transparent'}
        />
        <TouchableWithoutFeedback onPress={this.props.editable ? this.focus : null}>
          <Animated.View style={[styles.labelContainer, {
            opacity: focusedAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0, 1],
            }),
            top: focusedAnim.interpolate({
              inputRange: [0, 0.5, 0.51, 1],
              outputRange: [PADDING * 1.5, PADDING * 1.5, top, top],
            }),
            left: focusedAnim.interpolate({
              inputRange: [0, 0.5, 0.51, 1],
              outputRange: [PADDING * 0.5, PADDING, 0, PADDING * 0.5],
            }),
          }]}>
            <Animated.Text style={[styles.label, labelStyle, {fontSize: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 12],
            })}]}>
              {label}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={[styles.labelMask, { backgroundColor: maskColor }]} />
        <Animated.View
          style={[styles.border, {
            width: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, width],
            }),
            backgroundColor: this.props.focus ? borderColor : 'transparent',
          }]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#b9c1ca',
  },
  labelContainer: {
    position: 'absolute',
  },
  label: {
    fontSize: 16,
    color: '#6a7989',
    fontFamily: 'LatoRegular',
  },
  textInput: {
    position: 'absolute',
    bottom: 0,
    left: PADDING * 0.5,
    padding: 0,
    color: '#6a7989',
    fontSize: 18,
    fontFamily: 'LatoRegular',
  },
  labelMask: {
    height: 24,
    width: PADDING,
  },
  border: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 3,
  },
});
