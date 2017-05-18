import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  DatePickerAndroid,
  Platform,
  DatePickerIOS,
  TimePickerAndroid,
} from 'react-native';
import Hoshi from '../common/Hoshi';
const dismissKeyboard = require('dismissKeyboard');
const dateFormat = require('dateformat');

export default class TimeSelector extends React.Component {

  state = {
    focusDate: false,
    hasFocused: false,
  }
  _yOffset = 0;

  componentDidMount() {
    setTimeout(() => {
      this._view.measure((fx, fy, width, height, px, py) => {
        this._scrollY = py;
      });
    }, 200);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.focus) {
      this.setState({focusDate: true});
      this.setState({hasFocused: true});
      dismissKeyboard();
    } else {
      this.setState({focusDate: false});
    }
  }

  render() {
    let time = "";
    if (this.props.value !== '') {
      time = dateFormat(this.props.value, 'ddd h:MM TT, mmm dd');
    }
    return (
      <TouchableHighlight
        onPress={this._onDatePress}
        ref={view => { this._view = view; }}
        underlayColor={'#f1f1f1'}>
        <View>
          <View pointerEvents={'none'}>
            <Hoshi
              value={time}
              editable={false}
              label={this.props.label}
              borderColor={'#8bd1c6'}
              onFocus={this._onDatePress}
            />
          </View>
          {this._renderDate()}
        </View>
      </TouchableHighlight>
    );
  }

  _getNextTime = () => {
    let date = new Date();
    let time = date.getTime();
    let mint = date.getMinutes();
    let nDate = new Date(time + (Math.ceil((mint / 15)) * 15 - mint) * 60000);
    return nDate;
  }

  _renderDate = () => {
    if (this.state.focusDate && Platform.OS === 'ios') {
      let date = this.props.value;
      return (
        <DatePickerIOS
          date={date}
          mode="datetime"
          minuteInterval={15}
          onDateChange={this._onChange}
        />
      );
    } else {
      return null;
    }
  }

  _onChange = (date) => {
    this.props.onChange(this.props.stateKey, date);
  }

  _onDatePress = async () => {
    this._onChange(this.props.value instanceof Date ? this.props.value : this._getNextTime());
    this.props.onFocus(this.props.stateKey);
    if (Platform.OS === 'android') {
      let date, time;
      let now = new Date();
      try {
        date = await DatePickerAndroid.open({date: now});
        if (date.action === DatePickerAndroid.dismissedAction) {
          return;
        }
      } catch ({code, message}) {
        console.warn(`Error in Android DatePicker`, message);
      }
      try {
        time = await TimePickerAndroid.open({hour: now.getHours(), minute: now.getMinutes()});
        if (time.action === TimePickerAndroid.dismissedAction) {
          return;
        }
      } catch ({code, message}) {
        console.warn(`Error in Android TimePicker`, message);
      }
      let minute = Math.round(time.minute / 15) * 15;
      let d = new Date(date.year, date.month, date.day, time.hour, minute);
      this._onChange(d);
    } else {
      this.props.scrollTo(this._scrollY - 80);
    }
  }

}

const styles = StyleSheet.create({
});
