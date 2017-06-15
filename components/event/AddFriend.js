import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { List } from "immutable";
import FriendSelector from "../form/FriendSelector";
const { height, width } = Dimensions.get("window");

export default class AddFriend extends React.Component {
  state = {
    value: new List(),
    focus: true,
  };
  render() {
    if (this.props.show) {
      return (
        <Modal
          animationType={"slide"}
          onRequestClose={this.props.hide}
          style={{ backgroundColor: "#fff" }}>
          <ScrollView keyboardShouldPersistTaps={"always"}>
            <FriendSelector
              onChange={this.onChange}
              value={this.state.value}
              focus={this.state.focus}
              onFocus={this.onFocus}
              scrollTo={this.scrollTo}
            />
          </ScrollView>
          {this._renderButton()}
        </Modal>
      );
    } else {
      return null;
    }
  }

  _renderButton = () => {
    if (this.state.value.size > 0) {
      return (
        <View style={styles.bottom}>
          <TouchableOpacity
            underlayColor="transparent"
            style={styles.hlightSave}
            onPress={this._inviteBtnPress}>
            <Image
              style={styles.btnJoin}
              resizeMode={"contain"}
              source={require("../../assets/images/btn_join.png")}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.bottom}>
          <TouchableOpacity
            underlayColor="transparent"
            style={styles.hlightSave}
            onPress={this._inviteBtnPress}>
            <Image
              style={styles.btnJoin}
              resizeMode={"contain"}
              source={require("../../assets/images/btn_done.png")}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };
  scrollTo = () => {
    //do nothing
  };
  onChange = (stateKey, value) => {
    this.setState({ value });
  };
  onFocus = stateKey => {
    this.setState({ focus: !this.state.focus });
  };
  _inviteBtnPress = () => {
    //TODO: invite action
    this.props.hide();
  };
}

const styles = StyleSheet.create({
  joinedBubble: {
    height: 26,
    width: 40,
  },
  joined: {
    position: "absolute",
    left: 8,
    top: 5,
    backgroundColor: "rgba(0,0,0,0)",
    color: "#fff",
    fontFamily: "LatoRegular",
  },
  left: {
    position: "absolute",
    color: "#fff",
    top: 8,
    fontSize: 10,
    backgroundColor: "rgba(0,0,0,0)",
    fontFamily: "LatoRegular",
  },
  container: {
    height: 26,
    width: 40,
  },
  hlightSave: {
    alignSelf: "center",
  },
  bottom: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    bottom: 0,
    height: height * 0.1,
    width,
    flexDirection: "row",
    justifyContent: "space-around",
    zIndex: 2,
  },
  btnJoin: {
    width: 115,
  },
});
