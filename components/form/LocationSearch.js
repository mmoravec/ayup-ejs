import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Modal,
} from 'react-native';
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
         <Hoshi
           editable={isEditable}
           label={'Location'}
           onFocus={() => this.setState({showPicker: true})}
           borderColor={'#8bd1c6'}
           value={this.props.location}
         />
         {this._renderLocationPicker()}
       </View>
     );
   }

   _renderLocationPicker() {
     if (this.state.showPicker) {
       return (
         <Modal style={styles.scrollView} onRequestClose={this._onRequestClose} animationType={"slide"}>
           <GooglePlacesAutocomplete
             placeholder={'Enter Location'}
             minLength={2}
             autoFocus={true}
             fetchDetails={true}
             onPress={this._getLocation}
             query={{
               // available options: https://developers.google.com/places/web-service/autocomplete
               key: 'AIzaSyBJrRZZzqMfcfZwHy5oxg_7R_gjlNCHiTQ',
               language: 'en', // language of the results
             }}
             styles={{
               textInputContainer: {
                 backgroundColor: 'rgba(0,0,0,0)',
                 borderTopWidth: 0,
                 borderBottomWidth:0,
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
         </Modal>
       );
     } else {
       return null;
     }
   }

   _onRequestClose = () => {
     this.setState({showPicker: false});
   }

   _getLocation = (data, details) => {
     this.props.onChange(details.name, details.geometry);
     this.setState({showPicker: false});
   }

}
const styles = StyleSheet.create({
  pickText: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 20,
  },
  scrollView: {
    backgroundColor: '#FFF',
  },
  view: {

  }
});
