import React from "react";
import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MyText from "../common/MyText";
const { height, width } = Dimensions.get("window");

export default class Capacity extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MyText style={styles.label}>Capacity</MyText>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={this._decrement}>
            <View style={styles.icon}>
              <Ionicons size={30} name={"ios-remove"} />
            </View>
          </TouchableOpacity>
          <MyText style={styles.text}>{this.props.value}</MyText>
          <TouchableOpacity onPress={this._increment}>
            <View style={styles.icon}>
              <Ionicons size={30} name={"ios-add"} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _increment = () => {
    let inc = this.props.value;
    inc++;
    this.props.onChange(this.props.stateKey, inc);
  };
  _decrement = () => {
    let dec = this.props.value;
    if (dec > 0) { dec--; }
    this.props.onChange(this.props.stateKey, dec);
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#b9c1ca",
    height: 72,
    flexDirection: "row",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#6a7989",
    marginTop: 5,
    width: 25,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#6a7989",
    marginTop: 30,
    marginLeft: 20,
    marginRight: width * 0.3,
    alignSelf: "flex-start",
  },
  swButton: {
    position: "absolute",
    right: 16,
    bottom: 10,
  },
  icon: {
    height: 50,
    width: 50,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
