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
      updateRegion: data.events.updateRegion,
    };
  }

  state = {
    region: null,
    setRegion: false,
  }

  componentDidMount() {
    setTimeout(() => { 
      this.setState({setRegion: true});
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updateRegion !== this.props.updateRegion) {
      this.setState({region: nextProps.updateRegion});
    }
  }

  render() {
    if (this.props.updateRegion.latitude) {
      return (
        <MapView
          style={{ flex: 1, backgroundColor: '#fff' }}
          provider={"google"}
          customMapStyle={MapStyle}
          initialRegion={this.props.updateRegion}
          region={this.state.region}
          zoomEnabled={true}
          onRegionChange={this._onRegionChange}
          onRegionChangeComplete={this._onRegionChangeComplete}>
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

  _onRegionChangeComplete = (region) => {
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

  _onRegionChange = (region) => {
    if (this.state.setRegion) {
      this.setState({region});
    }
  }

}
