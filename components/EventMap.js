import React from 'react';
import { Components } from 'exponent';
import { connect } from 'react-redux';
import { LayoutAnimation } from 'react-native';
import Immutable from 'immutable';
import MapMarker from './MapMarker';
import Actions from '../state/Actions';
import MapStyle from '../constants/mapstyle';

@connect((data) => EventList.getDataProps(data))
export default class EventList extends React.Component {

  state = {
    loadDelay: false,
  }

  componentDidMount() {
    setTimeout(() => this.setState({loadDelay: true}), 1000);
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  static getDataProps(data) {
    return {
      events: data.events.nearbyEvents,
      region: data.events.region,
      filters: data.events.filters,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(nextProps.events, this.props.events) ||
      this.props.iconsVisible !== nextProps.iconsVisible ||
      this.state.loadDelay !== nextState.loadDelay;
  }

  render() {
      return (
        <Components.MapView
          style={{ flex: 1, backgroundColor: '#fff' }}
          initialRegion={this.props.region}
          provider={"google"}
          customMapStyle={MapStyle}
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
