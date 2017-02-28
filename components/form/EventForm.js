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
    focus: [
      {stateKey: 'title', focus: false},
      {stateKey: 'desc', focus: false},
      {stateKey: 'location', focus: false},
      {stateKey: 'startDate', focus: false},
      {stateKey: 'endDate', focus: false},
    ],
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    let isEditable = true;
    return (
      <View style={styles.scrollView}>
        <ScrollView
          ref="scrollView"
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={styles.form}>
          <ActivitySelector />
          <View style={[styles.input, styles.topInput]}>
            <Hoshi
              onChangeText={(text) => this.setState({title: text})}
              editable={isEditable}
              style={styles.hoshi}
              onFocus={this._focusElement.bind(this, 'title')}
              label={'Title'}
              borderColor={'#8bd1c6'}
              ref={'title'}
            />
          </View>
          <View style={styles.input}>
            <Hoshi
              onChangeText={(text) => this.setState({desc: text})}
              editable={isEditable}
              onFocus={this._focusElement.bind(this, 'desc')}
              label={'Description'}
              borderColor={'#8bd1c6'}
            />
          </View>
          <View style={styles.input}>
            <LocationSearch
              scrollTo={this._scrollTo}
              onFocus={this._focusElement.bind(this, 'location')}
              location={this.state.location}
              focus={this.state.focus}
              onChange={this._changeLocation} />
          </View>
          <View style={styles.input}>
            <TimeSelector
              focus={this.state.focus}
              onFocus={this._focusElement}
              date={this.state.startDate}
              label={'Start Date'}
              onChange={this._onChange}
              stateKey={'startDate'}
            />
          </View>
          <View style={styles.input}>
            <TimeSelector
              ref="endDate"
              focus={this.state.focus}
              onFocus={this._focusElement}
              date={this.state.endDate}
              label={'End Date'}
              onChange={this._onChange}
              stateKey={'endDate'}
            />
          </View>
          <View style={styles.btmPadding} />
        </ScrollView>
      </View>
    );
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

  _changeLocation = (name, ltlng) => {
    this.setState({location: name, latlng: ltlng});
  }

  _onChange = (key, value) => {
    let obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  _scrollTo = (num) => {
    this.refs.scrollView.scrollTo({y: num, animated: true});
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
