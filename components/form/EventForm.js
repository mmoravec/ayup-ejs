import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Animated,
  Switch,
  Image,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import LocationSearch from './LocationSearch';
import ActivitySelector from './ActivitySelector';
import TimeSelector from './TimeSelector';
import FriendSelector from './FriendSelector';
import Capacity from './Capacity';
import SaveButton from './SaveButton';
import MyText from '../common/MyText';
import Hoshi from '../common/Hoshi';
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
      label: 'Meeting Location',
      stateKey: 'location',
      ...this._inputProps,
    };
    this._destProps = {
      scrollTo: this._scrollTo,
      onFocus: this._focusElement.bind(this, 'destination'),
      label: 'Destination',
      stateKey: 'destination',
      ...this._inputProps,
    };
    this._actionProps = {
      action: this._saveBtnPress,
      image: require('../../assets/images/btn_save.png'),
      warnMessage: "Please fill out Title, Start Date, End Date, and Location",
    };
  }

  state = {
    startDate: '',
    endDate: '',
    title: '',
    warn: false,
    desc: '',
    location: '',
    friends: [],
    scrollY: new Animated.Value(0),
    activity: 'basketball',
    latlng: [],
    private: false,
    capacity: 0,
    fields: {
      title: {
        focus: false,
        shown: true,
        stateKey: 'title',
      },
      desc: {
        focus: false,
        shown: false,
        stateKey: 'desc',
      },
      capacity: {
        focus: false,
        shown: false,
        stateKey: 'capacity',
      },
      location: {
        focus: false,
        shown: true,
        stateKey: 'location',
      },
      destination: {
        focus: false,
        shown: false,
        stateKey: 'destination',
      },
      startDate: {
        focus: false,
        shown: true,
        stateKey: 'startDate',
      },
      endDate: {
        focus: false,
        shown: true,
        stateKey: 'endDate',
      },
      friends: {
        focus: false,
        shown: true,
        stateKey: 'friends',
      },
    },
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    console.log(this.state.fields.startDate);
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
            {
              this.state.fields.desc.shown &&
              <View style={styles.input}>
                <Hoshi {...this._descProps} />
              </View>
            }
            <View style={styles.switch}>
              <MyText style={styles.text}>Private</MyText>
              <Switch
                style={styles.swButton}
                onValueChange={this._privateSwitch}
                value={this.state.private}
              />
            </View>
            {
              this.state.fields.location.shown &&
              <View style={styles.input}>
                <LocationSearch
                  {...this._locProps}
                  location={this.state.location}
                  focus={this.state.fields.location.focus}
                  onChange={this._changeLocation}
                />
              </View>
            }
            {
              this.state.fields.destination.shown &&
              <View style={styles.input}>
                <LocationSearch
                  {...this._destProps}
                  location={this.state.destination}
                  focus={this.state.fields.destination.focus}
                  onChange={this._changeDestination}
                />
              </View>
            }
            {
              this.state.fields.startDate.shown &&
              <View style={styles.input}>
                <TimeSelector
                  focus={this.state.fields.startDate.focus}
                  onFocus={this._focusElement}
                  date={this.state.startDate}
                  label={'Start Date'}
                  onChange={this._onDateChange}
                  stateKey={'startDate'}
                  scrollTo={this._scrollTo}
                />
              </View>
            }
            {
              this.state.fields.endDate.shown &&
              <View style={styles.input}>
                <TimeSelector
                  ref="endDate"
                  focus={this.state.fields.endDate.focus}
                  onFocus={this._focusElement}
                  date={this.state.endDate}
                  label={'End Date'}
                  onChange={this._onDateChange}
                  stateKey={'endDate'}
                  scrollTo={this._scrollTo}
                />
              </View>
            }
            <View style={styles.input}>
              <FriendSelector
                ref="friends"
                focus={this.state.fields.friends.focus}
                onFocus={this._focusElement}
                onChange={this._onChange}
                stateKey={'friends'}
                scrollTo={this._scrollTo}
              />
            </View>
            {
              this.state.fields.capacity.shown &&
              <View style={styles.input}>
                <Capacity
                  onChange={this._onChange}
                  stateKey={'capacity'}
                  capacity={this.state.capacity}
                />
              </View>
            }
            <View style={styles.optionalFields}>
              <MyText style={styles.optText}>
                Add Field
              </MyText>
              <View style={styles.fieldContainer}>
                {
                  !this.state.fields.capacity.shown &&
                  <TouchableOpacity onPress={this._showCapacity} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/capacity_btn.png')}
                      style={{height: 40, width: 114}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
                {
                  !this.state.fields.desc.shown &&
                  <TouchableOpacity onPress={this._showDescription} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/description_btn.png')}
                      style={{height: 40, width: 131}}
                    />
                  </TouchableOpacity>
                }
                {
                  !this.state.fields.destination.shown &&
                  <TouchableOpacity onPress={this._showDestination} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/destination_btn.png')}
                      style={{height: 40, width: 122}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
              </View>
            </View>
            <View style={styles.optionalFields}>
              <MyText style={styles.optText}>
                Remove Field
              </MyText>
              <View style={styles.fieldContainer}>
                {
                  this.state.fields.capacity.shown &&
                  <TouchableOpacity onPress={this._showCapacity} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/capacity_btn.png')}
                      style={{height: 40, width: 114}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
                {
                  this.state.fields.desc.shown &&
                  <TouchableOpacity onPress={this._showDescription} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/description_btn.png')}
                      style={{height: 40, width: 131}}
                    />
                  </TouchableOpacity>
                }
                {
                  this.state.fields.destination.shown &&
                  <TouchableOpacity onPress={this._showDestination} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/destination_btn.png')}
                      style={{height: 40, width: 122}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
              </View>
            </View>
            <View style={{height: height * 0.1}} />
          </ScrollView>
        </View>
        <SaveButton {...this._actionProps} event={this.state} />
      </View>
    );
  }

  _selectActivity = (act) => {
    this.setState({activity: act});
  }

  _focusElement = (el) => {
    let fields = _.mapValues(this.state.fields, (value) => {
      if (value.stateKey === el && !value.focus) {
        return {stateKey: value.stateKey, focus: true, shown: value.shown};
      } else {
        return { stateKey: value.stateKey, focus: false, shown: value.shown};
      }
    });
    this.setState({fields});
  }

  _changeLocation = (name, ltlng) => {
    this.setState({location: name, latlng: ltlng});
  }

  _changeDestination = (name, ltlng) => {
    this.setState({destination: name, dest_latlng: ltlng});
  }

  _onChange = (key, value) => {
    let obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  _onDateChange = (key, value) => {
    if (key === 'startDate' && this.state.endDate < value) {
      this.setState({endDate: value});
    }
    if (key === 'endDate' && value < this.state.startDate) {
      value = this.state.startDate;
    }
    let obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  _scrollTo = (num) => {
    this.refs.scrollView.scrollTo({y: num, animated: true});
  }

  _privateSwitch = () => {
    this.setState({private: !this.state.private});
  }

  _showCapacity = () => {
    let fields = this.state.fields;
    fields.capacity.shown = !fields.capacity.shown;
    this.setState({fields});
  }

  _showDescription = () => {
    let fields = this.state.fields;
    fields.desc.shown = !fields.desc.shown;
    this.setState({fields});
  }

  _showDestination = () => {
    let fields = this.state.fields;
    fields.destination.shown = !fields.destination.shown;
    this.setState({fields});
  }

}

const styles = StyleSheet.create({
  optionalFields: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#b9c1ca',
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
  optText: {
    fontSize: 16,
    color: '#6a7989',
    marginTop: 15,
    marginLeft: 15,
  },
  fieldContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
});
