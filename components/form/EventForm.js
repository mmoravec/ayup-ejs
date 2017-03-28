import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
  Text,
  Switch,
  LayoutAnimation,
} from 'react-native';
import { connect } from 'react-redux';
import LocationSearch from './LocationSearch';
import ActivitySelector from './ActivitySelector';
import TimeSelector from './TimeSelector';
import FriendSelector from './FriendSelector';
import Hoshi from '../common/Hoshi';
import Actions from '../../state/Actions';
const {height, width} = Dimensions.get('window');

@connect()
export default class EventForm extends React.Component {

  constructor(props) {
    super(props);
    this._inputProps = {
      style: styles.hoshi,
      editable: true,
      borderColor: '#8bd1c6',
    };
    this._titleProps = {
      onChangeText: ((text) => this.setState({title: text})),
      onFocus: this._focusElement.bind(this, 'title'),
      label: 'Title',
      ...this._inputProps,
    };
    this._descProps = {
      onChangeText: ((text) => this.setState({desc: text})),
      onFocus: this._focusElement.bind(this, 'desc'),
      label: 'Description',
      ...this._inputProps,
    };
    this._locProps = {
      scrollTo: this._scrollTo,
      onFocus: this._focusElement.bind(this, 'location'),
    };

  }

  state = {
    startDate: '',
    endDate: '',
    title: 'title placeholder',
    desc: 'sample desc',
    location: '',
    friends: [],
    scrollY: new Animated.Value(0),
    activity: 0,
    latlng: [],
    public: false,
    focus: [
      {stateKey: 'title', focus: false},
      {stateKey: 'desc', focus: false},
      {stateKey: 'location', focus: false},
      {stateKey: 'startDate', focus: false},
      {stateKey: 'endDate', focus: false},
      {stateKey: 'friends', focus: false},
    ],
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    return (
      <View>
        <View style={styles.scrollView}>
          <ScrollView
            ref="scrollView"
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={styles.form}>
            <ActivitySelector selectActivity={this._selectActivity} />
            <View style={[styles.input, styles.topInput]}>
              <Hoshi {...this._titleProps} />
            </View>
            <View style={styles.switch}>
              <Text style={styles.text}>Public</Text>
              <Switch
                style={styles.swButton}
                onValueChange={this._privateSwitch}
                value={this.state.public}
              />
            </View>
            <View style={styles.input}>
              <LocationSearch
                {...this._locProps}
                location={this.state.location}
                focus={this.state.focus}
                onChange={this._changeLocation}
              />
            </View>
            <View style={styles.input}>
              <TimeSelector
                focus={this.state.focus}
                onFocus={this._focusElement}
                date={this.state.startDate}
                label={'Start Date'}
                onChange={this._onChange}
                stateKey={'startDate'}
                scrollTo={this._scrollTo}
              />
            </View>
            <View style={styles.input}>
              <TimeSelector
                ref="endDate"
                focus={this.state.focus}
                onFocus={this._focusElement}
                date={this.state.endDate}
                label={'End Date'}
                onChange={this._onChange}
                stateKey={'endDate'}
                scrollTo={this._scrollTo}
              />
            </View>
            <View style={styles.input}>
              <FriendSelector
                ref="friends"
                focus={this.state.focus}
                onFocus={this._focusElement}
                onChange={this._onChange}
                stateKey={'friends'}
                scrollTo={this._scrollTo}
              />
            </View>
            {this._renderOptionalFields()}
            <View style={styles.btmPadding} />
          </ScrollView>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity
            underlayColor="transparent"
            style={styles.hlightSave}
            onPress={this._saveBtnPress}>
            <Image
              style={styles.btnSave}
              source={require('../../assets/images/btn_save.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _selectActivity = (act) => {
    this.setState({activity: act});
  }

  _renderOptionalFields = () => {
    let opt = {
      desc: (<View style={styles.input}><Hoshi {...this._descProps} /></View>),
    };
    //return opt.desc;
  }

  _focusElement = (el) => {
    let focus = this.state.focus.map(input => {
      if (input.stateKey === el && !input.focus) {
        return {stateKey: input.stateKey, focus: true};
      } else {
        return {stateKey: input.stateKey, focus: false};
      }
    });
    this.setState({focus});
  }

  _changeLocation = (name, ltlng) => {
    this.setState({location: name, latlng: ltlng});
  }

  _onChange = (key, value) => {
    let obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  _scrollTo = (num) => {
    this.refs.scrollView.scrollTo({y: num, animated: true});
  }

  _privateSwitch = () => {
    this.setState({public: !this.state.public});
  }

  _saveBtnPress = () => {
    let event = {
      starttime: this.state.startDate,
      endtime: this.state.endDate,
      title: this.state.title,
      desc: this.state.desc,
      location: {
        coordinates: this.state.latlng,
        text: this.state.location,
      },
      invited: this.state.friends.toJS(),
      activity: this.state.activity,
    };
    console.log(event);
    this.props.dispatch(Actions.saveEvent(event));
  }

}

const styles = StyleSheet.create({
  btmPadding: {
    height: height,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 10,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    height,
  },
  form: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  input: {
    backgroundColor: '#fff',
  },
  topInput: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  hoshi: {
    paddingTop: 10,
  },
  switch: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#b9c1ca',
    height: 72,
  },
  text: {
    fontSize: 16,
    fontFamily: 'LatoRegular',
    position: 'absolute',
    bottom: 16,
    left: 14,
    color: '#6a7989',
  },
  swButton: {
    position: 'absolute',
    right: 16,
    bottom: 10,
  },
  hlightSave: {
    alignSelf: 'center',
  },
  bottom: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    bottom: 0,
    height: height * 0.1,
    width,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnSave: {
    height: 38,
    width: 140,
  },
});
