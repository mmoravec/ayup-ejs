import React from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  Platform,
  Image,
  DatePickerIOS,
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
      address: data.events.geocodeAddress,
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

  componentDidMount() {
    setTimeout(() => {
      this._view.measure((fx, fy, width, height, px, py) => {
        this._scrollY = py;
      });
    }, 200);
    this.props.dispatch(Actions.resetAddress());
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
    let location = "";
    if (this.state.hasFocused && this.props.date !== '') {
      location = this.props.address.name;
    }
    return (
      <View>
        <TouchableHighlight
          onPress={this._onLocationPress}
          ref={view => { this._view = view; }}
          underlayColor={'#f1f1f1'}>
          <View>
            <View pointerEvents={'none'}>
              <Hoshi
                value={location}
                editable={false}
                label={this.props.label}
                borderColor={'#8bd1c6'}
                onFocus={this._onLocationPress}
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
    if (this.state.focusLocation) {
      let location = this.props.address.lat ? { latitude: this.props.address.lat, longitude: this.props.address.long, latitudeDelta: 0.0249666, longitudeDelta: 0.017766} : this.props.region;
      return (
        <View>
          <GooglePlacesAutocomplete
            ref={view => { this._gplaces = view; }}
            placeholder={'Enter Location'}
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
              container: {
                borderBottomWidth: 2,
                borderBottomColor: '#b9c1ca',
              },
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
          <MapView.Animated
            style={{ flex: 1, backgroundColor: '#fff', height: height * 0.4, width: width * 0.9, justifyContent: 'center'}}
            initialRegion={location}
            region={this.state.region}
            provider={"google"}
            zoomEnabled={true}
            onRegionChange={this._moveMarker}
            onRegionChangeComplete={this._onRegionChange}>
            <View style={{backgroundColor: 'transparent', width: 20, height: 45, alignSelf: 'center'}}>
              <Ionicons
                size={32}
                name={'ios-pin'}
                style={styles.image}
                backgroundColor={'transparent'}
                color={'#ee366f'}
              />
            </View>
          </MapView.Animated>
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
    let coord = [details.geometry.location.lng, details.geometry.location.lat];
    let region = {
      longitude: details.geometry.location.lng,
      latitude: details.geometry.location.lat,
      longitudeDelta: this.state.region ? this.state.region.longitudeDelta : 0.0399327278137207,
      latitudeDelta: this.state.region ? this.state.region.latitudeDelta : 0.02496758212897987,
    }
    this.setState({region, regionChangeCount: 0});
    this.props.onChange(details.formatted_address, coord);
  }

  _onLocationPress = () => {
    this.props.onFocus(this.props.stateKey);
    this.props.scrollTo(this._scrollY - 80);
  }

  _onRegionChange = (region) => {
    this.setState({regionChangeCount: this.state.regionChangeCount + 1});
    console.log(this.state.regionChangeCount);
    if (this.state.regionChangeCount > 0) {
      this._gplaces.setAddressText('');
    }
    this.props.dispatch(Actions.geoCode(
      region.latitude,
      region.longitude,
    ));
  }
}


const styles = StyleSheet.create({
  image: {
    backgroundColor: 'transparent',
    marginBottom: 25,
  }
});
