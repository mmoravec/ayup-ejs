import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { MapView } from 'expo';
import { connect } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Actions from '../../state/Actions';
import Hoshi from '../common/Hoshi';
const dismissKeyboard = require('dismissKeyboard');
const {height, width} = Dimensions.get('window');

@connect((data) => LocationSearch.getDataProps(data))
export default class LocationSearch extends React.Component {

  static getDataProps(data) {
    return {
      region: data.events.region,
    };
  }

  state = {
    focusLocation: false,
    hasFocused: false,
    region: null,
    regionChangeCount: 0,
  }
  _yOffset = 0;
  _scrollY = height * 0.25 + 3 * 48;

  componentDidMount() {
    this.props.dispatch(Actions.resetAddress());
    if (this.props.label === "Destination") {
      this._scrollY = height * 0.25 + 4 * 48;
    } 
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.focus) {
      this.setState({focusLocation: true});
      this.setState({hasFocused: true});
      dismissKeyboard();
    } else {
      this.setState({focusLocation: false});
    }
  }

  render() {
    return (
      <View>
        <TouchableHighlight
          onPress={this._onLocationPress}
          ref={view => { this._view = view; }}
          underlayColor={'#f1f1f1'}>
          <View>
            <View pointerEvents={'none'}>
              <Hoshi
                value={this.props.value}
                editable={false}
                label={this.props.label}
                borderColor={'#8bd1c6'}
                onFocus={this._onLocationPress}
                focus={this.props.focus}
              />
            </View>
          </View>
        </TouchableHighlight>
        {this._renderLocation()}
      </View>
    );
  }

  _getNextTime = () => {
    let date = new Date();
    let time = date.getTime();
    let mint = date.getMinutes();
    let nDate = new Date(time + (Math.ceil((mint / 15)) * 15 - mint) * 60000);
    return nDate;
  }

  _renderLocation = () => {
    if (this.props.focus) {
      let location = this.props.lnglat[0] ? { latitude: this.props.lnglat[1], longitude: this.props.lnglat[0], latitudeDelta: 0.0249666, longitudeDelta: 0.017766} : this.props.region;
      return (
        <View>
          <GooglePlacesAutocomplete
            ref={view => { this._gplaces = view; }}
            placeholder={'Location Search'}
            placeholderTextColor={'#6a7989'}
            minLength={2}
            keyboardShouldPersistTaps={'always'}
            autoFocus={false}
            fetchDetails={true}
            onPress={this._getLocation}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyBJrRZZzqMfcfZwHy5oxg_7R_gjlNCHiTQ',
              language: 'en', // language of the results
            }}
            textInputProps={{
              onFocus: this._inputFocused,
            }}
            styles={{
              textInputContainer: {
                backgroundColor: '#fff',
                borderTopWidth: 0,
                marginTop: 20,
                marginBottom: 3,
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: '#6a7989',
                fontSize: 16,
                fontFamily: 'LatoRegular',
              },
              predefinedPlacesDescription: {
                color: '#000',
              },
              description: {
                color: '#6a7989',
              },
            }}
            currentLocation={false}
          />
          <View style={{flex: 1, height: height * 0.4, width}}>
            <MapView
              style={{backgroundColor: '#fff', height: height * 0.4, width, zIndex: 1}}
              initialRegion={location}
              region={this.state.region}
              provider={"google"}
              zoomEnabled={true}
              onRegionChange={this._moveMarker}
              onRegionChangeComplete={this._onRegionChange}
            >
            </MapView>
            <View style={{backgroundColor: 'transparent', width: 18, height: 30, top: height * 0.155, left: width * 0.48, position: 'absolute', zIndex: 2}}>
              <Ionicons
                size={32}
                name={'ios-pin'}
                style={styles.image}
                backgroundColor={'transparent'}
                color={'#ee366f'}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  _moveMarker = (region) => {
    this.setState({region});
  }

  _getLocation = (data, details) => {
    let region = {
      longitude: details.geometry.location.lng,
      latitude: details.geometry.location.lat,
      longitudeDelta: this.state.region ? this.state.region.longitudeDelta : 0.0399327278137207,
      latitudeDelta: this.state.region ? this.state.region.latitudeDelta : 0.02496758212897987,
    };
    this.setState({region, regionChangeCount: 0});
    this.props.dispatch(Actions.setFormLocation(
      this.props.stateKey,
      details.formatted_address,
      details.geometry.location.lng,
      details.geometry.location.lat,
    ));
  }

  _onLocationPress = () => {
    this.props.dispatch(Actions.focusField(this.props.stateKey));
    setTimeout(() => {
      this._view.measure((fx, fy, width, height, px, py) => {
        this.props.scrollTo(py - 80);
      });
    }, 100);

  }

  _onRegionChange = (region) => {
    this.setState({regionChangeCount: this.state.regionChangeCount + 1});
    if (this.state.regionChangeCount > 0) {
      this._gplaces.setAddressText('');
    }
    this.props.dispatch(Actions.geoCode(
      region.latitude,
      region.longitude,
      this.props.stateKey
    ));
  }
}


const styles = StyleSheet.create({
  image: {
    marginBottom: 25,
  },
});
