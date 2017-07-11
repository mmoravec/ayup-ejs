import _ from 'lodash';
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
import ActionTypes from "../../state/ActionTypes";
const {height, width} = Dimensions.get('window');

@connect((data) => SaveButton.getDataProps(data))
export default class SaveButton extends React.Component {

  static getDataProps(data) {
    return {
      phone: data.phone,
      form: data.form,
      event: data.events.selectedEvent,
      profile: data.profile,
    };
  }

  state = {
    warn: false,
    warnMessage: "Please fill out Title, Start Date, End Date, and Location",
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
    if (this.props.phone.status === ActionTypes.INACTIVE) {
      if (this.props.form.status === "create") {
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
      } else {
        return (
          <TouchableOpacity
            underlayColor="transparent"
            style={styles.hlightSave}
            onPress={this._updateBtnPress}>
            <Image
              style={styles.btnSave}
              source={this.props.image2}
            />
          </TouchableOpacity>
        );
      }
    } else if (this.props.phone.status === ActionTypes.SUCCESS) {
      return (
        <View style={styles.woohoo}>
          <MyText style={styles.success}> Success! </MyText>
        </View>
      );
    } else if (this.props.phone.status === ActionTypes.ERROR) {
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
    let eventState = this.props.form;
    if (eventState.startDate.value === "" || eventState.endDate.value === "" || eventState.title.value === "" || eventState.location.value === "") {
      this.setState({warnMessage: "Please fill out Title, Start Date, End Date, and Location"});
      this._warnUser();
    } else if (eventState.startDate.value < new Date()) {
      this.setState({warnMessage: "Start time cannot be in the past. Please udpate."});
      this._warnUser();
    } else {
    let invited = [];
    eventState.friends.value.map(friend => {
      //TODO: update this to be id instead fbid
      invited.push({
        id: friend.item.ayup_id,
        name: friend.item.name,
        profile_pic: friend.item.profile_pic,
      });
    });
    let event = {
      start_time: eventState.startDate.value.toISOString(),
      end_time: eventState.endDate.value.toISOString(),
      title: eventState.title.value,
      private: eventState.private.value,
      description: eventState.desc.value,
      location: {
        coordinates: eventState.location.lnglat,
        text: eventState.location.value,
      },
      destination: {
        coordinates: eventState.dest.lnglat,
        text: eventState.dest.value,
      },
      invited,
      activity: eventState.activity.value,
      capacity: eventState.capacity.value,
      age_group: this.props.profile.age_group,
    };
    eventState.map((val, key) => {
      if (!val.shown) {
        delete event[key];
      }
    });
      this.props.dispatch(Actions.saveEvent(event));
    }
  }

   _updateBtnPress = () => {
    let eventState = this.props.form;
    if (eventState.startDate.value === "" || eventState.endDate.value === "" || eventState.title.value === "" || eventState.location.value === "") {
      this.setState({warnMessage: "Please fill out Title, Start Date, End Date, and Location"});
      this._warnUser();
    } else {
    let event = {
      start_time: eventState.startDate.value.toISOString(),
      end_time: eventState.endDate.value.toISOString(),
      title: eventState.title.value,
      private: eventState.private.value,
      description: eventState.desc.value,
      location: {
        coordinates: eventState.location.lnglat,
        text: eventState.location.value,
      },
      destination: {
        coordinates: eventState.dest.lnglat,
        text: eventState.dest.value,
      },
      activity: eventState.activity.value,
      capacity: eventState.capacity.value,
      age_group: this.props.profile.age_group,
    };
    this.props.dispatch(Actions.updateEvent(event, this.props.event.id));
    }
  }

  _renderWarning = () => {
    if (this.state.warn) {
      return (
        <View style={styles.warn}>
          <MyText style={{fontSize: 16, color: '#fff', textAlign: 'center'}}>
            {this.state.warnMessage}
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
