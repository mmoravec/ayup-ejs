import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';

@connect()
export default class EventListModal extends React.Component {

  render() {
    //TODO: Finish filling in listview
    return (
      <Modal
        animationType={"none"}
        transparent={true}
        visible={this.props.menuVisible}>
        <View style={styles.container}>
          <View style={styles.btnMainContainer}>
            <TouchableHighlight underlayColor="transparent" onPress={this.props.menuBtnPress}>
              <Image
                source={require('../assets/images/btn_menu_close.png')}
                style={styles.btnMain}
              />
            </TouchableHighlight>
          </View>
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
  btnMainContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMain: {
    width: 110,
    height: 110,
  },
});
