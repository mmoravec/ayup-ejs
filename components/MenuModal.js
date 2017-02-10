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

  _activitiesBtnPress = () => {
    this.props.menuBtnPress();
    this.props.dispatch(Actions.routeChange('activities'));
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
    width: 150,
    height: 150,
  },
  btnSettings: {
    width: 53,
    height: 72,
    position: 'absolute',
    bottom: 40,
    right: 90,
  },
  btnActivities: {
    width: 81,
    height: 64,
    position: 'absolute',
    bottom: 125,
    right: 40,
  },
  btnProfile: {
    width: 55,
    height: 77,
    position: 'absolute',
    bottom: 160,
    left: -30,
  },
  btnEvents: {
    width: 64,
    height: 76,
    position: 'absolute',
    bottom: 125,
    left: 45,
  },
  btnNewEvent: {
    width: 71,
    height: 73,
    position: 'absolute',
    bottom: 40,
    left: 90,
  },
});
