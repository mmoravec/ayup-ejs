import React from 'react';
import { Components } from 'exponent';
import { connect } from 'react-redux';
import Icons from '../constants/icons';
import Actions from '../state/Actions';
import Filter from '../utils/filters';

@connect((data) => EventList.getDataProps(data))
export default class EventList extends React.Component {

  static getDataProps(data) {
    return {
      filters: Filter.getSelectedActivitiesObject(data.events.filters),
    };
  }

 render() {
   let { location, id, activity } = this.props.event;
   let coord = {longitude: location.coordinates[0], latitude: location.coordinates[1]};
   let icon = Icons[activity].icon;
   if (this.props.filters[activity]) {
     return (
       <Components.MapView.Marker
         key={id}
         coordinate={coord}
         image={icon}
         onPress={this._onMarkerPress}
       />
     );
   } else {
     return null;
   }
 }

 _onMarkerPress = () => {
   //TODO: create a saga for this when fetching comments becomes
   this.props.dispatch(Actions.selectEvent(this.props.event));
   this.props.dispatch(Actions.routeChange('event'));
 }

}
