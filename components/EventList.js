import React from 'react';
import {
  View,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import Icons from '../constants/icons';
import Actions from '../state/Actions';
const dateFormat = require('dateformat');
const {height, width} = Dimensions.get('window');

@connect((data) => EventList.getDataProps(data))
export default class EventList extends React.Component {
  static getDataProps(data) {
    return {
      events: data.events.nearbyEvents,
    };
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.events.toJS()),
    };
  }

  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
      </View>
    );
  }

  _renderRow = (rowData) => {
    return (
      <ListRow data={rowData} closeBtn={this.props.closeBtn}/>
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
            <Image
              source={require('../assets/images/joined_notjoined.png')}
              style={styles.joinedBubble}
            />
            <Text style={styles.joined}>{rowData.confirmed}</Text>
            <Text style={styles.left}>{rowData.requested - rowData.confirmed}</Text>
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
    height: 40,
    width: 40,
    alignSelf: 'center',
    marginTop: 10,
  },
  icon: {
    height: 80,
  },
  info: {
    justifyContent: 'flex-end',
    flexGrow: 1,
    maxWidth: width*0.5,
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
  joinedBubble: {
    height: 26,
    width: 40,
  },
  joined: {
    position: 'absolute',
    left: 8,
    top: 30,
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#fff',
    fontFamily: 'LatoRegular',
  },
  left: {
    position: 'absolute',
    color: '#fff',
    left: 28,
    top: 34,
    fontSize: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    fontFamily: 'LatoRegular',
  },
  bubble: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: 80,
    width: 50,
  },
});
