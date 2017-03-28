import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Actions from '../state/Actions';
import Form from '../components/form/EventForm';
const {height, width} = Dimensions.get('window');


@connect()
export default class NewEventScreen extends React.Component {

  render() {
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <TouchableOpacity style={styles.ctnBack} underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableOpacity>
        <Form />
        <View style={styles.bottom}>
          <TouchableOpacity
            underlayColor="transparent"
            style={styles.hlightSave}
            onPress={this._saveBtnPress}>
            <Image
              style={styles.btnSave}
              source={require('../assets/images/btn_save.png')}
            />
          </TouchableOpacity>
        </View>
      </Image>
    );
  }
  _onDateChange = (date) => {

  }
  _backBtnPress = () => {
    this.props.dispatch(Actions.routeChange('Back'));
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
  ctnBack: {
    position: 'absolute',
    zIndex: 2,
  },
  bottom: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
