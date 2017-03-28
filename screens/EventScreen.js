import React from 'react';
import { MapView } from 'expo';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Icons from '../constants/icons';
import Comments from '../components/Comments';
import MapStyle from '../constants/mapstyle';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect(data => EventScreen.getDataProps(data))
export default class EventScreen extends React.Component {

  static getDataProps(data) {
    return {
      selectedEvent: data.events.selectedEvent,
    };
  }

  render() {
    let event = this.props.selectedEvent;
    let coord = {
      longitude: event.location.coordinates[0],
      latitude: event.location.coordinates[1] - 0.008,
      latitudeDelta: 0.003850375166415176,
      longitudeDelta: 0.01609325556559327,
    };
    let marker = {
      longitude: event.location.coordinates[0],
      latitude: event.location.coordinates[1],
      latitudeDelta: 0.003850375166415176,
      longitudeDelta: 0.01609325556559327,
    };
    let icon = Icons[event.activity].icon;
    return (
      <View style={styles.scrollView}>
        <MapView
          style={styles.map}
          onRegionChangeComplete={this._onRegionChange}
          zoomEnabled={false}
          customMapStyle={MapStyle}
          scrollEnabled={false}
          provider={"google"}
          initialRegion={coord}>
          <MapView.Marker
            key={0}
            coordinate={marker}
            image={icon}
          />
        </MapView>
        <TouchableOpacity style={styles.back} underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableOpacity>
        <Comments event={this.props.selectedEvent} />
      </View>
    );
  }

  _backBtnPress = () => {
    this.props.dispatch(Actions.routeChange('Back'));
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  form: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  map: {
    flex: 1,
    zIndex: 0,
    position: 'absolute',
    height,
    width,
  },
  figure: {
    justifyContent: 'center',
    marginLeft: 20,
  },
  btnBack: {
    width: 40,
    height: 40,
  },
  back: {
    left: 15,
    top: 15,
    position: 'absolute',
    zIndex: 100,
  },
});
