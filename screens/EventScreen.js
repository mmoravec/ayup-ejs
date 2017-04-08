import React from 'react';
import { MapView } from 'expo';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import EventButton from '../components/EventButton'
import Icons from '../constants/activities';
import Content from '../components/EventContent';
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
    if (this.props.selectedEvent === null) {
      return <ActivityIndicator style={{marginTop: 200}} />;
    } else {
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
          <Content />
          <EventButton />
          <View style={styles.bottom} />
        </View>
      );
    }
  }

  _backBtnPress = () => {
    this.props.dispatch(Actions.selectEvent(null));
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
    width: 80,
    height: 80,
  },
  back: {
    position: 'absolute',
    zIndex: 100,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width,
    height: height * 0.5,
    backgroundColor: "#fff",
  },
});
