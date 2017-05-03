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
const {height, width} = Dimensions.get('window');

export default class EventList extends React.Component {

  render() {
    let data = this._getHeaders(this.props.events);
    return (
      <View style={styles.container}>
        <ImmutableListView
          immutableData={data}
          renderRow={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
        />
      </View>
    );
  }

  _getHeaders = (events) => {
    let d = {};
    events = events.toJS();
    events = events.map(event => {
      event.startDate = new Date(event.startDate);
      event.endDate = new Date(event.endDate);
      return event;
    });
    events = events.sort((a, b) => {
      return a.startDate - b.startDate;
    });
    events.map(event => {
      let date = new Date(event.startDate);
      let mash = dateFormat(date, 'fullDate');
      if (d[mash]) {
        d[mash].push(event);
      } else {
        d[mash] = [event];
      }
      console.log(d);
    });
    return Immutable.fromJS(d);
  }

  _renderRow = (rowData) => {
    return (
      <ListRow data={rowData} closeBtn={this.props.closeBtn} />
    );
  }

  _renderSectionHeader = (sectionData, header) => {
    return (
      <MyText style={styles.header}>{header}</MyText>
    );
  }
}

@connect()
class ListRow extends React.Component {
  render() {
    let rowData = this.props.data.toJS();
    let selectEvent = this._onItemPress.bind(this, rowData.id);
    let image = Icons[rowData.activity].image;
    let start = new Date(rowData.startDate);
    let end = new Date(rowData.endDate);
    let duration = Math.abs(end.getTime() - start.getTime());
    let format = "";
    if (duration < 3500000) {
      format = dateFormat(duration, 'MM') + "min";
    } else if (duration < 86400000) {
      format = Math.ceil(duration / (1000 * 3600)) + "hrs";
    } else {
      format = Math.ceil(duration / (1000 * 3600 * 24)) + "days";
    }
    return (
      <TouchableOpacity onPress={selectEvent}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Image
              source={image}
              style={styles.activityImage}
            />
            <MyText style={styles.time}>{dateFormat(rowData.startDate, 'h:MM tt')}</MyText>
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
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginTop: 2,
    marginBottom: 2,
    height: 80,
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 8,
    marginTop: 5,
    alignSelf: 'center',
  },
  duration: {
    fontSize: 8,
    alignSelf: 'center',
    color: '#c4c4c4',
  },
  activityImage: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    marginTop: 20,
  },
  icon: {
    height: 80,
    marginLeft: 5,
  },
  header: {
    color: '#808080',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  info: {
    justifyContent: 'flex-end',
    flexGrow: 1,
    maxWidth: width * 0.5,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  author: {
    fontSize: 10,
    color: '#808080',
    marginBottom: 16,
  },
  bubble: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: 80,
    width: 50,
  },
});
