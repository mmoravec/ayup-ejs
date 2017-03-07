import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Text,
  Animated,
} from 'react-native';
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
        <TouchableOpacity style={styles.backPress} underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Tap to Filter Activities</Text>
        <View style={styles.scrollView}>
          <ScrollView contentContainerStyle={styles.form}>
            {
            this.props.filters.map(icon => {
              return (
                <Activity key={icon.id} icon={icon} selected={icon.selected} />
              );
            })
          }
          </ScrollView>
        </View>
      </Image>
    );
  }

  _backBtnPress = () => {
    this.props.navigator.pop();
  }
}

@connect()
class Activity extends React.Component {

  state = {
    activityClicked: false,
  }

  render() {
    let { id, image, selected, title } = this.props.icon;
    let opacity = 1;
    if (!selected) {
      opacity = 0.3;
    }
    return (
      <TouchableHighlight
        style={styles.icon}
        key={id}
        onPress={() => this._filterClick(id, selected)}
        underlayColor="transparent">
        <View style={{paddingBottom: 20}}>
          <Image
            style={styles.image}
            opacity={opacity}
            source={image}>
          </Image>
          <Heart selected={selected} clicked={this.state.activityClicked} />
          <Text style={{textAlign: 'center', position: 'absolute', bottom: 0, left: 0, right: 0}}>{title}</Text>
        </View>
      </TouchableHighlight>
      );
  }

  _filterClick = (id, selected) => {
    this.setState({activityClicked: true});
    if (selected) {
      this.props.dispatch(Actions.removeActivity(id));
    } else {
      this.props.dispatch(Actions.addActivity(id));
    }
  }
}

class Heart extends React.Component {

  state = {
    removed: false,
  }

  render() {
    if (this.props.selected) {
      let height = new Animated.Value(0),
          left = new Animated.Value(10),
          top = 0,
          opacity = new Animated.Value(1);
      if (this.props.clicked) {
        Animated.sequence([
            Animated.delay(200),
            Animated.timing(height, {toValue: 60, duration: 700}),
            Animated.timing(height, {toValue: 55, duration: 200}),
            Animated.timing(height, {toValue: 60, duration: 200}),
            Animated.delay(200),
            Animated.parallel([
              Animated.timing(height, {toValue: 12, duration: 500}),
              Animated.timing(left, {toValue: 2, duration: 300}),
            ]),
          Animated.timing(opacity, {toValue: 0, duration: 0}),
        ]).start();
      } else {
        height = new Animated.Value(12);
        left = new Animated.Value(2);
      }
      return (
        <Animated.Image
          source={require('../assets/images/heart.png')}
          style={{
            position:'absolute',
            top,
            left,
            width: height,
            height,
            resizeMode: 'contain',
          }}
        />
      );
    } else {
      let height = new Animated.Value(22),
          left = new Animated.Value(-4),
          opacity = new Animated.Value(1),
          top = new Animated.Value(-2);
      if (this.props.clicked) {
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel([
            Animated.timing(height, {toValue: 46, duration: 800}),
            Animated.timing(left, {toValue: 20, duration: 600}),
            Animated.timing(top, {toValue: 5, duration: 600}),
          ]),
          Animated.delay(2000),
          Animated.timing(opacity, {toValue: 0, duration: 0}),
          Animated.timing(height, {toValue: 22, duration: 0}),
          Animated.timing(left, {toValue: -4, duration: 0}),
          Animated.timing(top, {toValue: -2, duration: 0}),
        ]).start();
      } else {
        opacity = new Animated.Value(0);
      }
      return (
        <Animated.Image
          source={require('../assets/images/heart_breaking.gif')}
          style={{
            position:'absolute',
            top,
            left,
            width: height,
            height,
            resizeMode: 'contain',
            opacity,
          }}
        />
      );
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
    marginTop: 25,
  },
  backPress: {
    zIndex: 2,
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    left: 0,
    right: 0,
    top: 30,
    fontFamily: 'LatoRegular',
    zIndex: 1,
  },
  checkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 0.225 * width,
    height: 0.16 * height,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
    height: 50,
    resizeMode: 'contain',
  },
  unSelectedImage: {
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
    top: height * 0.12,
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
