import _ from "lodash";
import React from 'react';
import { MapView } from 'expo';
import { connect } from 'react-redux';
import { LayoutAnimation } from 'react-native';
import Icons from '../constants/activities';
import Actions from '../state/Actions';

@connect()
export default class EventList extends React.Component {

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

 render() {
   let { location, id, activity } = this.props.event;
   let coord = {longitude: location.coordinates[0], latitude: location.coordinates[1]};
   let icon = Icons[activity].icon;
   return (
     <MapView.Marker
       key={id}
       coordinate={coord}
       image={icon}
       onPress={this._onMarkerPress}
     />
   );
 }

  _onMarkerPress = _.debounce(() => {
      if (this.props.venue) {
        this.props.onMarkerClick(true, this.props.event.events);
      } else {
        this.props.onMarkerClick(false, null);
        this.props.dispatch(Actions.selectEvent(this.props.event.id));
        this.props.dispatch(Actions.routeChange('Event'));
      }
    }, 3000, {
      leading: true,
    });
   //TODO: create a saga for this when fetching comments becomes


}
