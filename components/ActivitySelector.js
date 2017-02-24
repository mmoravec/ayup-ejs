import React from 'react';
import { Components } from 'exponent';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  Modal,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Actions from '../state/Actions';
import Filter from '../utils/filters';
const { Svg } = Components;
const {height, width} = Dimensions.get('window');

@connect((data) => ActivitySelector.getDataProps(data))
export default class ActivitySelector extends React.Component {

  state = {
    showSelect: false,
    filterSelected: 0,
  }

  static getDataProps(data) {
    return {
      filters: Filter.getSelectedActivitiesArray(data.events.filters),
    };
  }

   render() {
     return (
       <View>
         <View style={styles.activity}>
           <TouchableOpacity onPress={this._activityPunch}>
             <View>
               <Image style={styles.circle} source={require('../assets/images/small_circle.png')}>
                 <Image
                   source={this.props.filters[this.state.filterSelected].image}
                   style={styles.activityImage}
                 />
               </Image>
             </View>
           </TouchableOpacity>
         </View>
         {this._renderSelectForm()}
       </View>
     );
   }

   _renderSelectForm() {
     if (this.state.showSelect) {
       return (
         <Modal style={styles.scrollView} onRequestClose={this._activityPunch}>
           <Text style={styles.pickText}> Select an Activity</Text>
           <ScrollView contentContainerStyle={styles.form}>
             {
             this.props.filters.map(icon => {
              let { id, image } = icon;
              return (
                <TouchableOpacity
                  style={styles.icon}
                  key={id}
                  onPress={() => this._filterClick(id)}
                  underlayColor="transparent">
                  <Image
                    style={styles.image}
                    source={image}
                  />
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

   _filterClick = (id) => {
     this.setState({filterSelected: id});
     this.setState({showSelect: !this.state.showSelect});
   }

}
const styles = StyleSheet.create({
  icon: {
    width: 0.25 * width,
    height: 0.175 * height,
    justifyContent: 'center',
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
    marginTop: 20,
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
