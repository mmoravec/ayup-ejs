import React from 'react';
import { Components } from 'exponent';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import Icons from '../constants/icons';
import Actions from '../state/Actions';

@connect(data => EventScreen.getDataProps(data))
export default class EventScreen extends React.Component {

  static getDataProps(data) {
    return {
      selectedEvent: data.events.selectedEvent,
    };
  }

  render() {
    console.log(this.props);
    let event = this.props.selectedEvent;
    let coord = {
      longitude: event.location.coordinates[0],
      latitude: event.location.coordinates[1],
      latitudeDelta: 0.003850375166415176,
      longitudeDelta: 0.01609325556559327,
    };
    let icon = Icons[event.activity].icon;
    return (
      <View style={styles.container}>
        <Components.MapView
          style={styles.map}
          onRegionChangeComplete={this._onRegionChange}
          zoomEnabled={false}
          scrollEnabled={false}
          initialRegion={coord}>
          <Components.MapView.Marker
            key={0}
            coordinate={coord}
            image={icon}
          />
        </Components.MapView>
        <TouchableHighlight style={styles.back} underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableHighlight>
        <View style={styles.info}>
          <View style={styles.header}>
            <Text>{event.title}</Text>
          </View>
          <View style={styles.body}>
            <Text>{event.description}</Text>
          </View>
        </View>
      </View>
    );
  }

  _backBtnPress = () => {
    this.props.dispatch(Actions.routeChange('home'));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  info: {
    flex: 4,
  },
  btnBack: {
    width: 40,
    height: 40,
  },
  back: {
    left: 15,
    top: 15,
    position: 'absolute',
  },
});
