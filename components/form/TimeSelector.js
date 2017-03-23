import React from 'react'
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
    if (nextProps.focus.find(el =>
      el.stateKey === this.props.stateKey
    ).focus) {
      this.setState({focusDate: true});
      this.setState({hasFocused: true});
      dismissKeyboard();
    } else {
      this.setState({focusDate: false});
    }
  }

  render() {
    let time = "";
    if (this.state.hasFocused) {
      time = dateFormat(this.props.date, 'ddd h:MM TT, mmm dd');
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


  _renderDate = () => {
    if (this.state.focusDate && Platform.OS === 'ios') {
      return (
        <DatePickerIOS
          date={this.props.date instanceof Date ? this.props.date : new Date()}
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
    this.props.onFocus(this.props.stateKey);
    if (Platform.OS === 'android') {
      let date, time;
      let now = new Date();
      try {
        date = await DatePickerAndroid.open({date: now});
        if (date.action === DatePickerAndroid.dismissedAction) {
        }
      } catch ({code, message}) {
        console.warn(`Error in Android DatePicker`, message);
      }
      try {
        time = await TimePickerAndroid.open({hour: now.getHours(), minute: now.getMinutes()});
        if (time.action === TimePickerAndroid.dismissedAction) {
        }
      } catch ({code, message}) {
        console.warn(`Error in Android TimePicker`, message);
      }

      let d = new Date(date.year, date.month, date.day, time.hour, time.minute);
      this._onChange(d);
    } else {
      this.props.scrollTo(this._scrollY - 80);
    }
  }

}

const styles = StyleSheet.create({
});
