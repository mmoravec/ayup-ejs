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

export default class TimeSelector extends React.Component {

  state = {
    focusDate: false,
  }
  _yOffset = 0;

  componentWillReceiveProps(nextProps) {
    if (nextProps.focus.find(el =>
      el.stateKey === this.props.stateKey
    ).focus) {
      this.setState({focusDate: true});
      dismissKeyboard();
    } else {
      this.setState({focusDate: false});
    }
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this._onDatePress}
        underlayColor={'#f1f1f1'}>
        <View ref={view => { this._view = view; }}>
          <View ref="view" pointerEvents={'none'}>
            <Hoshi
              value={this.props.date.toString()}
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
    this.props.scrollTo();
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
    }
  }

}

const styles = StyleSheet.create({
});
