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
import ImmutableListView from 'react-native-immutable-list-view';
import Bubble from '../components/common/Bubble';
import MyText from '../components/common/MyText';
import Icons from '../constants/figures';
import Actions from '../state/Actions';
const dateFormat = require('dateformat');
const {height, width} = Dimensions.get('window');

@connect(data => MyEventsScreen.getDataProps(data))
export default class MyEventsScreen extends React.Component {

  static getDataProps(data) {
    return {
      user: data.user,
    };
  }

  render() {
    let user = this.props.user;
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <View style={styles.myEventsText}>
          <MyText style={{alignSelf: 'center', fontSize: 20, marginTop: 20}}>My Events</MyText>
        </View>
        <View style={styles.contextParent}>
          <Image
            source={require('../assets/images/event_bar.png')}
            style={styles.contextBar}>
            <TouchableOpacity onPress={this._selectAll}>
              <MyText style={{marginLeft: 5, marginTop: 20}}>All</MyText>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._selectMine}>
              <MyText style={{marginTop: 20}}>Created by Me</MyText>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._selectJoined}>
              <MyText style={{marginRight: 5, marginTop: 20}}>Joined</MyText>
            </TouchableOpacity>
          </Image>
        </View>
        <View style={{backgroundColor: '#000'}}>
          <Animated.View>
            <ImmutableListView
              immutableData={user.hosted}
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
    this.props.dispatch(Actions.routeChange('event'));
  }
}

const styles = StyleSheet.create({
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
});
