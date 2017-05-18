import React from 'react';
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  Image,
  Keyboard,
  Animated,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
const {width, height} = Dimensions.get('window');

export default class EventComments extends React.Component {

  state = {
    keyboardOffset: new Animated.Value(0),
  };

  constructor(props) {
    super(props);

    this.handleKeyboardShow = this.handleKeyboardShow.bind(this);
    this.handleKeyboardHide = this.handleKeyboardHide.bind(this);

    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
    Keyboard.addListener('keyboardWillShow', this.handleKeyboardShow);
    Keyboard.addListener('keyboardWillHide', this.handleKeyboardHide);
    Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
  }

  handleKeyboardShow({endCoordinates: { height }}) {
    Animated.timing(this.state.keyboardOffset, {toValue:height, duration: 0}).start();
  }

  handleKeyboardHide() {
      Animated.timing(this.state.keyboardOffset, {toValue:0, duration: 0}).start();
  }


 render() {
     if (this.props.showCommentBox) {
       return (
         <Animated.View style={{ backgroundColor: '#f34', flex: 1, zIndex: 2, position:'absolute', bottom: this.state.keyboardOffset}}>
           <View style={{height: 50, padding: 5, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: '#e9e9e9', flexDirection: 'row'}}>
             <View style={{height: 40, borderRadius: 5, borderWidth: 1, borderColor: "#c8c8cd", width: width * 0.85}}>
               <TextInput
                 autoFocus={true}
                 style={{margin: 5, height: 30, width: width * 0.85}}
                 value={this.props.comment}
                 underlineColorAndroid={'transparent'}
                 onChangeText={this.props.onChangeText}
               />
             </View>
             <TouchableOpacity style={{alignSelf: 'center'}} onPress={this.props.saveComment}>
               <Image
                 source={require('../../assets/images/reply.png')}
                 style={{height: 25}}
                 resizeMode={'contain'}
               />
             </TouchableOpacity>
           </View>
         </Animated.View>
       );
     } else {
       return null;
     }
  }
}
