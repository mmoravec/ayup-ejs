import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';
import MyText from './common/MyText';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect((data) => EventButton.getDataProps(data))
export default class EventButton extends React.Component {

  static getDataProps(data) {
    return {
      phone: data.phone,
      selectedEvent: data.events.selectedEvent,
      user: data.user,
    };
  }

  state = {
    warn: false,
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    console.log(this.props.phone.status);
    if (this.props.phone.status === '') {
      //If invited to event
      if (this.props.user.id !== this.props.selectedEvent.host.userID) {
        if (this.props.user.invited.indexOf(this.props.selectedEvent.id) > -1) {
          return (
            <View style={styles.bottom}>
              <TouchableOpacity
                underlayColor="transparent"
                style={styles.hlightSave}
                onPress={this._goingBtnPress}>
                <Image
                  style={styles.btn}
                  source={require('../assets/images/btn_going.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                underlayColor="transparent"
                style={styles.hlightSave}
                onPress={this._cantmakeitBtnPress}>
                <Image
                  style={styles.btn}
                  source={require('../assets/images/btn_cantmakeit.png')}
                />
              </TouchableOpacity>
            </View>
          );
        } else if (this.props.user.requested.indexOf(this.props.selectedEvent.id) < 0 &&
                    this.props.user.rejected.indexOf(this.props.selectedEvent.id) < 0 &&
                    this.props.user.joined.indexOf(this.props.selectedEvent.id) < 0 &&
                    this.props.user.invited.indexOf(this.props.selectedEvent.id) < 0) {
          return (
            <View style={styles.bottom}>
              <TouchableOpacity
                underlayColor="transparent"
                style={styles.hlightSave}
                onPress={this._joinBtnPress}>
                <Image
                  style={styles.btnJoin}
                  source={require('../assets/images/btn_join.png')}
                />
              </TouchableOpacity>
            </View>
          );
        }
      }
      return null;
    } else if (this.props.phone.status === 'success') {
      return (
        <View style={styles.woohoo}>
          <MyText style={styles.success}> Success! </MyText>
        </View>
      );
    } else if (this.props.phone.status === 'error') {
      return (
        <View style={styles.warn}>
          <MyText style={{fontSize: 16, color: '#fff', textAlign: 'center'}}>
            Something went wrong :(
          </MyText>
        </View>
      );
    } else {
      return <ActivityIndicator />;
    }
  }


  _warnUser = () => {
    this.setState({warn: true});
    setTimeout(() => this.setState({warn: false}), 2000);
  }

  _goingBtnPress = () => {
    this.props.dispatch(Actions.joinEvent(this.props.selectedEvent.id));
  }

  _cantmakeitBtnPress = () => {
    this.props.dispatch(Actions.rejectEvent(this.props.selectedEvent.id, this.props.user.id));
  }

  _joinBtnPress = () => {
    this.props.dispatch(Actions.requestEvent(this.props.selectedEvent.id));
  }

  _renderWarning = () => {
    if (this.state.warn) {
      return (
        <View style={styles.warn}>
          <MyText style={{fontSize: 16, color: '#fff', textAlign: 'center'}}>
            Request Failed
          </MyText>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    bottom: 0,
    height: height * 0.1,
    width,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    height: 50,
    width: 138,
  },
  btnJoin: {
    height: 38,
    width: 115,
  },
  warn: {
    position: 'absolute',
    height: height * 0.1,
    width,
    backgroundColor: '#ee366f',
    justifyContent: 'center',
  },
  woohoo: {
    position: 'absolute',
    height: height * 0.1,
    width,
    backgroundColor: '#8bd1c6',
    justifyContent: 'center',
  },
  hlightSave: {
    alignSelf: 'center',
  },
  success: {
    fontSize: 18,
    alignSelf: 'center',
    color: '#fff',
  },
});
