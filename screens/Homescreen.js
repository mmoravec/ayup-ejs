import React from 'react';
import { Components } from 'exponent';

export default class HomeScreen extends React.Component {

  render() {
    return (
      <Components.MapView
        style={{ flex: 1, backgroundColor: '#fff' }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Components.MapView.UrlTile
          urlTemplate="http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />  
      </Components.MapView>
    );
  }
}
