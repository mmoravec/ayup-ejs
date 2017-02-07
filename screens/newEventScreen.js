import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');


@connect()
export default class NewEventScreen extends React.Component {

  state = {
    date: "2017-02-07",
  }

  render() {
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <TouchableHighlight underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableHighlight>
        <View style={styles.form}>
          <View style={styles.halfHeight}>
            <Text>HELLO</Text>
          </View>
        </View>
      </Image>
    );
  }
  _onDateChange = (date) => {
    console.log(date);
  }
  _backBtnPress = () => {
    this.props.dispatch(Actions.routeChange('home'));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
  },
  halfHeight: {
    backgroundColor: '#FF3366',
  },
  form: {
    width: width * 0.9,
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.05,
    height: height * 0.8,
    backgroundColor: '#FFF',
  },
  quarterHeight: {
    flex: 1,
    backgroundColor: '#000'
  },
  btnBack: {
    width: 30,
    height: 30,
    margin: 15,
  },
});
