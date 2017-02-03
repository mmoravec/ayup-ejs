import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
} from 'react-native';
import { Components } from 'exponent';
import ActionTypes from '../state/ActionTypes';
import EventListModal from '../components/EventListModal';
import Actions from '../state/Actions';

@connect(data => HomeScreen.getDataProps(data))
export default class HomeScreen extends React.Component {

  state = {
    listVisible: false,
    listBtnStyle: {
      position: 'absolute',
      right: 10,
      bottom: 8,
    },
  }

  static getDataProps(data) {
    return {
      events: data.events.nearbyEvents,
    };
  }

  render() {
    let listProps = {
      key: 'list',
      events: this.props.events,
      listVisible: this.state.listVisible,
      listBtnPress: this._onListBtnPress,
      closeBtnPress: this._onCloseBtnPress,
    };
    return (
      <View style={{flex: 1}}>
        <Components.MapView
          style={{ flex: 1, backgroundColor: '#fff' }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChangeComplete={this.onRegionChange}>
          {
            this.props.events.map(event => {
              let { location, title, id } = event;
              let coord = {longitude: location.coordinates[0], latitude: location.coordinates[1]};
              return (
                <Components.MapView.Marker
                  key={id}
                  coordinate={coord}
                  title={title}
                />
              );
            })
          }
          <Components.MapView.UrlTile
            urlTemplate="http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          />
        </Components.MapView>
        <View style={styles.btnMainContainer}>
          <Image
            source={require('../assets/images/btn_main.png')}
            style={styles.btnMain}
          />
        </View>
        <View style={this.state.listBtnStyle}>
          <TouchableHighlight underlayColor="transparent" onPress={this._onListBtnPress}>
            <Image
              style={styles.btnList}
              source={require('../assets/images/btn_list.png')}
            />
          </TouchableHighlight>
        </View>
        <EventListModal {...listProps} />
      </View>
    );
  }

  onRegionChange = (region) => {
    this.props.dispatch(Actions.regionChange(region.longitude, region.latitude));
  }

  _onListBtnPress = () => {
    this.setState({listVisible: !this.state.listVisible});
    this.setState({listBtnStyle: {
      height: 0,
      opacity: 0,
      position: 'absolute',
      right: 10,
      bottom: 8,
    }});
  }

  _onCloseBtnPress = () => {
    this.setState({listVisible: !this.state.listVisible});
    this.setState({listBtnStyle: {
      position: 'absolute',
      right: 10,
      bottom: 8,
    }});
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
    width: 110,
    height: 110,
  },
  btnList: {
    width: 85,
    height: 85,
  },
});
