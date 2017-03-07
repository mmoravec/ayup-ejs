import React from 'react';
import {
  Text,
} from 'react-native';

export default class MyText extends React.Component {
    render() {
      return (
        <Text style={{fontFamily: 'LatoRegular'}} {...this.props} ></Text>
      );
    }
}
