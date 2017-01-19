import React from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Modal,
  View,
  ListView,
} from 'react-native';
import { connect } from 'react-redux';
import {
  Font,
} from 'exponent';

const { alert } = Alert;

export default class EventList extends React.Component {

  constructor(props) {
    super(props);
    // let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    // this.state = {
    //   dataSource: ds.closeWithRows(...this.props.events),
    // };
  }



  render() {
    //TODO: Finish filling in listview
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.listVisible}>
        <View style={styles.container}>

        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(240, 240, 240, 0.6)',
    marginLeft: 22,
  },
});
