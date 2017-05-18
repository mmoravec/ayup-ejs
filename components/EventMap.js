import React from 'react';
import { MapView } from 'expo';
import { connect } from 'react-redux';
import MapMarker from './MapMarker';
import Actions from '../state/Actions';
import MapStyle from '../constants/mapstyle';

@connect()
export default class EventMap extends React.Component {

  render() {
      return (
        <MapView
          style={{ flex: 1, backgroundColor: '#fff' }}
          region={this.props.region}
          provider={"google"}
          customMapStyle={MapStyle}
          zoomEnabled={true}
          onRegionChangeComplete={this._onRegionChange}>
          {
            this.props.events.map(event =>
              <MapMarker key={event.id} event={event} />
            )
          }
        </MapView>
      );
  }

  _onRegionChange = (region) => {
    //sometimes map resets, make sure its not
    if (region.latitude !== 0) {
      this.props.dispatch(Actions.regionChange(
        region.longitude,
        region.latitude,
        region.longitudeDelta,
        region.latitudeDelta,
      ));
    }

  }

}
