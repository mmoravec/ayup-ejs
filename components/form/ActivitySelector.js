import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
} from 'react-native';
import {
  Ionicons,
} from '@expo/vector-icons';
import { connect } from 'react-redux';
import _ from 'lodash';
import Activities from '../../constants/activities';
import MyText from '../common/MyText';
import Hoshi from '../common/Hoshi';
const dismissKeyboard = require('dismissKeyboard');
const {height, width} = Dimensions.get('window');

@connect()
export class ActivitySelector extends React.Component {

   render() {
     return (
       <View>
         <View style={styles.activity}>
           <TouchableOpacity onPress={this._activityPunch}>
             <View>
               <Image style={styles.circle} source={require('../../assets/images/small_circle.png')}>
                 {(this.props.value !== "") ?
                  <Image
                    source={Activities[this.props.value].image}
                    style={styles.activityImage}
                  /> :
                  <Image
                    source={require('../../assets/images/ayup_icon.png')}
                    style={styles.activityImage}
                  />
                 }
               </Image>
             </View>
           </TouchableOpacity>
         </View>
         {this._renderSelectForm()}  
       </View>
     );
   }

   _renderSelectForm() {
     if (this.props.focus) {
       return (
         <Modal style={styles.scrollView} onRequestClose={this._activityPunch}>
           <Text style={styles.pickText}>Select an Activity</Text>
           <TouchableOpacity onPress={this._activityPunch} style={styles.back}>
             <Ionicons
               size={40}
               name={'ios-close-circle-outline'}
             />
           </TouchableOpacity>
           <ScrollView contentContainerStyle={styles.form}>
             {
             _.values(Activities).map(icon => {
              let { id, image, type, name } = icon;
              return (
                <TouchableOpacity
                  style={styles.icon}
                  key={id}
                  onPress={() => this._filterClick(type)}
                  underlayColor="transparent">
                  <Image
                    style={styles.image}
                    source={image}
                  />
                  <MyText style={{textAlign: 'center', position: 'absolute', bottom: 0, left: 0, right: 0}}>{name}</MyText>
                </TouchableOpacity>
              );
            })
           }
           </ScrollView>
         </Modal>
       );
     } else {
       return null;
     }
   }

   _activityPunch = () => {
     this.props.onFocus(this.props.stateKey);
   }

   _filterClick = (type) => {
     this.props.onChange(this.props.stateKey, type);
     this.props.onFocus(this.props.stateKey);
   }

}

@connect()
export class ActivityInput extends React.Component {
  state = {
    focus: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.focus) {
      this.setState({focus: true});
      dismissKeyboard();
    } else {
      this.setState({focus: false});
    }
  }
  render() {
    return (
      <TouchableHighlight
        onPress={this._onActivityPress}
        ref={view => { this._view = view; }}
        underlayColor={'#f1f1f1'}>
        <View>
          <View pointerEvents={'none'}>
            <Hoshi
              value={this.props.value ? Activities[this.props.value].name : ""}
              editable={false}
              label={this.props.label}
              borderColor={'#8bd1c6'}
              onFocus={this._onDatePress}
              focus={this.state.focus}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _onActivityPress = () => {
    this.props.onFocus(this.props.stateKey);
  }

}
const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  icon: {
    width: 0.25 * width,
    height: 0.175 * height,
    justifyContent: 'center',
  },
  text: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontFamily: 'LatoRegular',
  },
  image: {
    alignSelf: 'center',
    height: 60,
    resizeMode: 'contain',
  },
  scrollView: {
    backgroundColor: '#FFF',
  },
  pickText: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 30,
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  activity: {
    backgroundColor: 'rgba(0,0,0,0)',
    height: Platform.OS === "android" ? height * 0.25 : height * 0.20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityImage: {
    alignSelf: 'center',
    height: 60,
    resizeMode: 'contain',
    top: 20,
    zIndex: 2,
  },
  circle: {
    width: 100,
    height: 100,
  },
});
