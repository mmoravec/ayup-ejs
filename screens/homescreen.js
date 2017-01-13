import React from 'react';
import { connect } from 'react-redux';
import { Components } from 'exponent';
import Router from '../navigation/router';
import ActionTypes from '../state/ActionTypes';

@connect()
export default class HomeScreen extends React.Component {

  render() {
    return (
      <Components.MapView
        style={{ flex: 1, backgroundColor: '#fff' }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChange={::this.onRegionChange}
      >
        <Components.MapView.UrlTile
          urlTemplate="http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
      </Components.MapView>
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
