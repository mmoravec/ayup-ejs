import React from "react";
import { View, Image, StyleSheet } from "react-native";
import MyText from "./MyText";

export default class Bubble extends React.Component {
  render() {
    let image = this.props.data.capacity === 0 ?
      require("../../assets/images/joined.png") :
      require("../../assets/images/joined_notjoined.png");
    let event = this.props.data;
    return (
      <View style={[styles.container, this.props.style]}>
        <Image source={image} style={styles.joinedBubble} />
        <MyText style={styles.joined}>{event.going.length}</MyText>
        {event.capacity - event.going.length > 9 ?
          event.capacity > 0 &&
          <MyText style={[styles.left, { right: 5 }]}>
            {event.capacity - event.going.length}
          </MyText> :
          event.capacity > 0 &&
          <MyText style={[styles.left, { right: 7 }]}>
            {event.capacity - event.going.length}
          </MyText>}
      </View>
    );
  }
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
});
