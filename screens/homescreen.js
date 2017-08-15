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
import { MaterialIcons } from '@expo/vector-icons';
import ActionTypes from '../state/ActionTypes';
import EventListModal from '../components/EventListModal';
import MenuModal from '../components/MenuModal';
import ActivitiesModal from '../components/ActivitiesModal';
import MapView from '../components/EventMap';
import InformUser from '../components/InformUser';
import MyText from '../components/common/MyText';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect((data) => HomeScreen.getDataProps(data))
export default class HomeScreen extends React.Component {

  static getDataProps(data) {
    return {
      unfiltered: data.events.unfilteredEvents,
      events: data.events.nearbyEvents,
      venues: data.events.nearbyVenues,
      allEvents: data.events.allEvents,
      phone: data.phone,
      filters: data.events.filters,
    };
  }

  state = {
    listVisible: false,
    menuVisible: false,
    filtersVisible: false,
    listBtnStyle: styles.listBtnStyle,
    showVenue: false,
    venueEvents: [],
  }

  render() {
    let listProps = {
      key: 'list',
      events: this.state.showVenue ? this.state.venueEvents : this.props.allEvents,
      listVisible: this.state.listVisible,
      listBtnPress: this._onListBtnPress,
      closeBtnPress: this._onCloseBtnPress,
    };

    let menuProps = {
      key: 'menu',
      menuVisible: this.state.menuVisible,
      menuBtnPress: this._onMenuBtnPress,
      navAway: this._onNavAway,
      onFilterPress: this._onFilterPress,
    };

    let filterProps = {
      onFilterPress: this._onFilterPress,
      events: this.props.events,
      filtersVisible: this.state.filtersVisible,
      filters: this.props.filters,
    }

    let mapProps = {
      events: this.props.events,
      venues: this.props.venues,
      onMarkerClick: this._onMarkerClick,
    };
    if (this.props.phone.locationGranted) {
      return (
        <View style={{flex: 1}}>
          <MapView {...mapProps} />
          <View style={styles.btnMainContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this._onMenuBtnPress}>
              <Image
                source={require('../assets/images/btn_main2.png')}
                style={[styles.btnMain, {opacity: !this.state.menuVisible ? 1 : 0}]}
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
          <ActivitiesModal {...filterProps} />
          <InformUser events={this.props.allEvents} />
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
      return (
        <Modal
          animationType={"none"}
          transparent={false}
          onRequestClose={this._locationWarningClose}
          visible={this.props.menuVisible}>
          <View style={{marginTop: 100, justifyContent: 'center'}}>
            <MyText style={{fontSize: 24, width: width * 0.8}}>You must enable location in settings to use the app</MyText>
          </View>
        </Modal>
      );
    }
  }

  _renderLocationGreeting = () => {
    if (this.props.phone.locationGranted === false) {
      return (
        <Modal
          animationType={"none"}
          transparent={true}
          onRequestClose={this._locationWarningClose}
          visible={this.props.menuVisible}>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
            <Image
              style={{width, height: width * 1.33, justifyContent: 'flex-end'}}
              resizeMode={'contain'}
              source={require('../assets/images/location_grant.png')}>
              <TouchableOpacity onPress={this._grantLocation}>
                <View style={{width: 'auto', alignSelf: 'center', marginBottom: 50}}>
                  <Image
                    style={styles.btnLocation}
                    source={require('../assets/images/btn_ready.png')}
                  />
                </View>
              </TouchableOpacity>
            </Image>
          </View>
        </Modal>
      );
    }
  }

  _onMarkerClick = (showVenue, venueEvents) => {
    this.setState({
      showVenue,
      venueEvents,
    });
    if (showVenue) {
      this.setState({
        listVisible: !this.state.listVisible,
        listBtnStyle: styles.listBtnHidden,
      });
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
      showVenue: false,
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

  _onlocationResetPress = () => {
    this.props.dispatch(Actions.resetLocation());
  }

  _onFilterPress = () => {
    this.setState({filtersVisible: !this.state.filtersVisible});
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
