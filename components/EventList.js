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
import Immutable from 'immutable';
import dateFormat from 'dateformat';
import Bubble from './common/Bubble';
import MyText from './common/MyText';
import Icons from '../constants/activities';
import Actions from '../state/Actions';
import { duration } from "../utils/date";
const {height, width} = Dimensions.get('window');

export default class EventList extends React.Component {

  render() {
    let data = this._getHeaders(this.props.events);
    return (
      <View style={this.props.styles.container}>
        <ImmutableListView
          immutableData={data}
          renderRow={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
        />
      </View>
    );
  }

  _getHeaders = (events) => {
    events = events.groupBy(x => {
      let date = new Date(x.start_time);
      return dateFormat(date, 'fullDate');
    }).sort((a, b) => {
      let n = new Date(a.get(0).start_time).getTime();
      let f = new Date(b.get(0).start_time).getTime();
      if (n > f) {
        return 1;
      } else if (f > n) {
        return -1;
      } else {
        return 0;
      }
    });
    return events;
  }

  _renderRow = (rowData) => {
    return (
      <ListRow data={rowData} closeBtn={this.props.closeBtn} styles={this.props.styles} />
    );
  }

  _renderSectionHeader = (sectionData, header) => {
    return (
      <MyText style={this.props.styles.header}>{header}</MyText>
    );
  }
}

@connect()
class ListRow extends React.Component {
  render() {
    let styles = this.props.styles;
    let rowData = this.props.data;
    let selectEvent = this._onItemPress.bind(this, rowData.id);
    let image = Icons[rowData.activity].image;
    let start = new Date(rowData.start_time);
    let end = new Date(rowData.end_time);
    let format = duration(start, end);
    return (
      <TouchableOpacity onPress={selectEvent}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Image
              source={image}
              style={styles.activityImage}
            />
            <MyText style={styles.time}>{dateFormat(rowData.start_time, 'h:MM tt')}</MyText>
            <MyText style={styles.duration}>{format}</MyText>
          </View>
          <View style={styles.info}>
            <MyText style={styles.title}>{rowData.title}</MyText>
            <MyText style={styles.author}>{rowData.host.name}</MyText>
          </View>
          <View style={styles.bubble}>
            <Bubble data={rowData} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  _onItemPress = (id) => {
    //TODO: create a saga for this when fetching comments becomes
    this.props.dispatch(Actions.selectEvent(id));
    this.props.dispatch(Actions.routeChange('Event'));
    if (this.props.closeBtn) {
      this.props.closeBtn();
    }
  }
}
