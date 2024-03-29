import _ from 'lodash';
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Actions from '../state/Actions';
import Activities from '../constants/activities'
import MyText from '../components/common/MyText';
import Filters from '../utils/filters';
const {height, width} = Dimensions.get('window');

@connect()
export default class ActivitiesScreen extends React.Component {

  state = {
    all: true,
    opacity: new Animated.Value(0),
    height: new Animated.Value(0),
    filterClicked: false,
  }

  animate = _.debounce(() => {
    Animated.sequence([
      Animated.timing(this.state.height, {toValue: 70, duration: 1}),
      Animated.timing(this.state.opacity, {toValue: 1, duration: 200}),
      Animated.delay(1000),
      Animated.timing(this.state.opacity, {toValue: 0, duration: 200}),
      Animated.timing(this.state.height, {toValue: 0, duration: 1}),
    ]).start();
  }, 1000);

  componentWillReceiveProps(newProps) {
    this.animate();
  }

  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent
        onRequestClose={this.props.onFilterPress}
        visible={this.props.filtersVisible}>
        <View style={styles.container}>
          <MyText style={styles.title}>
            {
              this.state.filterClicked ? 
                this.props.events.size + ` Events Shown` : 
                `Tap to Filter Activities`
            }
          </MyText>
          <TouchableOpacity style={styles.back} underlayColor="transparent" onPress={this._backBtnPress}>
            <Image
              source={require('../assets/images/btn_close.png')}
              style={styles.btnBack}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._resetActivities} style={{position: 'absolute', right: 20, top: 25, zIndex: 2}}>
            <View style={{borderRadius: 25, width: 30, height: 30, backgroundColor: "#fff", alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
              <MaterialCommunityIcons
                size={20}
                name={'refresh'}
                style={{backgroundColor: 'transparent'}}
              />
            </View>
            <MyText style={{fontSize: 10, color: "#666666"}}>Reset</MyText>
          </TouchableOpacity>
          <View style={styles.scrollView}>
            <ScrollView contentContainerStyle={styles.form}>
              {
                _.values(Activities).map(activity => {
                  if (this.props.filters.indexOf(activity.type) > -1) {
                    return (
                      <Activity key={activity.type} activity={activity} selected={true} clickedActivity={this._clickedActivity} />
                    );
                  } else {
                    return (
                      <Activity key={activity.type} activity={activity} selected={false} clickedActivity={this._clickedActivity} />
                    );
                  }

              })
            }
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }


  _backBtnPress = _.debounce(() => {
    this.props.onFilterPress();
  }, 3000, {
    leading: true,
  });

  _resetActivities = () => {
    if (this.state.all) {
      _.values(Activities).map(activity => {
        this.props.dispatch(Actions.removeActivity(activity.type));
      });
    } else {
      _.values(Activities).map(activity => {
        this.props.dispatch(Actions.addActivity(activity.type));
      });
    }
    this.setState({all: !this.state.all});
  }

  _clickedActivity = () => {
    this.setState({filterClicked: true});
  }
}

@connect()
class Activity extends React.Component {

  state = {
    activityClicked: false,
  }

  render() {
    let { image, type, name } = this.props.activity;
    let opacity = 1;
    if (!this.props.selected) {
      opacity = 0.2;
    }
    return (
      <TouchableHighlight
        style={styles.icon}
        key={type}
        onPress={this._filterClick}
        underlayColor="transparent">
        <View style={{paddingBottom: 20}}>
          <Image
            style={styles.image}
            opacity={opacity}
            source={image}>
          </Image>
          <MyText style={{textAlign: 'center', position: 'absolute', bottom: 0, left: 0, right: 0}}>{name}</MyText>
        </View>
      </TouchableHighlight>
      );
  }

  _filterClick = () => {
    this.setState({activityClicked: true});
    this.props.clickedActivity();
    if (this.props.selected) {
      this.props.dispatch(Actions.removeActivity(this.props.activity.type));
    } else {
      this.props.dispatch(Actions.addActivity(this.props.activity.type));
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
    backgroundColor:'rgba(255,255,255,0.8)',
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 22,
    left: width * 0.2,
    right: 0,
    top: 25,
    fontFamily: 'LatoRegular',
    zIndex: 1,
    width: width * 0.6,
  },
  btnBack: {
    width: 80,
    height: 80,
  },
  back: {
    position: 'absolute',
    zIndex: 3,
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
    borderRadius: 10,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    height: height * 0.9,
    width: width * 0.9,
    position: 'absolute',
    zIndex: 0,
    backgroundColor:'rgba(255,255,255,0.5)',
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: width * 0.9,
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  results: {
    position: 'absolute',
    zIndex: 4,
    bottom: height * 0.4,
    backgroundColor: '#222',
    borderRadius: 20,
    left: width * 0.25,
    padding: 10,
    width: width * 0.5,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 36,
    color: '#fff',
  },
});
