import React from 'react';
import { MapView } from 'expo';
import { connect } from 'react-redux';
import MapMarker from './MapMarker';
import Actions from '../state/Actions';
import MapStyle from '../constants/mapstyle';

@connect((data) => EventMap.getDataProps(data))
export default class EventMap extends React.Component {

  static getDataProps(data) {
    return {
      region: data.events.region,
    };
  }

  render() {
    if (this.props.region.latitude) {
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
    } else {
      return null;
    }
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
