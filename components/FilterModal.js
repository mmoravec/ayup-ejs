import React from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import TimeSelector from './form/TimeSelector';
import Actions from '../state/Actions';
const dateFormat = require('dateformat');
const {height, width} = Dimensions.get('window');

@connect((data) => FilterModal.getDataProps(data))
export default class FilterModal extends React.Component {

  static getDataProps(data) {
    return {
      filter: data.events.filter,
    };
  }

  state = {
    height: new Animated.Value(0),
    startTime: new Date(),
    endTime: new Date(),
    focus: [
      {stateKey: 'startTime', focus: false},
      {stateKey: 'endTime', focus: false},
    ],
    filterVisible: false,
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    if (this.state.filterVisible) {
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
            onPress={this._onFilterSave}>
            <Image
              style={styles.btnSave}
              source={require('../assets/images/btn_filter.png')}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    } else {
      return (
        <View style={styles.filter}>
          <TouchableOpacity
            activeOpacity={0.5}
            underlayColor="transparent"
            onPress={this._onFilterBtnPress}>
            <Image
              style={styles.filterBtn}
              source={require('../assets/images/filter2.png')}>
              <Text style={styles.dayFilter}>{dateFormat(this.props.filter.startTime, 'dddd')}</Text>
              {this._renderHours()}
            </Image>
          </TouchableOpacity>
        </View>
      );
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

  _onFilterSave = () => {
    this.props.dispatch(Actions.setFilter(this.state.startTime, this.state.endTime));
    this._onFilterBtnPress();
  }


  _onFilterBtnPress = () => {
    this.setState({
      filterVisible: !this.state.filterVisible,
    });
  }

  _renderHours = () => {
    let time = dateFormat(this.props.filter.startTime, 'h:MM');
    time += ' - ';
    time += dateFormat(this.props.filter.endTime, 'h:MM TT');
    return (
      <Text style={styles.timeFilter}>{time}</Text>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    width,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  hlightSave: {
    margin: 10,
    alignSelf: 'center',
  },
  btnSave: {
    height: 38,
    width: 140,
  },
  filter: {
    position: 'absolute',
    left: width * 0.1,
    top: 30,
  },
  dayFilter: {
    position: 'absolute',
    width: 80,
    left: 70,
    fontSize: 12,
    bottom: 19,
  },
  timeFilter: {
    position: 'absolute',
    width: 100,
    left: 157,
    fontSize: 12,
    bottom: 19,
  },
  filterBtn: {
    width: width * 0.8,
    height: width * 0.14,
  },
});
