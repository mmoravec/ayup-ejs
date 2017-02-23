import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Text,
  DatePickerIOS,
  Image,
  ScrollView,
  TouchableOpacity,
  DatePickerAndroid,
  TimePickerAndroid,
  LayoutAnimation,
} from 'react-native';
import { Components } from 'exponent';
import { connect } from 'react-redux';
import Hoshi from './common/Hoshi';
import ActivitySelector from './ActivitySelector';
const {height, width} = Dimensions.get('window');
const dateFormat = require('dateformat');
const { Svg } = Components;

@connect()
export default class EventForm extends React.Component {

  state = {
    startDate: new Date(),
    startText: 'dismissed',
    endDate: new Date(),
    title: 'title placeholder',
    desc: 'sample desc',
    focusMap: false,
    location: 'meow',
    isEditable: true,
    focusStartDate: false,
    focusEndDate: false,
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View style={styles.scrollView}>
        <ScrollView
          contentContainerStyle={styles.form}>
          <ActivitySelector />
          <View style={styles.input}>
            <Hoshi
              onChangeText={(text) => this.setState({title: text})}
              editable={this.state.isEditable}
              onFocus={this._inputFocused}
              label={'Title'}
              borderColor={'#8bd1c6'}
            />
          </View>
          <View style={styles.input}>
            <Hoshi
              onChangeText={(text) => this.setState({desc: text})}
              editable={this.state.isEditable}
              onFocus={this._inputFocused}
              label={'Description'}
              borderColor={'#8bd1c6'}
            />
          </View>
          <View style={styles.input}>
            <Hoshi
              onChangeText={(location) => this.setState({location})}
              editable={this.state.isEditable}
              label={'Location'}
              borderColor={'#8bd1c6'}
            />
          </View>
          <TouchableOpacity onPress={this._onStartDatePress} style={styles.input}>
            <Hoshi
              value={this.state.startDate.toString()}
              editable={false}
              label={'Start Time'}
              borderColor={'#8bd1c6'}
            />
            {this._renderStartDate()}
          </TouchableOpacity>
          <TouchableOpacity onPress={this._onEndDatePress} style={styles.input}>
            <Hoshi
              value={this.state.endDate.toString()}
              editable={false}
              label={'End Time'}
              borderColor={'#8bd1c6'}
              onFocus={() => this.setState({focusMap: !this.state.focusEndDate})}
              onBlur={() => this.setState({focusMap: !this.state.focusEndDate})}
            />
            {this._renderEndDate()}
          </TouchableOpacity>
          <View style={styles.btmPadding}>

          </View>
        </ScrollView>
      </View>
    );
  }

  _inputFocused = () => {
    this.setState({focusEndDate: false});
    this.setState({focusStartDate: false});
    this.setState({focusMap: false});
  }

  _onStartDatePress = () => {
    this.setState({focusStartDate: !this.state.focusStartDate});
    if (Platform.OS === 'android') {
      let result = this._showPicker('start', {date: this.state.startDate, mode: 'spinner'});
    }
  }

  _onEndDatePress = () => {
    this.setState({focusEndDate: !this.state.focusEndDate});
  }

  _onStartDateChange = (date) => {
    let d1 = Date.parse(date);
    let d2 = Date.parse(this.state.endDate);
    if (d2 < d1) {
      this.setState({endDate: date});
    }
    this.setState({startDate: date});
  }

  _onEndDateChange = (date) => {
    let d1 = Date.parse(date);
    let d2 = Date.parse(this.state.startDate);
    if (d1 < d2) {
      this.setState({endDate: this.state.startDate});
    } else {
      this.setState({endDate: date});
    }
  }

  _renderStartDate = () => {
    if (this.state.focusStartDate && Platform.OS === 'ios') {
      return (
        <DatePickerIOS
          date={this.state.startDate}
          mode="datetime"
          onDateChange={this._onStartDateChange}
        />
      );
    }
  }

  _renderEndDate = () => {
    if (this.state.focusEndDate) {
      if (Platform.OS === 'android') {
        return this._showPicker.bind(this, 'start', {date: this.state.endDate});
      } else {
        return (
          <DatePickerIOS
            date={this.state.endDate}
            mode="datetime"
            onDateChange={this._onEndDateChange}
          />
        );
      }
    }
  }

  _showPicker = async (stateKey, options) => {
    this.setState({startText: 'selecting'});
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      var newState = {};
      if (action === TimePickerAndroid.timeSetAction) {
        newState[stateKey + 'Text'] = this._formatTime(hour, minute);
        newState[stateKey + 'Hour'] = hour;
        newState[stateKey + 'Minute'] = minute;
      } else if (action === TimePickerAndroid.dismissedAction) {
        newState[stateKey + 'Text'] = 'dismissed';
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  _formatTime(hour, minute) {
    return hour + ':' + (minute < 10 ? '0' + minute : minute);
  }

  _renderMapView = () => {
    if (this.state.focusMap) {
      return (
        <Components.MapView
          style={styles.mapView}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  btmPadding: {
    height: height * 0.1,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 10,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    height,
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  input: {
    paddingTop: 10,
    backgroundColor: '#fff',
  },
});
