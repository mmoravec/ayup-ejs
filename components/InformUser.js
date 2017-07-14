import React from "react";
import _ from "lodash";
import {
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MyText from "./common/MyText";
const { height, width } = Dimensions.get("window");

export default class InformUser extends React.Component {
  state = {
    top: new Animated.Value(-height * 0.3),
    shown: false,
    delay: false,
  };

  showInfo = _.debounce(() => this.setState({ shown: false }), 15000);

  componentDidMount() {
    _.delay(() => this.setState({ delay: true }), 1000);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.events.size === 0) {
      if (!this.state.shown && this.state.delay) {
        Animated.timing(this.state.top, { toValue: 0, duration: 1000 }).start();
      }
    } else {
      Animated.timing(this.state.top, {
        toValue: -height * 0.3,
        duration: 1000,
      }).start();
      this.setState({ shown: true });
      this.showInfo();
    }
  }
  render() {
    return (
      <Animated.View style={[styles.container, { top: this.state.top }]}>
        <TouchableOpacity onPress={this._handleClick}>
          <MyText style={styles.message}>
            No events shown. Pinch to zoom out or change filters under "Activities" found under the menu.
          </MyText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={this._close}>
          <MaterialIcons size={36} name={"close"} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  _close = () => {
    Animated.timing(this.state.top, {
      toValue: -height * 0.3,
      duration: 200,
    }).start();
    this.setState({ shown: true });
    this.showInfo();
  };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingBottom: 20,
    width: width * 0.90,
    backgroundColor: "#fff",
    zIndex: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: Platform.OS === "android" ? 1 : 0,
    left: width * 0.05,
    paddingLeft: 20,
    paddingRight: 40,
  },
  message: {
    fontSize: 18,
    marginTop: 30,
  },
  close: {
    position: "absolute",
    right: 10,
    top: 25,
  },
});
