import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import ActionTypes from '../state/ActionTypes';
import EventListModal from '../components/EventListModal';
import MenuModal from '../components/MenuModal';
import MapView from '../components/EventMap';
const {height, width} = Dimensions.get('window');

export default class HomeScreen extends React.Component {

  state = {
    listVisible: false,
    menuVisible: false,
    iconsVisible: true,
    listBtnStyle: styles.listBtnStyle,
  }

  render() {
    let listProps = {
      key: 'list',
      events: this.props.events,
      listVisible: this.state.listVisible,
      listBtnPress: this._onListBtnPress,
      closeBtnPress: this._onCloseBtnPress,
    };

    let menuProps = {
      key: 'menu',
      menuVisible: this.state.menuVisible,
      menuBtnPress: this._onMenuBtnPress,
      navAway: this._onNavAway,
    };

    return (
      <View style={{flex: 1}}>
        <MapView iconsVisible={this.state.iconsVisible} />
        <View style={styles.btnMainContainer}>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this._onMenuBtnPress}>
            <Image
              source={require('../assets/images/btn_main.png')}
              style={styles.btnMain}
            />
          </TouchableHighlight>
        </View>
        <View style={this.state.listBtnStyle}>
          <TouchableHighlight underlayColor="transparent" onPress={this._onListBtnPress}>
            <Image
              style={styles.btnList}
              source={require('../assets/images/btn_list.png')}
            />
          </TouchableHighlight>
        </View>
        <View style={styles.filter}>
          <TouchableHighlight underlayColor="transparent" onPress={this._onFilterBtnPress}>
            <Image
              style={styles.filterBtn}
              source={require('../assets/images/filter2.png')}
            />
          </TouchableHighlight>
        </View>
        <EventListModal {...listProps} />
        <MenuModal {...menuProps} />
      </View>
    );
  }

  _onListBtnPress = () => {
    this.setState({
      listVisible: !this.state.listVisible,
      listBtnStyle: styles.listBtnHidden,
      iconsVisible: !this.state.iconsVisible,
    });
  }

  _onCloseBtnPress = () => {
    this.setState({
      listVisible: !this.state.listVisible,
      listBtnStyle: styles.listBtnStyle,
      iconsVisible: !this.state.iconsVisible,
    });
  }

  _onMenuBtnPress = () => {
    this.setState({
      menuVisible: !this.state.menuVisible,
      iconsVisible: !this.state.iconsVisible,
    });
  }
  _onNavAway = () => {
    this.setState({
      menuVisible: !this.state.menuVisible,
    });
  }

}

const styles = StyleSheet.create({
  btnMainContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMain: {
    width: 150,
    height: 150,
  },
  btnList: {
    width: 100,
    height: 100,
  },
  listBtnStyle: {
    position: 'absolute',
    right: 10,
    bottom: 8,
  },
  listBtnHidden: {
    height: 0,
    opacity: 0,
  },
  filter: {
    position: 'absolute',
    left: width * 0.1,
    top: 15,
  },
  filterBtn: {
    width: width * 0.8,
    height: width * 0.14,
  },
});
