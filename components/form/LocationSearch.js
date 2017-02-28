import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  FontAwesome,
} from '@exponent/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Hoshi from '../common/Hoshi';
const {height, width} = Dimensions.get('window');

export default class LocationSearch extends React.Component {

  state = {
    showPicker: false,
  }

   render() {
     let isEditable = true;
     return (
       <View style={styles.view} >
         <GooglePlacesAutocomplete
           ref="gplaces"
           placeholder={'Enter Location'}
           minLength={2}
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
               color: '#5d5d5d',
               fontSize: 16,
             },
             predefinedPlacesDescription: {
               color: '#1faadb',
             },
           }}
           currentLocation={false}
         />
       </View>
     );
   }

   _getLocation = (data, details) => {
     this.props.onChange(details.name, details.geometry);
   }

   _inputFocused = () => {
     this.props.scrollTo(height * 0.4);
     this.props.onFocus();
   }

}
const styles = StyleSheet.create({
  pickText: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 50,
  },
  scrollView: {
    backgroundColor: '#FFF',
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});
