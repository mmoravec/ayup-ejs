import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Text,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import ActionTypes from '../state/ActionTypes';
import EventListModal from '../components/EventListModal';
import MenuModal from '../components/MenuModal';
import MapView from '../components/EventMap';
import Filters from '../utils/filters';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect((data) => HomeScreen.getDataProps(data))
export default class HomeScreen extends React.Component {

  static getDataProps(data) {
    return {
      events: Filters.filterEvents(data.events.nearbyEvents, data.events.filters),
      region: data.events.region,
      phone: data.phone,
      cred: data.credential,
    };
  }

  state = {
    listVisible: false,
    menuVisible: false,
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

    let mapProps = {
      events: this.props.events,
      region: this.props.region,
    };
    if (this.props.phone.locationGranted && this.props.region.latitude) {
      return (
        <View style={{flex: 1}}>
          <MapView {...mapProps} />
          <View style={styles.btnMainContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this._onMenuBtnPress}>
              <Image
                source={require('../assets/images/btn_main2.png')}
                style={styles.btnMain}
              />
            </TouchableOpacity>
          </View>
          <View style={this.state.listBtnStyle}>
            <TouchableOpacity activeOpacity={0.5} onPress={this._onListBtnPress}>
              <Image
                style={styles.btnList}
                source={require('../assets/images/btn_list.png')}
              />
            </TouchableOpacity>
          </View>
          <EventListModal {...listProps} />
          <MenuModal {...menuProps} />
        </View>
      );
    } else {
      return (
        <View>
          <ActivityIndicator style={{alignSelf: 'center', marginTop: 200}} />
          {this._renderLocationWarning()}
          {this._renderLocationGreeting()}
        </View>
      );
    }
  }

  _renderLocationWarning = () => {
    if (this.props.phone.locationGranted === "denied") {
      console.log('render location warning');
      return (
        <Modal
          animationType={"none"}
          transparent={false}
          onRequestClose={this._locationWarningClose}
          visible={this.props.menuVisible}>
          <View style={{marginTop: 100}}>
            <Text>You must enable location in settings!</Text>
          </View>
        </Modal>
      );
    }
  }

  _renderLocationGreeting = () => {
    if (this.props.phone.locationGranted === false) {
      console.log('render location greeting');
      return (
        <Modal
          animationType={"none"}
          transparent={true}
          style={{flex: 1}}
          onRequestClose={this._locationWarningClose}
          visible={this.props.menuVisible}>
          <View style={{margin: 50, backgroundColor: '#fff', height: height * 0.6, marginTop: height * 0.2, justifyContent: 'space-between'}}>
            <View>
              <Text>Welcome to Ayup! Let's get started. We'll first need your location to surface events near you.</Text>
            </View>
            <TouchableOpacity onPress={this._grantLocation}>
              <View style={{width: 'auto', alignItems: 'center', marginBottom: 10}}>
                <Image
                  style={styles.btnLocation}
                  source={require('../assets/images/btn_ready.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    }
  }

  _locationWarningClose = () => {
    // console.log("won't close");
  }

  _grantLocation = () => {
    this.props.dispatch(Actions.grantLocation());
  }

  _onListBtnPress = () => {
    this.setState({
      listVisible: !this.state.listVisible,
      listBtnStyle: styles.listBtnHidden,
    });
  }

  _onCloseBtnPress = () => {
    this.setState({
      listVisible: !this.state.listVisible,
      listBtnStyle: styles.listBtnStyle,
    });
  }

  _onMenuBtnPress = () => {
    this.setState({
      menuVisible: !this.state.menuVisible,
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
  btnLocation: {
    height: 38,
    width: 140,
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
});
