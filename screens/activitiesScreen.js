import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect(data => ActivitiesScreen.getDataProps(data))
export default class ActivitiesScreen extends React.Component {

  static getDataProps(data) {
    return {
      filters: data.events.filters,
      events: data.events.nearbyEvents,
    };
  }

  render() {
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <TouchableHighlight underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            style={styles.btnBack}
          />
        </TouchableHighlight>
        <View style={styles.search}>
        </View>
        <View style={styles.scrollView}>
          <ScrollView contentContainerStyle={styles.form}>
          {
            this.props.filters.map(icon => {
              let { id, image } = icon;
              return (
                <TouchableHighlight
                  style={styles.icon}
                  key={id}
                  underlayColor="transparent">
                  <Image
                    style={styles.image}
                    source={image}
                  />
                </TouchableHighlight>
              );
            })
          }
          </ScrollView>
        </View>
      </Image>
    );
  }

  _backBtnPress = () => {
    this.props.dispatch(Actions.routeChange('home'));
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
    top: height * 0.25,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    height: height * 0.7,
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
