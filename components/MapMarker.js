import React from 'react';
import { Components } from 'expo';
import { connect } from 'react-redux';
import { LayoutAnimation } from 'react-native';
import Icons from '../constants/icons';
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
     <Components.MapView.Marker
       key={id}
       coordinate={coord}
       image={icon}
       onPress={this._onMarkerPress}
     />
   );
 }

 _onMarkerPress = () => {
   //TODO: create a saga for this when fetching comments becomes
   this.props.dispatch(Actions.selectEvent(this.props.event));
   this.props.dispatch(Actions.routeChange('event'));
 }

}
