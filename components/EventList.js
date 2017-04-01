import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import ImmutableListView from 'react-native-immutable-list-view';
import Bubble from './common/Bubble';
import Icons from '../constants/figures';
import Actions from '../state/Actions';
const dateFormat = require('dateformat');
const {height, width} = Dimensions.get('window');

@connect()
export default class EventList extends React.Component {


  render() {
    return (
      <View>
        <ImmutableListView
          immutableData={this.props.events}
          renderRow={this._renderRow}
        />
      </View>
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
            <Text style={styles.author}>{rowData.host.name}</Text>
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
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginTop: 5,
    marginLeft: 5,
    height: 80,
    justifyContent: 'space-between',
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
