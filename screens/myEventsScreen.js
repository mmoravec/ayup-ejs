import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import ImmutableListView from 'react-native-immutable-list-view';
import Bubble from '../components/common/Bubble';
import MyText from '../components/common/MyText';
import Icons from '../constants/activities';
import Actions from '../state/Actions';
const dateFormat = require('dateformat');
const {height, width} = Dimensions.get('window');
const data = require('../sample/sampledata.json');

@connect(data => MyEventsScreen.getDataProps(data))
export default class MyEventsScreen extends React.Component {

  static getDataProps(data) {
    return {
      user: data.user,
    };
  }

  state = {
    allLeft: new Animated.Value(width * 2 + width * 0.05),
    myLeft: new Animated.Value(width * 2 + width * 0.1),
    joinedLeft: new Animated.Value(width * 2 + width * 0.15),
    allOpac: new Animated.Value(1),
    myOpac: new Animated.Value(0.4),
    joinOpac: new Animated.Value(0.4),
  }

  componentDidMount() {
    Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.timing(this.state.allLeft, {toValue: width * 2 + width * 0.05, duration: 500}),
        Animated.timing(this.state.myLeft, {toValue: width * 3 + width * 0.05, duration: 500}),
        Animated.timing(this.state.joinedLeft, {toValue: width * 4 + width * 0.05, duration: 500}),
        Animated.timing(this.state.allOpac, {toValue: 1, duration: 500}),
        Animated.timing(this.state.myOpac, {toValue: 0.4, duration: 500}),
        Animated.timing(this.state.joinOpac, {toValue: 0.4, duration: 500}),
      ]),
    ]).start();

  }

  render() {
    let listData = new List(data);
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <View style={styles.myEventsText}>
          <MyText style={{alignSelf: 'center', fontSize: 20, marginTop: 25}}>My Events</MyText>
        </View>
        <TouchableOpacity style={styles.ctnBack} underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableOpacity>
        <View style={styles.contextParent}>
          <Image
            source={require('../assets/images/event_bar.png')}
            style={styles.contextBar}>
            <TouchableOpacity onPress={this._selectAll}>
              <Animated.Text style={{fontFamily: 'LatoRegular', marginLeft: 5, marginTop: 20, opacity: this.state.allOpac}}>All</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._selectMine}>
              <Animated.Text style={{fontFamily: 'LatoRegular', marginTop: 20, opacity: this.state.myOpac}}>Created by Me</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._selectJoined}>
              <Animated.Text style={{fontFamily: 'LatoRegular', marginRight: 5, marginTop: 20, opacity: this.state.joinOpac}}>Joined</Animated.Text>
            </TouchableOpacity>
          </Image>
        </View>
        <View style={styles.listParent}>
          <Animated.View style={[styles.eventList, {left: this.state.allLeft}]}>
            <ImmutableListView
              immutableData={listData}
              renderRow={this._renderRow}
            />
          </Animated.View>
          <Animated.View style={[styles.eventList, {left: this.state.myLeft}]}>
            <ImmutableListView
              immutableData={listData}
              renderRow={this._renderRow}
            />
          </Animated.View>
          <Animated.View style={[styles.eventList, {left: this.state.joinedLeft}]}>
            <ImmutableListView
              immutableData={listData}
              renderRow={this._renderRow}
            />
          </Animated.View>
        </View>
      </Image>
    );
  }
  _renderRow = (rowData) => {
    return (
      <ListRow data={rowData} closeBtn={this.props.closeBtn} />
    );
  }
  _selectAll = () => {
    Animated.parallel([
      Animated.timing(this.state.allLeft, {toValue: width * 2 + width * 0.05, duration: 500}),
      Animated.timing(this.state.myLeft, {toValue: width * 3 + width * 0.05, duration: 500}),
      Animated.timing(this.state.joinedLeft, {toValue: width * 4 + width * 0.05, duration: 500}),
      Animated.timing(this.state.allOpac, {toValue: 1, duration: 500}),
      Animated.timing(this.state.myOpac, {toValue: 0.4, duration: 500}),
      Animated.timing(this.state.joinOpac, {toValue: 0.4, duration: 500}),
    ]).start();
  }
  _selectMine = () => {
    Animated.parallel([
      Animated.timing(this.state.allLeft, {toValue: width * 1 + width * 0.05, duration: 500}),
      Animated.timing(this.state.myLeft, {toValue: width * 2 + width * 0.05, duration: 500}),
      Animated.timing(this.state.joinedLeft, {toValue: width * 3 + width * 0.05, duration: 500}),
      Animated.timing(this.state.allOpac, {toValue: 0.4, duration: 500}),
      Animated.timing(this.state.myOpac, {toValue: 1, duration: 500}),
      Animated.timing(this.state.joinOpac, {toValue: 0.4, duration: 500}),
    ]).start();
  }
  _selectJoined = () => {
    Animated.parallel([
      Animated.timing(this.state.allLeft, {toValue: width * 0.05, duration: 500}),
      Animated.timing(this.state.myLeft, {toValue: width * 1 + width * 0.05, duration: 500}),
      Animated.timing(this.state.joinedLeft, {toValue: width * 2 + width * 0.05, duration: 500}),
      Animated.timing(this.state.allOpac, {toValue: 0.4, duration: 500}),
      Animated.timing(this.state.myOpac, {toValue: 0.4, duration: 500}),
      Animated.timing(this.state.joinOpac, {toValue: 1, duration: 500}),
    ]).start();
  }
  _backBtnPress = () => {
    this.props.dispatch(Actions.routeChange('Back'));
  }
}


