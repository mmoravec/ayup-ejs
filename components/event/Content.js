import React from "react";
import { MapView } from "expo";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  LayoutAnimation,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { List } from "immutable";
import ImmutableListView from "react-native-immutable-list-view";
import EventActions from "./Actions";
import EventGuests from "./Guests";
import MyText from "../common/MyText";
import Bubble from "../common/Bubble";
import Filter from "../../utils/filters";
import { duration } from "../../utils/date";
import Icons from "../../constants/activities";
import MapStyle from "../../constants/mapstyle";
import Actions from "../../state/Actions";
const dateFormat = require("dateformat");
const { width, height } = Dimensions.get("window");

@connect(data => EventContent.getDataProps(data))
export default class EventContent extends React.Component {
  static getDataProps(data) {
    return {
      event: data.events.selectedEvent,
      comments: new List(Filter.sortComments(data.events.selectedComments)),
    };
  }

  state = {
    ready: false,
    scrollY: 0,
  };

  componentWillMount() {
    this.props.dispatch(Actions.loadComments(this.props.event.id));
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <ImmutableListView
        ref={listView => {
          this._listView = listView;
        }}
        immutableData={this.props.comments}
        renderRow={this._renderRow}
        renderHeader={this._renderHeader}
        onScroll={this.props.onScroll}
        keyboardShouldPersistTaps={"always"}
      />
    );
  }

  _renderHeader = () => {
    let event = this.props.event;
    let start = new Date(event.start_time);
    let end = new Date(event.end_time);
    let coord = {
      longitude: event.location.coordinates[0],
      latitude: event.location.coordinates[1],
      latitudeDelta: 0.003850375166415176,
      longitudeDelta: 0.01609325556559327,
    };
    let marker = {
      longitude: event.location.coordinates[0],
      latitude: event.location.coordinates[1],
      latitudeDelta: 0.003850375166415176,
      longitudeDelta: 0.01609325556559327,
    };
    let icon = Icons[event.activity].icon;
    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <EventActions event={this.props.event} />
        <View style={{ height: height * 0.2, width }}>
          <MapView
            style={styles.map}
            zoomEnabled={false}
            customMapStyle={MapStyle}
            scrollEnabled={false}
            provider={"google"}
            region={coord}>
            <MapView.Marker key={0} coordinate={marker} image={icon} />
          </MapView>
        </View>
        <View style={styles.topInfo}>
          <View>
            <Image
              source={{ uri: event.host.profile_pic }}
              style={styles.profilePic}
            />
          </View>
          <View style={styles.headerName}>
            <MyText style={{ fontSize: 18, marginBottom: 5 }}>
              {event.host.name}
            </MyText>
          </View>
          <View style={styles.figure}>
            <MyText style={{ alignSelf: "center", fontSize: 14 }}>
              {dateFormat(start, "ddd, mmm dd")}
            </MyText>
            <MyText style={{ alignSelf: "center", fontSize: 14 }}>
              {dateFormat(start, "shortTime")}
            </MyText>
            <MyText
              style={{ alignSelf: "center", fontSize: 14, color: "#b3b3b3" }}>
              {duration(start, end)}
            </MyText>
          </View>
        </View>
        <View style={styles.middleInfo}>
          <MyText style={{ fontSize: 24, margin: 14, marginBottom: 6 }}>
            {event.title}
          </MyText>
          {this._renderLocation()}
          {event.description !== "" &&
            <MyText
              style={{
                fontSize: 16,
                margin: 14,
                color: "#808080",
                marginTop: 0,
                marginBottom: 0,
              }}>
              {event.description}
            </MyText>}
        </View>
        <View style={styles.bottomInfo}>
          <View style={{ flexDirection: "row" }}>
            <MyText
              style={{
                color: "#5bc4a5",
                fontSize: 16,
                margin: 14,
                marginRight: 2,
              }}>
              Going{" "}
            </MyText>
            <MyText style={{ color: "#ee366f", fontSize: 16, marginTop: 14 }}>
              / Unconfirmed
            </MyText>
            <Bubble
              data={event}
              style={{ alignSelf: "center", position: "absolute", right: 10 }}
            />
          </View>
          <EventGuests
            guestClick={this.props.guestClick}
            showAddFriend={this.props.showAddFriend}
          />
        </View>
        <View style={styles.comments}>
          <MyText style={styles.seeAll}>
            Comments({this.props.comments.size})
          </MyText>
          <TouchableOpacity
            style={styles.commentBtn}
            underlayColor={"#f2f2f2"}
            onPress={this.props.onCommentPress}>
            <MaterialCommunityIcons
              size={12}
              name={"message"}
              color={"#c7c7c7"}
              style={{ marginTop: 3 }}
            />
            <MyText style={styles.commentTxt}>Comment</MyText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderLocation = () => {
    let event = this.props.event;
    if (event.destination.text !== "") {
      return (
        <View style={styles.destloc}>
          <Image
            source={require("../../assets/images/location_destination.png")}
            resizeMode={"contain"}
            style={{ width: 12, position: 'absolute', left: 4 }}
          />       
          <TouchableOpacity onPress={this._openLoc} style={styles.locdestRow}>
            <MyText style={styles.locdestText}>
              {event.location.text}
            </MyText>
            <MaterialIcons size={22} name={"chevron-right"} color={"#e5e5e5"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.locdestRow2} onPress={this._openDest}>
            <MyText style={styles.locdestText}>
              {event.destination.text}
            </MyText>
            <MaterialIcons size={22} name={"chevron-right"} color={"#e5e5e5"} />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <TouchableOpacity style={styles.location} onPress={this._openLoc}>
          <Image
            source={require("../../assets/images/location_dot.png")}
            resizeMode={"contain"}
            style={{ height: 12 }}
          />
          <MyText style={{ fontSize: 14, width: width * 0.8 }}>
            {event.location.text}
          </MyText>
          <MaterialIcons size={22} name={"chevron-right"} color={"#e5e5e5"} />
        </TouchableOpacity>
      );
    }
  };

  _openLoc = () => {
    let daddr = this.props.event.location.text;
    Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
  };

    _openDest = () => {
    let daddr = this.props.event.destination.text;
    Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
  };

  _renderRow = rowData => {
    let replyPress = this.props.onCommentPress.bind(this, rowData.id);
    let _imageBox = styles.imageBox;
    if (rowData.parent_id) {
      _imageBox = styles.extImageBox;
    }
    return (
      <View style={styles.grandparent}>
        <View style={styles.parent}>
          <View style={_imageBox}>
            <Image
              source={{ uri: rowData.author.profile_pic }}
              style={styles.commentPic}
            />
          </View>
          <View style={styles.contentParent}>
            <View style={styles.contentBox}>
              <MyText style={styles.name}>{rowData.author.name}</MyText>
              <MyText style={styles.content}>{rowData.content}</MyText>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={replyPress}>
                <MaterialIcons name={"reply"} size={14} color={"#c7c7c7"} />
                <MyText style={{ color: "#5f5f5f" }}> Reply</MyText>
              </TouchableOpacity>
              <MyText style={{ color: "#c7c7c7" }}> • </MyText>
              {this._renderTime(rowData.posted_on)}
            </View>
          </View>
        </View>
      </View>
    );
  };

  _renderTime = date => {
    let now = new Date();
    let then = new Date(date);
    let diff = now - then;
    let minutes = Math.floor(diff / 60000);
    if (minutes < 60) {
      return <MyText style={{ color: "#5f5f5f" }}>{minutes} mins </MyText>;
    } else if (minutes < 2880) {
      let hours = Math.floor(minutes / 60);
      return <MyText style={{ color: "#5f5f5f" }}>{hours} hrs</MyText>;
    } else if (minutes < 14400) {
      let days = Math.floor(minutes / 1440);
      return <MyText style={{ color: "#5f5f5f" }}>{days} days</MyText>;
    } else if (minutes < 525600) {
      return (
        <MyText style={{ color: "#5f5f5f" }}>
          {dateFormat(then, "mmm d")}, {dateFormat(then, "h:mm tt")}
        </MyText>
      );
    } else {
      let years = Math.floor(minutes / 525600);
      return (
        <MyText style={{ color: "#5f5f5f" }}>
          {dateFormat(then, "mmm d yyyy")}, {dateFormat(then, "shortTime")}
        </MyText>
      );
    }
  };
}

