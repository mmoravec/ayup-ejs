import React from 'react';
import { MapView } from 'expo';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import MapMarker from './MapMarker';
import Actions from '../state/Actions';
import MapStyle from '../constants/mapstyle';
import AltMapStyle from '../constants/mapstylevar';

@connect(data => EventMap.getDataProps(data))
export default class EventMap extends React.Component {

  static getDataProps(data) {
    return {
      phone: data.phone,
    };
  }

  state = {
    loadDelay: false,
  }

  componentDidMount() {
    setTimeout(() => this.setState({loadDelay: true}), 1000);
  }

  render() {
    if (this.props.phone.optlyVariation === "apple") {
      return (
        <MapView
          style={{ flex: 1, backgroundColor: '#fff' }}
          initialRegion={this.props.region}
          provider={"google"}
          customMapStyle={AltMapStyle}
          zoomEnabled={false}
          onRegionChangeComplete={this._onRegionChange}>
          {
            this.props.events.map(event =>
              <MapMarker key={event.id} event={event} />
            )
          }
        </MapView>
      );
    } else if (this.props.phone.optlyVariation === "google") {
      return (
        <MapView
          style={{ flex: 1, backgroundColor: '#fff' }}
          initialRegion={this.props.region}
          provider={"google"}
          zoomEnabled={false}
          onRegionChangeComplete={this._onRegionChange}>
          {
            this.props.events.map(event =>
              <MapMarker key={event.id} event={event} />
            )
          }
        </MapView>
      );
    } else {
      return (
        <MapView
          style={{ flex: 1, backgroundColor: '#fff' }}
          initialRegion={this.props.region}
          provider={"google"}
          customMapStyle={MapStyle}
          zoomEnabled={false}
          onRegionChangeComplete={this._onRegionChange}>
          {
            this.props.events.map(event =>
              <MapMarker key={event.id} event={event} />
            )
          }
        </MapView>
      );
    }

  }

  _onRegionChange = (region) => {
    this.props.dispatch(Actions.regionChange(
      region.longitude,
      region.latitude,
      region.longitudeDelta,
      region.latitudeDelta,
    ));
  }

}
