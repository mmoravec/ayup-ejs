import React from "react";
import {
  StyleSheet,
  Modal,
  View,
  TouchableHighlight,
  Dimensions,
  Image,
} from "react-native";
import EventList from "./EventList";
const { width } = Dimensions.get("window");

export default class EventListModal extends React.Component {
  render() {
    //TODO: Finish filling in listview
    return (
      <Modal
        onRequestClose={this.props.closeBtnPress}
        animationType={"slide"}
        transparent
        visible={this.props.listVisible}>
        <View style={styles.container}>
          <EventList
            events={this.props.events}
            closeBtn={this.props.closeBtnPress}
            styles={listStyle}
          />
        </View>
        <View style={styles.btnListContainer}>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this.props.closeBtnPress}>
            <Image
              style={styles.btnClose}
              source={require("../assets/images/btn_close.png")}
            />
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(240, 240, 240, 0.8)",
    paddingLeft: 25,
    paddingTop: 20,
  },
  btnListContainer: {
    position: "absolute",
    left: -10,
    bottom: 8,
  },
  btnClose: {
    width: 100,
    height: 100,
  },
});

const listStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 5,
    height: 80,
    justifyContent: "space-between",
  },
  time: {
    fontSize: 8,
    marginTop: 5,
    alignSelf: "center",
  },
  duration: {
    fontSize: 8,
    alignSelf: "center",
    color: "#c4c4c4",
  },
  activityImage: {
    height: 30,
    width: 30,
    alignSelf: "center",
    marginTop: 20,
  },
  icon: {
    height: 80,
    marginLeft: 5,
  },
  header: {
    color: "#808080",
  },
  info: {
    justifyContent: "flex-end",
    flexGrow: 1,
    maxWidth: width * 0.5,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  author: {
    fontSize: 10,
    color: "#808080",
    marginBottom: 16,
  },
  bubble: {
    justifyContent: "center",
    alignSelf: "center",
    height: 80,
    width: 50,
  },
});
