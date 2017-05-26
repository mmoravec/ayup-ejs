import React from 'react';
import {
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Actions from '../state/Actions';
import Form from '../components/form/EventForm';


@connect()
export default class NewEventScreen extends React.Component {

  state = {
    warn: false,
  }

  render() {
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        {
          (Platform.OS === 'ios') &&
          <TouchableOpacity style={styles.ctnBack} underlayColor="transparent" onPress={this._backBtnPress}>
            <Image
              source={require('../assets/images/btn_back.png')}
              style={styles.btnBack}
            />
          </TouchableOpacity>
        }
        <Form />
      </Image>
    );
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
  btnBack: {
    width: 80,
    height: 80,
  },
  ctnBack: {
    position: 'absolute',
    zIndex: 2,
  },
});
