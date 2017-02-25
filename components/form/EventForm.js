import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';
import LocationSearch from './LocationSearch';
import ActivitySelector from './ActivitySelector';
import TimeSelector from './TimeSelector';
import Hoshi from '../common/Hoshi';
const {height, width} = Dimensions.get('window');
const dateFormat = require('dateformat');

@connect()
export default class EventForm extends React.Component {

  state = {
    startDate: '',
    endDate: '',
    title: 'title placeholder',
    desc: 'sample desc',
    location: '',
    latlng: null,
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    let isEditable = true;
    return (
      <View style={styles.scrollView}>
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={styles.form}>
          <ActivitySelector />
          <View style={[styles.input, styles.topInput]}>
            <Hoshi
              onChangeText={(text) => this.setState({title: text})}
              editable={isEditable}
              style={styles.hoshi}
              onFocus={this._inputFocused}
              label={'Title'}
              borderColor={'#8bd1c6'}
            />
          </View>
          <View style={styles.input}>
            <Hoshi
              onChangeText={(text) => this.setState({desc: text})}
              editable={isEditable}
              onFocus={this._inputFocused}
              label={'Description'}
              borderColor={'#8bd1c6'}
            />
          </View>
          <View style={styles.input}>
            <LocationSearch location={this.state.location} onChange={this._changeLocation} />
          </View>
          <View style={styles.input}>
            <TimeSelector date={this.state.startDate} label={'Start Date'} onChange={this._onChange} stateKey={'startDate'} />
          </View>
          <View style={styles.input}>
            <TimeSelector date={this.state.endDate} label={'End Date'} onChange={this._onChange} stateKey={'endDate'} />
          </View>
          <View style={styles.btmPadding} />
        </ScrollView>
      </View>
    );
  }

  _changeLocation = (name, ltlng) => {
    this.setState({location: name, latlng: ltlng});
  }

  _onChange = (key, value) => {
    let obj = {};
    obj[key] = value;
    this.setState(obj);
  }

}

const styles = StyleSheet.create({
  btmPadding: {
    height: height * 0.5,
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
    backgroundColor: '#fff',
  },
  topInput: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  hoshi: {
    paddingTop: 10,
  },
});
