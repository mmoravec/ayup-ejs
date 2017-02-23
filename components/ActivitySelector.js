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
import filters from '../constants/filters';

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
           <TouchableOpacity style={styles.circle} onPress={this._activityPunch}>
             <Svg
               height="150"
               width="150">
               <Svg.Circle
                 cx="75"
                 cy="90"
                 r="50"
                 fill="white"
               />
               <Image
                 source={this.props.filters[this.state.filterSelected].image}
                 style={styles.activityImage}
               />
             </Svg>
           </TouchableOpacity>
         </View>
         {this._renderSelectForm()}
       </View>
     );
   }

   _renderSelectForm() {
     if (this.state.showSelect) {
       return (
         <Modal style={styles.scrollView}>
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
    top: 60,
  },
  circle: {
  },
});
