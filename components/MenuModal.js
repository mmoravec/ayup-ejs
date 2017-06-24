import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Linking,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {
  MaterialIcons,
} from '@expo/vector-icons';
import { connect } from 'react-redux';
import MyText from './common/MyText';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect((data) => EventListModal.getDataProps(data))
export default class EventListModal extends React.Component {


  static getDataProps(data) {
    return {
      phone: data.phone,
    };
  }

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
        Animated.parallel([
          Animated.timing(this.state.opacity, {toValue:1, duration: 500}),
          Animated.spring(this.state.secRowBottom, {toValue:140, tension: 60, friction: 6, velocity: 300}),
          Animated.spring(this.state.firstRowMarg, {toValue:(width * 0.6), tension: 60, friction: 6, velocity: 300}),
          Animated.spring(this.state.secRowMarg, {toValue:(width * 0.35), tension: 60, friction: 6, velocity: 300}),
          Animated.spring(this.state.thirdRowBottom, {toValue:165, tension: 60, friction: 6, velocity: 300}),
        ]).start();
    }
    return (
      <Modal
        animationType={"none"}
        transparent
        onRequestClose={this.props.menuBtnPress}
        visible={this.props.menuVisible}>
        <View style={styles.container}>
          <View style={styles.feedback}>
            <MyText style={{fontSize: 14, margin: 25}}>
              Ayup: beta 1.0 - unreleased
            </MyText>
          </View>
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
            <TouchableOpacity underlayColor="transparent" onPress={this._settingsBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_settings.png')}
                style={styles.btnAction}
              />
            </TouchableOpacity>
            <MyText style={styles.text}>Settings</MyText>
          </Animated.View>
          <Animated.View
            style={[styles.ctnActivities,
            {
              opacity: this.state.opacity,
              right: this.state.secRowMarg,
              bottom: this.state.secRowBottom,
            }]}>
            <TouchableOpacity underlayColor="transparent" onPress={this._activitiesBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_activities.png')}
                style={styles.btnAction}
              />
            </TouchableOpacity>
            <MyText style={styles.text}>Activities</MyText>
          </Animated.View>
          <Animated.View
            style={[styles.ctnProfile,
            {
              opacity: this.state.opacity,
              bottom: this.state.secRowBottom,
              left: this.state.secRowMarg,
            }]}>
            <TouchableOpacity underlayColor="transparent" onPress={this._newEventBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_new_event.png')}
                style={styles.btnAction}
              />
            </TouchableOpacity>
            <MyText style={styles.text}>New Event</MyText>
          </Animated.View>
          <Animated.View
            style={[styles.ctnEvents,
            {
              opacity: this.state.opacity,
              left: this.state.firstRowMarg,
            }]}>
            <TouchableOpacity underlayColor="transparent" onPress={this._myEventBtnPress}>
              <Image
                source={require('../assets/images/menu/btn_events.png')}
                style={styles.btnAction}
              />
            </TouchableOpacity>
            {
              (this.props.phone.myEventAlert > 0) &&
              <Image
                source={require('../assets/images/alertBadge.png')}
                style={styles.myEventBadge}>
                <MyText style={{fontSize: 14, marginTop: 6, marginLeft: 10}}>
                  {this.props.phone.myEventAlert}
                </MyText>
              </Image>
            }
            <MyText style={styles.text}>My Events</MyText>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  // <Animated.View
  //   style={[styles.ctnNewEvent,
  //   {
  //     opacity: this.state.opacity,
  //     left: this.state.firstRowMarg,
  //   }]}>
  //   <TouchableOpacity underlayColor="transparent" onPress={this._profileBtnPress}>
  //     <Image
  //       source={require('../assets/images/menu/btn_profile.png')}
  //       style={styles.btnAction}
  //       opacity={0.4}
  //     />
  //   </TouchableOpacity>
  // </Animated.View>

  _newEventBtnPress = () => {
    this._resetAnimState();
    this.props.navAway();
    this.props.dispatch(Actions.routeChange('NewEvent'));
  }

  _activitiesBtnPress = () => {
    this._resetAnimState();
    this.props.navAway();
    this.props.dispatch(Actions.routeChange('Activities'));
  }

  _settingsBtnPress = () => {
    this._resetAnimState();
    this.props.navAway();
    this.props.dispatch(Actions.routeChange('Settings'));
  }

  // _profileBtnPress = () => {
  //   this._resetAnimState();
  //   this.props.navAway();
  //   this.props.dispatch(Actions.routeChange('Profile'));
  // }

  _myEventBtnPress = () => {
    this._resetAnimState();
    this.props.navAway();
    this.props.dispatch(Actions.routeChange('MyEvents'));
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
  feedback: {
    alignSelf: 'center',
    top: 100,
    flexDirection: 'row',
  },
  btnMain: {
    width: 150,
    height: 150,
  },
  ctnSettings: {
    position: 'absolute',
    left: 0,
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAction: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  ctnActivities: {
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnProfile: {
    position: 'absolute',
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctnEvents: {
    position: 'absolute',
    right: 0,
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myEventBadge: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: 85,
    top: 0,
  },
  ctnNewEvent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
  },
  text: {
    color: "#666666",
    fontSize: 16,
  },
});
