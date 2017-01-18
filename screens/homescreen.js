import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { Components } from 'exponent';
import Router from '../navigation/router';
import ActionTypes from '../state/ActionTypes';

@connect(data => HomeScreen.getDataProps(data))
export default class HomeScreen extends React.Component {

  static getDataProps(data) {
    return {
      events: data.events.nearbyEvents,
    };
  }

  render() {
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
          onRegionChangeComplete={::this.onRegionChange}
        >
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
            )
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
      </View>
    );
  }

  onRegionChange(region) {
    this.props.dispatch({
      type: ActionTypes.REGION_CHANGE,
      longitude: region.longitude,
      latitude: region.latitude,
    });
  }
}

const styles = StyleSheet.create({
  btnMainContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMain: {
    width: 100,
    height: 100,
  },
});
