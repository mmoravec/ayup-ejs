import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MyText from '../components/common/MyText';
import Actions from '../state/Actions';
import EventList from '../components/MyEventList';
const {height, width} = Dimensions.get('window');
const data = require('../sample/sampledata.json');

@connect(data => MyEventsScreen.getDataProps(data))
export default class MyEventsScreen extends React.Component {

  static getDataProps(data) {
    return {
      user: data.user,
    };
  }

  componentWillMount() {
    this.props.dispatch(Actions.syncProfile());
  }

  state = {
    allOpac: new Animated.Value(1),
    myOpac: new Animated.Value(0.4),
    joinOpac: new Animated.Value(0.4),
    mine: false,
  }

  render() {
    // console.log(this.props.user);
    let hostEvents = this.props.user.events.filter(event => {
      return event.get('host').get('userID') === this.props.user.id;
    });
    let joinedEvents = this.props.user.events.filter(event => {
      return event.get('host').get('userID') !== this.props.user.id;
    });
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
            <TouchableOpacity onPress={this._selectAll} hitSlop={{top: 20, left: 20, bottom: 20, right: 30}}>
              <Animated.Text style={{fontFamily: 'LatoRegular', paddingLeft: 5, alignSelf: 'center', opacity: this.state.allOpac}}>All</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._selectMine} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>
              <Animated.Text style={{fontFamily: 'LatoRegular', opacity: this.state.myOpac}}>Created by Me</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._selectJoined} hitSlop={{top: 20, left: 30, bottom: 20, right: 20}}>
              <Animated.Text style={{fontFamily: 'LatoRegular', paddingRight: 5, opacity: this.state.joinOpac}}>Joined</Animated.Text>
            </TouchableOpacity>
          </Image>
        </View>
        <ScrollableTabView
          ref={(tabView) => { this.tabView = tabView; }}
          locked={true}
          renderTabBar={false}>
          <EventList events={this.props.user.events}  closeBtn={this._backBtnPress} />
          <EventList events={hostEvents} closeBtn={this._backBtnPress} />
          <EventList events={joinedEvents} closeBtn={this._backBtnPress} />
        </ScrollableTabView>
      </Image>
    );
  }
  _selectAll = () => {
    Animated.parallel([
      Animated.timing(this.state.allOpac, {toValue: 1, duration: 500}),
      Animated.timing(this.state.myOpac, {toValue: 0.4, duration: 500}),
      Animated.timing(this.state.joinOpac, {toValue: 0.4, duration: 500}),
    ]).start();
    this.tabView.goToPage(0);
  }
  _selectMine = () => {
    Animated.parallel([
      Animated.timing(this.state.allOpac, {toValue: 0.4, duration: 500}),
      Animated.timing(this.state.myOpac, {toValue: 1, duration: 500}),
      Animated.timing(this.state.joinOpac, {toValue: 0.4, duration: 500}),
    ]).start();
    this.tabView.goToPage(1);
  }
  _selectJoined = () => {
    Animated.parallel([
      Animated.timing(this.state.allOpac, {toValue: 0.4, duration: 500}),
      Animated.timing(this.state.myOpac, {toValue: 0.4, duration: 500}),
      Animated.timing(this.state.joinOpac, {toValue: 1, duration: 500}),
    ]).start();
    this.tabView.goToPage(2);
  }
  _backBtnPress = () => {
    this.props.dispatch(Actions.routeChange('Back'));
  }
}


const styles = StyleSheet.create({
  eventList: {
    width: width * 0.9,
    position: 'absolute',
    height: height - 110,
    zIndex: 10,
  },
  listParent: {
    backgroundColor: 'rgba(0,0,0,0)',
    width,
    height: height - 110,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  myEventsText: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: 50,
  },
  contextBar: {
    width: width * 0.95,
    height: width * 0.18,
    resizeMode: 'contain',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  contextParent: {
    backgroundColor: 'rgba(0,0,0,0)',
    width,
    marginTop: 10,
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
    width: 80,
    height: 80,
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
