import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  FontAwesome,
} from '@exponent/vector-icons';
import { connect } from 'react-redux';
import Actions from '../state/Actions';
import Filters from '../utils/filters';
const {height, width} = Dimensions.get('window');

@connect(data => ActivitiesScreen.getDataProps(data))
export default class ActivitiesScreen extends React.Component {

  static getDataProps(data) {
    return {
      filters: Filters.filtersFromIds(data.events.filters),
      events: data.events.nearbyEvents,
    };
  }

  render() {
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <TouchableOpacity underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableOpacity>
        <View style={styles.scrollView}>
          <ScrollView contentContainerStyle={styles.form}>
          {
            this.props.filters.map(icon => {
              let { id, image, selected } = icon;
              return (
                <TouchableHighlight
                  style={styles.icon}
                  key={id}
                  onPress={() => this._filterClick(id, selected)}
                  underlayColor="transparent">
                  <Image
                    style={styles.image}
                    source={image}>
                    {this._renderCheck(selected)}
                  </Image>
                </TouchableHighlight>
              );
            })
          }
          </ScrollView>
        </View>
      </Image>
    );
  }

  _filterClick = (id, selected) => {
    if (selected) {
      this.props.dispatch(Actions.removeActivity(id));
    } else {
      this.props.dispatch(Actions.addActivity(id));
    }
  }

  _backBtnPress = () => {
    this.props.navigator.pop();
  }

  _renderCheck(selected) {
    if (selected) {
      return (
        <View style={styles.checkContainer}>
          <FontAwesome
            name={'smile-o'}
            size={20}
            color={'#8bd1c6'}
            style={styles.check}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
  },
  btnBack: {
    width: 40,
    height: 40,
    margin: 15,
  },
  checkContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  icon: {
    width: 0.225 * width,
    height: 0.175 * height,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
    height: 60,
    resizeMode: 'contain',
  },
  search: {
    top: height * 0.15,
    width: width * 0.9,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    height: height * 0.12,
    position: 'absolute',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    zIndex: 1,
  },
  scrollView: {
    top: height * 0.1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    height: height * 0.9,
    width: width * 0.9,
    position: 'absolute',
    zIndex: 0,
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: width * 0.9,
    flexWrap: 'wrap',
    paddingTop: 10,
  },
});
