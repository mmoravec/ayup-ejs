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
} from 'react-native';
import {
  Ionicons,
} from '@expo/vector-icons';
import { connect } from 'react-redux';
import _ from 'lodash';
import Activities from '../../constants/activities';
import MyText from '../common/MyText';
const {height, width} = Dimensions.get('window');

@connect()
export default class ActivitySelector extends React.Component {

  state = {
    showSelect: false,
    filterSelected: 'basketball',
  }

   render() {
     return (
       <View>
         <View style={styles.activity}>
           <TouchableOpacity onPress={this._activityPunch}>
             <View>
               <Image style={styles.circle} source={require('../../assets/images/small_circle.png')}>
                 <Image
                   source={Activities[this.state.filterSelected].image}
                   style={styles.activityImage}
                 />
               </Image>
             </View>
           </TouchableOpacity>
           <Text style={styles.text}>Tap to Select Activity</Text>
         </View>
         {this._renderSelectForm()}
       </View>
     );
   }

   _renderSelectForm() {
     if (this.state.showSelect) {
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
     this.setState({showSelect: !this.state.showSelect});
   }

   _filterClick = (type) => {
     this.setState({filterSelected: type});
     this.props.selectActivity(type);
     this.setState({showSelect: !this.state.showSelect});
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
    height: height * 0.25,
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
