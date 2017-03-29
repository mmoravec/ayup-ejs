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
import MyText from './MyText';
import Actions from '../../state/Actions';
const {height, width} = Dimensions.get('window');

@connect((data) => ActionButton.getDataProps(data))
export default class ActionButton extends React.Component {

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
        {this._renderCreate(this.props.image)}
        {this._renderWarning(this.props.warn)}
      </View>
    );
  }

  _renderCreate = (image) => {
    (this.props.phone);
    if (!this.props.phone.request) {
      return (
        <TouchableOpacity
          underlayColor="transparent"
          style={styles.hlightSave}
          onPress={this._saveBtnPress}>
          <Image
            style={styles.btnSave}
            source={image}
          />
        </TouchableOpacity>
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
      invited.push(friend.id);
    });
    let event = {
      starttime: eventState.startDate,
      endtime: eventState.endDate,
      title: eventState.title,
      desc: eventState.desc,
      location: {
        coordinates: eventState.latlng,
        text: eventState.location,
      },
      invited,
      activity: eventState.activity,
    };
    if (event.starttime === "" || event.endtime === "" || event.title === "" || event.location === "") {
      (this);
      this._warnUser();
    } else {
      this.props.dispatch(Actions.saveEvent(event));
    }
  }

  _renderWarning = () => {
    if (this.state.warn) {
      ('warning!');
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
  hlightSave: {
    alignSelf: 'center',
  },
});
