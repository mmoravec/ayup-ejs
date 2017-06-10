import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  LayoutAnimation,
} from "react-native";
import { connect } from "react-redux";
import MyText from "../common/MyText";
import Actions from "../../state/Actions";
import ActionTypes from "../../state/Actions";
const { height, width } = Dimensions.get("window");

@connect(data => EventButton.getDataProps(data))
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
  };

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    let status = this._getStatus();
    if (this.props.phone.status === ActionTypes.INACTIVE) {
      //If invited to event
      if (status === "invited") {
        return (
          <View style={styles.bottom}>
            <TouchableOpacity
              underlayColor="transparent"
              style={styles.hlightSave}
              onPress={this._goingBtnPress}>
              <Image
                style={styles.btn}
                source={require("../../assets/images/btn_going.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              underlayColor="transparent"
              style={styles.hlightSave}
              onPress={this._cantmakeitBtnPress}>
              <Image
                style={styles.btn}
                source={require("../../assets/images/btn_cantmakeit.png")}
              />
            </TouchableOpacity>
          </View>
        );
      } else if (status === "uninvited") {
        return (
          <View style={styles.bottom}>
            <TouchableOpacity
              underlayColor="transparent"
              style={styles.hlightSave}
              onPress={this._joinBtnPress}>
              <Image
                style={styles.btnJoin}
                source={require("../../assets/images/btn_join.png")}
              />
            </TouchableOpacity>
          </View>
        );
      } else {
        return null;
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
          <MyText style={{ fontSize: 16, color: "#fff", textAlign: "center" }}>
            Something went wrong :(
          </MyText>
        </View>
      );
    } else {
      return (
        <View style={styles.bottom}>
          <ActivityIndicator />
        </View>
      );
    }
  }

  _getStatus = () => {
    let user = "uninvited";
    let event = this.props.selectedEvent;
    event.invited.map(e => {
      if (e.fbid === this.props.user.fbid) {
        user = "invited";
      }
    });
    event.requested.map(e => {
      if (e.fbid === this.props.user.fbid) {
        user = "requested";
      }
    });
    event.rejected.map(e => {
      if (e.fbid === this.props.user.fbid) {
        user = "rejected";
      }
    });
    event.going.map(e => {
      if (e.fbid === this.props.user.fbid) {
        user = "accepted";
      }
    });
    if (event.host.userID === this.props.user.id) {
      user = "host";
    }
    return user;
  };

  _warnUser = () => {
    this.setState({ warn: true });
    setTimeout(() => this.setState({ warn: false }), 2000);
  };

  _goingBtnPress = () => {
    this.props.dispatch(Actions.acceptEvent(this.props.selectedEvent.id));
  };

  _cantmakeitBtnPress = () => {
    this.props.dispatch(Actions.rejectEvent(this.props.selectedEvent.id));
  };

  _joinBtnPress = () => {
    this.props.dispatch(Actions.requestEvent(this.props.selectedEvent.id));
  };

  _renderWarning = () => {
    if (this.state.warn) {
      return (
        <View style={styles.warn}>
          <MyText style={{ fontSize: 16, color: "#fff", textAlign: "center" }}>
            Request Failed
          </MyText>
        </View>
      );
    } else {
      return null;
    }
  };
}

const styles = StyleSheet.create({
  bottom: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    bottom: 0,
    height: height * 0.1,
    width,
    flexDirection: "row",
    justifyContent: "space-around",
    zIndex: 3,
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
    position: "absolute",
    height: height * 0.1,
    width,
    backgroundColor: "#ee366f",
    justifyContent: "center",
    bottom: 0,
    zIndex: 3,
  },
  woohoo: {
    position: "absolute",
    height: height * 0.1,
    width,
    bottom: 0,
    backgroundColor: "#8bd1c6",
    justifyContent: "center",
    zIndex: 3,
  },
  hlightSave: {
    alignSelf: "center",
  },
  success: {
    fontSize: 18,
    alignSelf: "center",
    color: "#fff",
  },
});