const styles = StyleSheet.create({
  grandparent: {
    backgroundColor: "#fff",
  },
  parent: {
    flexDirection: "row",
    flex: 1,
    margin: 5,
  },
  map: {
    height: height * 0.3,
    width,
  },
  destloc: {
    margin: 10,
    borderRadius: 4,
    borderColor: "#e5e5e5",
    borderWidth: 1,
  },
  locdestRow: {
    flexDirection: 'row',
    margin: 10,
    marginLeft: 25,
    marginRight: 0,
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  locdestRow2: {
    flexDirection: 'row',
    marginRight: 0,
    marginLeft: 25,
    margin: 10,
    justifyContent: 'space-between',
    borderTopColor: "#e5e5e5",
    borderTopWidth: 1,
    paddingTop: 10,
  },
  locdestText: {
    width: width * 0.8,
  },
  location: {
    borderColor: "#e5e5e5",
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentTxt: {
    marginLeft: 5,
    fontSize: 14,
    color: "#5f5f5f",
  },
  comments: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentPic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 10,
  },
  commentBtn: {
    alignSelf: "center",
    flexDirection: "row",
    marginRight: 5,
    marginTop: 5,
    paddingRight: 5,
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
  },
  seeAll: {
    fontSize: 18,
    margin: 10,
    marginLeft: 14,
    color: "#5f5f5f",
  },
  headerName: {
    height: 100,
    width: width * 0.4,
    justifyContent: "center",
    paddingLeft: 10,
  },
  profilePic: {
    height: 76,
    width: 76,
    margin: 12,
    borderRadius: 38,
  },
  middleInfo: {
    flexDirection: "column",
    borderTopWidth: 1,
    borderTopColor: "#e6e6e6",
    backgroundColor: "#fff",
  },
  bottomInfo: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  topInfo: {
    height: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  figure: {
    justifyContent: "center",
    width: width * 0.3,
  },
  content: {
    fontSize: 14,
    color: "#808080",
  },
  imageBox: {
    justifyContent: "flex-start",
    flex: 1,
  },
  extImageBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 2,
  },
  contentBox: {
    backgroundColor: "#edf7f6",
    borderRadius: 10,
    padding: 10,
  },
  contentParent: {
    flex: 4,
    margin: 5,
  },
});
