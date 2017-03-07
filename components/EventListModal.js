import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
import EventList from './EventList';

export default class EventListModal extends React.Component {

  render() {
    //TODO: Finish filling in listview
    return (
      <Modal
        onRequestClose={this.props.closeBtnPress}
        animationType={"slide"}
        transparent={true}
        visible={this.props.listVisible}>
        <View style={styles.container}>
          <EventList closeBtn={this.props.closeBtnPress} />
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
  },
  btnListContainer: {
    position: 'absolute',
    left: -10,
    bottom: 8,
  },
  btnClose: {
    width: 100,
    height: 100,
  },
});
