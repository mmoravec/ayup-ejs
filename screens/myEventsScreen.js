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
import ScrollableTabView from 'react-native-scrollable-tab-view';
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
  }

  render() {
    return (
      <ScrollableTabView>
        <Text tabLabel="React" />
        <Text tabLabel="Flow" />
        <Text tabLabel="Jest" />
      </ScrollableTabView>
    );
  }
  _renderRow = (rowData) => {
    return (
      <ListRow data={rowData} closeBtn={this.props.closeBtn} />
    );
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
