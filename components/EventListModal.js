import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import EventList from './EventList';

@connect()
export default class EventListModal extends React.Component {

  render() {
    //TODO: Finish filling in listview
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.listVisible}>
        <View style={styles.container}>
          <EventList />
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
