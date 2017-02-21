import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import Actions from '../state/Actions';
import Form from '../components/EventForm';
const {height, width} = Dimensions.get('window');


@connect()
export default class NewEventScreen extends React.Component {

  render() {
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <TouchableHighlight underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableHighlight>
        <Form />
        <View style={styles.bottom}>
          <TouchableHighlight
            underlayColor="transparent"
            style={styles.hlightSave}
            onPress={this._saveBtnPress}>
            <Image
              style={styles.btnSave}
              source={require('../assets/images/btn_save.png')}
            />
          </TouchableHighlight>
        </View>
      </Image>
    );
  }
  _onDateChange = (date) => {

  }
  _backBtnPress = () => {
    this.props.navigator.pop();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
  },
  hlightSave: {
    alignSelf: 'center',
  },
  btnBack: {
    width: 40,
    height: 40,
    margin: 15,
  },
  bottom: {
    position: 'absolute',
    backgroundColor: '#AF3',
    bottom: 0,
    height: height * 0.1,
    width,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnSave: {
    height: 38,
    width: 140,
  },
});
