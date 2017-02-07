import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import Actions from '../state/Actions';

@connect()
export default class EventListModal extends React.Component {

  render() {
    //TODO: Finish filling in listview
    return (
      <Modal
        animationType={"none"}
        transparent={true}
        visible={this.props.menuVisible}>
        <View style={styles.container}>
          <View style={styles.btnMainContainer}>
            <TouchableHighlight underlayColor="transparent" onPress={this.props.menuBtnPress}>
              <Image
                source={require('../assets/images/btn_menu_close.png')}
                style={styles.btnMain}
              />
            </TouchableHighlight>
            <TouchableHighlight underlayColor="transparent" onPress={this._settingsBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_settings.png')}
                style={styles.btnSettings}
              />
            </TouchableHighlight>
            <TouchableHighlight underlayColor="transparent" onPress={this._activitiesBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_activities.png')}
                style={styles.btnActivities}
              />
            </TouchableHighlight>
            <TouchableHighlight underlayColor="transparent" onPress={this._profileBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_profile.png')}
                style={styles.btnProfile}
              />
            </TouchableHighlight>
            <TouchableHighlight underlayColor="transparent" onPress={this._myEventBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_events.png')}
                style={styles.btnEvents}
              />
            </TouchableHighlight>
            <TouchableHighlight underlayColor="transparent" onPress={this._newEventBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_new_event.png')}
                style={styles.btnNewEvent}
              />
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }

  _newEventBtnPress = () => {
    this.props.menuBtnPress();
    this.props.dispatch(Actions.routeChange('newEvent'));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
  },
  btnMainContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMain: {
    width: 110,
    height: 110,
  },
  btnSettings: {
    width: 40,
    height: 54,
    position: 'absolute',
    bottom: 40,
    right: 90,
  },
  btnActivities: {
    width: 61,
    height: 48,
    position: 'absolute',
    bottom: 110,
    right: 50,
  },
  btnProfile: {
    width: 41,
    height: 58,
    position: 'absolute',
    bottom: 140,
    left: -21,
  },
  btnEvents: {
    width: 48,
    height: 57,
    position: 'absolute',
    bottom: 110,
    left: 55,
  },
  btnNewEvent: {
    width: 53,
    height: 55,
    position: 'absolute',
    bottom: 40,
    left: 90,
  },
});
