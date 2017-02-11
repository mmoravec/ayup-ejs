import React from 'react';
import { Components } from 'exponent';
import { connect } from 'react-redux';
import Icons from '../constants/icons';
import Actions from '../state/Actions';


@connect((data) => EventList.getDataProps(data))
export default class EventList extends React.Component {
  static getDataProps(data) {
    return {
      events: data.events.nearbyEvents,
      region: data.events.region,
    };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.events !== this.props.events;
  }

  render() {
    return (
      <Components.MapView
        style={{ flex: 1, backgroundColor: '#fff' }}
        initialRegion={this.props.region}
        onRegionChangeComplete={this._onRegionChange}>
        {
          this.props.events.map(event => {
            let { location, title, id, activity } = event;
            let coord = {longitude: location.coordinates[0], latitude: location.coordinates[1]};
            let icon = Icons[activity].icon;
            return (
              <Components.MapView.Marker
                key={id}
                coordinate={coord}
                title={title}
                image={icon}
              />
            );
          })
        }

      </Components.MapView>
    );
  }

  _onRegionChange = (region) => {
    this.props.dispatch(Actions.regionChange(region.longitude, region.latitude));
  }

}