@connect()
class ListRow extends React.Component {
  render() {
    let rowData = this.props.data;
    let icon = Icons[rowData.activity].icon;
    return (
      <TouchableOpacity onPress={this._onItemPress}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Image
              source={icon}
              style={styles.activityImage}
            />
            <Text style={styles.time}>{dateFormat(rowData.startTime, 'h:MM tt')} - {dateFormat(rowData.endTime, 'h:MM tt')}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{rowData.title}</Text>
            <Text style={styles.author}>{rowData.author.name}</Text>
          </View>
          <View style={styles.bubble}>
            <Bubble data={rowData} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  _onItemPress = () => {
    //TODO: create a saga for this when fetching comments becomes
    this.props.closeBtn();
    this.props.dispatch(Actions.selectEvent(this.props.data));
    this.props.dispatch(Actions.routeChange('Event'));
  }
}

const styles = StyleSheet.create({
  eventList: {
    width: width * 0.9,
    position: 'absolute',
    height: height - 110,
  },
  listParent: {
    backgroundColor: 'rgba(0,0,0,0)',
    width: width * 5,
    height: height - 110,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  myEventsText: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: 50,
  },
  contextBar: {
    width: 329,
    height: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contextParent: {
    backgroundColor: 'rgba(0,0,0,0)',
    width,
  },
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 80,
    justifyContent: 'space-between',
  },
  btnBack: {
    width: 40,
    height: 40,
    margin: 15,
  },
  ctnBack: {
    position: 'absolute',
    zIndex: 2,
  },
  time: {
    fontSize: 8,
    margin: 5,
    fontFamily: 'LatoRegular',
  },
  activityImage: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    marginTop: 20,
  },
  icon: {
    height: 80,
  },
  info: {
    justifyContent: 'flex-end',
    flexGrow: 1,
    maxWidth: width * 0.5,
  },
  title: {
    fontSize: 16,
    fontFamily: 'LatoRegular',
    marginBottom: 4,
  },
  author: {
    fontSize: 10,
    color: '#808080',
    fontFamily: 'LatoRegular',
    marginBottom: 16,
  },
  bubble: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: 80,
    width: 50,
  },
});
