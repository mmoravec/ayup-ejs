import React from 'react';
import { Components } from 'exponent';
import { connect } from 'react-redux';
import MapMarker from './MapMarker';
import Actions from '../state/Actions';
import Immutable from 'immutable';

@connect((data) => EventList.getDataProps(data))
export default class EventList extends React.Component {

  static getDataProps(data) {
    return {
      events: data.events.nearbyEvents,
      region: data.events.region,
    };
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.events, this.props.events);
  }

  render() {
    return (
      <Components.MapView
        style={{ flex: 1, backgroundColor: '#fff' }}
        initialRegion={this.props.region}
        onRegionChangeComplete={this._onRegionChange}>
        {
          this.props.events.map(event =>
            <MapMarker key={event.id} event={event} />
          )
        }

      </Components.MapView>
    );
  }

  _onRegionChange = (region) => {
    this.props.dispatch(Actions.regionChange(region.longitude, region.latitude));
  }

}
