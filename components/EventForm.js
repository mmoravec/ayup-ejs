import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  DatePickerIOS,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import { Components } from 'exponent';
import { connect } from 'react-redux';
import Hoshi from './common/Hoshi';
const {height, width} = Dimensions.get('window');
const dateFormat = require('dateformat');

@connect()
export default class EventForm extends React.Component {

  state = {
    startTime: new Date(),
    endTime: new Date(),
    title: 'title placeholder',
    desc: 'sample desc',
    focusMap: false,
    location: 'meow',
    isEditable: true,
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View style={styles.scrollView}>
        <ScrollView
          contentContainerStyle={styles.form}>
          <View style={styles.input}>
            <Hoshi
              onChangeText={(text) => this.setState({title: text})}
              editable={this.state.isEditable}
              label={'Title'}
              borderColor={'#4eb9ec'}
              backgroundColor={'#FFF'}
            />
          </View>
          <View style={styles.input}>
            <Hoshi
              onChangeText={(text) => this.setState({desc: text})}
              editable={this.state.isEditable}
              label={'Description'}
              borderColor={'#4eb9ec'}
              backgroundColor={'#FFF'}
            />
          </View>
          <View style={styles.input}>
            <Hoshi
              onChangeText={(text) => this.setState({location: text})}
              editable={this.state.isEditable}
              label={'Location'}
              borderColor={'#FFF'}
              backgroundColor={'#FFF'}
              onFocus={() => this.setState({focusMap: !this.state.focusMap})}
              onBlur={() => this.setState({focusMap: !this.state.focusMap})}
            />
            {this._renderMapView()}
          </View>
          <View style={styles.time}>
            <Text style={styles.timeText}>Start Time</Text>
            <DatePickerIOS
              date={this.state.startTime}
              mode="datetime"
              onDateChange={this._onStartDateChange}
            />
          </View>
          <View style={styles.time}>
            <Text style={styles.timeText}>End Time</Text>
            <DatePickerIOS
              date={this.state.endTime}
              mode="datetime"
              onDateChange={this._onEndDateChange}
              style={styles.endTime}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  _onStartDateChange = (date) => {
    let d1 = Date.parse(date);
    let d2 = Date.parse(this.state.endTime);
    if (d2 < d1) {
      this.setState({endTime: date});
    }
    this.setState({startTime: date});
  }

  _onEndDateChange = (date) => {
    let d1 = Date.parse(date);
    let d2 = Date.parse(this.state.startTime);
    if (d1 < d2) {
      this.setState({endTime: this.state.startTime});
    } else {
      this.setState({endTime: date});
    }
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
  smallRow: {
    backgroundColor: '#FF3366',
    marginTop: 20,
    height: 30,
    flexDirection: 'row',
  },
  bigRow: {
    backgroundColor: '#FF3366',
    marginTop: 20,
    height: 100,
    flexDirection: 'row',
  },
  scrollView: {
    top: height * 0.1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    height: height * 0.7,
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  text: {
    width: width * 0.2,
    backgroundColor: '#FF3',
    textAlign: 'center',
    alignSelf: 'center',
  },
  time: {
    backgroundColor: '#FF3366',
    marginTop: 20,
    height: undefined,
    flexDirection: 'column',
  },
  location: {
    backgroundColor: '#FF3366',
    marginTop: 20,
    height: undefined,
    flexDirection: 'column',
  },
  locationText: {
    width: width * 0.2,
    backgroundColor: '#FF3',
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  timeText: {
    width: width * 0.2,
    backgroundColor: '#FF3',
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  input: {
    width: width * 0.88,
    paddingTop: 10,
  },
  mapView: {
    width: width * 0.7,
    height: width * 0.7,
  },
});
