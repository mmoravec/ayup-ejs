import React from 'react';
import {
  View,
  ListView,
  StyleSheet,
  Text,
} from 'react-native';
import { connect } from 'react-redux';

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
      <View style={styles.row}>
        <Text>{rowData.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 15,
  },
});
