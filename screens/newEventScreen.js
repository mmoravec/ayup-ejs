import _ from "lodash";
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


@connect((data) => NewEventScreen.getDataProps(data))
export default class NewEventScreen extends React.Component {

    static getDataProps(data) {
    return {
      form: data.form,
    };
  }

  state = {
    warn: false,
  }

  render() {
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <Form />
        {
          (Platform.OS === 'ios') &&
          <TouchableOpacity style={styles.ctnBack} underlayColor="transparent" onPress={this._backBtnPress}>
            <Image
              source={require('../assets/images/btn_back.png')}
              style={styles.btnBack}
            />
          </TouchableOpacity>
        }
      </Image>
    );
  }
  _backBtnPress = _.debounce(() => {
    if (this.props.form.status === "update") {
      this.props.dispatch(Actions.zeroForm());
    }
    this.props.dispatch(Actions.routeChange('Back'));
   }, 1000, {
    leading: true,
   });
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
  },
});
