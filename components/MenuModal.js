import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect()
export default class EventListModal extends React.Component {

  state = {
    opacity: new Animated.Value(0),
    firstRowMarg: new Animated.Value(0),
    secRowBottom: new Animated.Value(20),
    secRowMarg: new Animated.Value(0),
    thirdRowBottom: new Animated.Value(20),
  }

  render() {
    //TODO: Finish filling in listview
    if (this.props.menuVisible) {
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(this.state.opacity, {toValue:1, duration: 500}),
          Animated.spring(this.state.secRowBottom, {toValue:125, tension: 60, friction: 6, velocity: 300}),
          Animated.spring(this.state.firstRowMarg, {toValue:(width * 0.6), tension: 60, friction: 6, velocity: 300}),
          Animated.spring(this.state.secRowMarg, {toValue:(width * 0.4), tension: 60, friction: 6, velocity: 300}),
          Animated.spring(this.state.thirdRowBottom, {toValue:175, tension: 60, friction: 6, velocity: 300}),
        ]),
        ]).start();
    }
    return (
      <Modal
        animationType={"none"}
        transparent={true}
        onRequestClose={this.props.menuBtnPress}
        visible={this.props.menuVisible}>
        <View style={styles.container}>
          <Animated.View style={styles.btnMainContainer}>
            <TouchableOpacity
              onPress={this._menuBtnPress}>
              <Image
                source={require('../assets/images/btn_menu_close.png')}
                style={styles.btnMain}
              />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[styles.ctnSettings,
            {
              opacity: this.state.opacity,
              right: this.state.firstRowMarg,
            }]}>
            <TouchableHighlight underlayColor="transparent" onPress={this._settingsBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_settings.png')}
                style={styles.btnSettings}
              />
            </TouchableHighlight>
          </Animated.View>
          <Animated.View
            style={[styles.ctnActivities,
            {
              opacity: this.state.opacity,
              right: this.state.secRowMarg,
              bottom: this.state.secRowBottom,
            }]}>
            <TouchableHighlight underlayColor="transparent" onPress={this._activitiesBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_activities.png')}
                style={styles.btnActivities}
              />
            </TouchableHighlight>
          </Animated.View>
          <Animated.View
            style={[styles.ctnProfile,
            {
              opacity: this.state.opacity,
              bottom: this.state.thirdRowBottom,
            }]}>
            <TouchableHighlight underlayColor="transparent" onPress={this._profileBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_profile.png')}
                style={styles.btnProfile}
              />
            </TouchableHighlight>
          </Animated.View>
          <Animated.View
            style={[styles.ctnEvents,
            {
              opacity: this.state.opacity,
              left: this.state.secRowMarg,
              bottom: this.state.secRowBottom,
            }]}>
            <TouchableHighlight underlayColor="transparent" onPress={this._myEventBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_events.png')}
                style={styles.btnEvents}
              />
            </TouchableHighlight>
          </Animated.View>
          <Animated.View
            style={[styles.ctnNewEvent,
            {
              opacity: this.state.opacity,
              left: this.state.firstRowMarg,
            }]}>
            <TouchableHighlight underlayColor="transparent" onPress={this._newEventBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_new_event.png')}
                style={styles.btnNewEvent}
              />
            </TouchableHighlight>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  _newEventBtnPress = () => {
    this._resetAnimState();
    this.props.navAway();
    this.props.dispatch(Actions.routeChange('newEvent'));
  }

  _activitiesBtnPress = () => {
    this._resetAnimState();
    this.props.navAway();
    this.props.dispatch(Actions.routeChange('activities'));
  }

  _settingsBtnPress = () => {
    this._resetAnimState();
    this.props.navAway();
    this.props.dispatch(Actions.routeChange('settings'));
  }

  _menuBtnPress = () => {
    this._resetAnimState();
    this.props.menuBtnPress();
  }

  _resetAnimState = () => {
    this.setState({
      opacity: new Animated.Value(0.1),
      firstRowMarg: new Animated.Value(0),
      secRowBottom: new Animated.Value(20),
      secRowMarg: new Animated.Value(0),
      thirdRowBottom: new Animated.Value(20),
    });
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
  ctnSettings: {
    position: 'absolute',
    left: 0,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSettings: {
    width: 53,
    height: 72,
  },
  btnActivities: {
    width: 81,
    height: 64,
  },
  ctnActivities: {
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnProfile: {
    width: 55,
    height: 77,
  },
  ctnProfile: {
    position: 'absolute',
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEvents: {
    width: 64,
    height: 76,
  },
  ctnEvents: {
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNewEvent: {
    width: 71,
    height: 73,
  },
  ctnNewEvent: {
    position: 'absolute',
    right: 0,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
