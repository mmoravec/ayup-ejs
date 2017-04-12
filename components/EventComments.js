import React from 'react';
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
const {width} = Dimensions.get('window');

export default class EventComments extends React.Component {


 render() {
     if (this.props.commenting) {
       console.log('if statement hit');
       console.log(this.props.commenting);
       return (
         <KeyboardAvoidingView behavior={'position'} style={{flex: 1, zIndex: 2, position:'absolute', bottom: 0}}>
           <View style={{height: 50, padding: 5, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: '#e9e9e9', flexDirection: 'row'}}>
             <View style={{height: 40, borderRadius: 5, borderWidth: 1, borderColor: "#c8c8cd", width: width * 0.85}}>
               <TextInput
                 autoFocus={true}
                 style={{margin: 5, height: 30, width: width * 0.85}}
                 value={this.props.comment}
                 onChangeText={this.props.onChangeText}
               />
             </View>
             <TouchableOpacity style={{alignSelf: 'center'}} onPress={this.props.saveComment}>
               <Image
                 source={require('../assets/images/reply.png')}
                 style={{height: 25}}
                 resizeMode={'contain'}
               />
             </TouchableOpacity>
           </View>
         </KeyboardAvoidingView>
       );
     } else {
       return null;
     }
  }
}
