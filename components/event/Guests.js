import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import Icons from "../../constants/activities";
import Actions from "../../state/Actions";
import MyText from "../common/MyText";
const dateFormat = require("dateformat");
const { height, width } = Dimensions.get("window");

@connect(data => EventGuests.getDataProps(data))
export default class EventGuests extends React.Component {
  static getDataProps(data) {
    return {
      selectedEvent: data.events.selectedEvent,
      profile: data.profile,
    };
  }
  state = {
    selectedUser: null,
  };
  render() {
    let i = -1;
    return (
      <View>
        <ScrollView style={styles.scrollview} horizontal>
          {(this._getStatus() === "accepted" || this._getStatus() === "host") &&
          !this.props.selectedEvent.completed &&
            <TouchableOpacity onPress={this.props.showAddFriend}>
              <Image
                source={require("../../assets/images/add_friend.png")}
                style={{ height: 50, width: 50, margin: 5 }}
              />
            </TouchableOpacity>}
          {this.props.selectedEvent.going.map(g => {
            i++;
            return (
              <GuestPic
                key={g.name}
                profilePic={g.profile_pic}
                opacity={1}
                user={g}
                selectPic={this.props.guestClick.bind(this, i)}
              />
            );
          })}
          {this.props.selectedEvent.invited.map(g => {
            i++;
            return (
              <GuestPic
                key={g.name}
                profilePic={g.profile_pic}
                opacity={0.4}
                user={g}
                selectPic={this.props.guestClick.bind(this, i)}
              />
            );
          })}
          {this.props.selectedEvent.requested.map(g => {
            i++;
            return (
              <GuestPic
                key={g.name}
                profilePic={g.profile_pic}
                opacity={0.4}
                user={g}
                selectPic={this.props.guestClick.bind(this, i)}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }

  _addFriend = () => {};
  _getStatus = () => {
    let user = "uninvited";
    let event = this.props.selectedEvent;
    event.invited.map(e => {
      if (e.id === this.props.profile.id) {
        user = "invited";
      }
    });
    event.requested.map(e => {
      if (e.id === this.props.profile.id) {
        user = "requested";
      }
    });
    event.rejected.map(e => {
      if (e.id === this.props.profile.id) {
        user = "rejected";
      }
    });
    event.going.map(e => {
      if (e.id === this.props.profile.id) {
        user = "accepted";
      }
    });
    if (event.host.id === this.props.profile.id) {
      user = "host";
    }
    return user;
  };
}

class GuestPic extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.selectPic}>
        {this.props.profilePic !== "" &&
          <Image
            source={{ uri: this.props.profilePic }}
            style={styles.image}
            opacity={this.props.opacity}
          />}
        {this.props.profilePic === "" &&
          <Image
            source={require("../../assets/images/sms_circle.png")}
            style={styles.image}
            opacity={this.props.opacity}>
            <MyText
              style={{
                margin: 10,
                marginTop: 16,
                backgroundColor: "transparent",
              }}>
              SMS
            </MyText>
          </Image>}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 50,
    width: 50,
    margin: 5,
    borderRadius: 25,
  },
});
