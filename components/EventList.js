import _ from "lodash";
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
    return (
      <View style={this.props.styles.container}>
        <ImmutableListView
          immutableData={this.props.events}
          renderRow={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
        />
      </View>
    );
  }

  _renderRow = (rowData) => {
    return (
      <ListRow data={rowData} closeBtn={this.props.closeBtn} styles={this.props.styles} />
    );
  }

  _renderSectionHeader = (sectionData, header) => {
    return (
      <View>
        <MyText style={this.props.styles.header}>{header}</MyText>
      </View>
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
    return (
      <TouchableOpacity onPress={selectEvent}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Image
              source={image}
              style={styles.activityImage}
            />
            {this._showTime()}
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
  _onItemPress = _.debounce(() => {
      this.props.dispatch(Actions.selectEvent(this.props.data.id));
      this.props.dispatch(Actions.routeChange('Event'));
      if (this.props.closeBtn) {
        this.props.closeBtn();
      }
    }, 1000, {
      leading: true,
    });

  _showTime = () => {
    let start = new Date(this.props.data.start_time);
    let end = new Date(this.props.data.end_time);
    let format = duration(start, end);
    let hours = (end.getHours() - start.getHours()) + "hrs";
    if (end - start > 2678400000) {
      return <MyText style={this.props.styles.duration}>{hours}</MyText>;
    } else {
      return (
        <View>
          <MyText style={this.props.styles.time}>{dateFormat(this.props.data.start_time, 'h:MM tt')}</MyText>
          <MyText style={this.props.styles.duration}>{format}</MyText>
        </View>
      );
    }
  }
}
