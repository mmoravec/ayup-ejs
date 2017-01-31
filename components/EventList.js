import React from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';

@connect((data, props) => EventList.getDataProps(data, props))
export default class EventList extends React.Component {
  static getDataProps(data, props) {
    console.log(data);
    console.log(props);
    return data;
  }

  render() {
    return (
      <View />
    );
  }
}
