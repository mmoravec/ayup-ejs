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
import MyText from '../common/MyText';
import Actions from '../../state/Actions';
const {height, width} = Dimensions.get('window');

@connect((data) => SaveButton.getDataProps(data))
export default class SaveButton extends React.Component {

  static getDataProps(data) {
    return {
      phone: data.phone,
    };
  }

  state = {
    warn: false,
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View style={styles.bottom}>
        {this._renderCreate()}
        {this._renderWarning()}
      </View>
    );
  }

  _renderCreate = () => {
    if (this.props.phone.status === '') {
      return (
        <TouchableOpacity
          underlayColor="transparent"
          style={styles.hlightSave}
          onPress={this._saveBtnPress}>
          <Image
            style={styles.btnSave}
            source={this.props.image}
          />
        </TouchableOpacity>
      );
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

  _saveBtnPress = () => {
    let eventState = this.props.event;
    let invited = [];
    eventState.friends.map(friend => {
      invited.push({
        fbid: friend.fbid,
        profilePic: friend.profilePic,
        name: friend.name,
      });
    });
    let event = {
      startDate: eventState.startDate.toISOString(),
      endDate: eventState.endDate.toISOString(),
      title: eventState.title,
      private: eventState.private,
      desc: eventState.desc,
      location: {
        coordinates: eventState.latlng,
        text: eventState.location,
      },
      invited,
      activity: eventState.activity,
      capacity: eventState.capacity,
    };
    if (event.startDate === "" || event.endDate === "" || event.title === "" || event.location === "") {
      this._warnUser();
    } else {
      this.props.dispatch(Actions.saveEvent(event));
    }
  }

  _renderWarning = () => {
    if (this.state.warn) {
      return (
        <View style={styles.warn}>
          <MyText style={{fontSize: 16, color: '#fff', textAlign: 'center'}}>
            {this.props.warnMessage}
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
  btnSave: {
    height: 38,
    width: 140,
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
