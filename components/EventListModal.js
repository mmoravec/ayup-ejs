import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  TouchableHighlight,
  Image,
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
        <View style={styles.btnListContainer}>
          <TouchableHighlight underlayColor="transparent" onPress={this.props.closeBtnPress}>
            <Image
              style={styles.btnClose}
              source={require('../assets/images/btn_close.png')}
            />
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(240, 240, 240, 0.6)',
    marginLeft: 30,
  },
  btnListContainer: {
    position: 'absolute',
    left: -3,
    bottom: 8,
  },
  btnClose: {
    width: 85,
    height: 85,
  },
});
