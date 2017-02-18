import React from 'react';
import { Components } from 'exponent';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import MapMarker from './MapMarker';
import Actions from '../state/Actions';

@connect((data) => EventList.getDataProps(data))
export default class EventList extends React.Component {

  state = {
    loadDelay: false,
  }

  componentDidMount() {
    setTimeout(() => this.setState({loadDelay: true}), 1000);
  }

  static getDataProps(data) {
    return {
      events: data.events.nearbyEvents,
      region: data.events.region,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(nextProps.events, this.props.events) ||
      this.props.iconsVisible !== nextProps.iconsVisible ||
      this.state.loadDelay !== nextState.loadDelay;
  }

  render() {
    let events = [];
    console.log(this.state.loadDelay);
    if (this.props.iconsVisible && this.state.loadDelay) {
      events = this.props.events;
    }
      return (
        <Components.MapView
          style={{ flex: 1, backgroundColor: '#fff' }}
          initialRegion={this.props.region}
          onRegionChangeComplete={this._onRegionChange}>
          {
            events.map(event =>
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
