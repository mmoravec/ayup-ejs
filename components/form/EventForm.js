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
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import LocationSearch from './LocationSearch';
import ActivitySelector from './ActivitySelector';
import TimeSelector from './TimeSelector';
import FriendSelector from './FriendSelector';
import Capacity from './Capacity';
import SaveButton from './SaveButton';
import MyText from '../common/MyText';
import Hoshi from '../common/Hoshi';
import Actions from '../../state/Actions';
const {height, width} = Dimensions.get('window');

@connect((data) => EventForm.getDataProps(data))
export default class EventForm extends React.Component {

  static getDataProps(data) {
    return {
      form: data.form,
    };
  }

  state = {
    scrollY: new Animated.Value(0),
    warn: false,
    scrollTo: true,
  }

  constructor(props) {
    super(props);
    this._inputProps = {
      style: styles.hoshi,
      editable: true,
      borderColor: '#8bd1c6',
      scrollTo: this._scrollTo,
    };
    this._titleProps = {
      onFocus: this._focusElement.bind(this, 'title'),
      onChangeText: ((text) => this.props.dispatch(Actions.setFormValue('title', text))),
      ...this._inputProps,
    };
    this._descProps = {
      onFocus: this._focusElement.bind(this, 'desc'),
      onChangeText: ((text) => this.props.dispatch(Actions.setFormValue('desc', text))),
      ...this._inputProps,
    };
    this._actionProps = {
      action: this._saveBtnPress,
      image: require('../../assets/images/btn_save.png'),
      warnMessage: "Please fill out Title, Start Date, End Date, and Location",
    };
  }

  componentWillReceiveProps(nextProps) {
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
            scrollEventThrottle={300}
            onScroll={this._onScroll}
            contentContainerStyle={styles.form}>
            <ActivitySelector {...this.props.form.activity} onChange={this._onChange} />
            <View style={[styles.input, styles.topInput]}>
              <Hoshi
                {...this._titleProps}
                {...this.props.form.title}
              />
            </View>
            {
              this.props.form.desc.shown &&
              <View style={styles.input}>
                <Hoshi
                  {...this._descProps}
                  {...this.props.form.desc}
                />
              </View>
            }
            <View style={styles.switch}>
              <MyText style={styles.text}>Private</MyText>
              <Switch
                style={styles.swButton}
                onValueChange={this._privateSwitch}
                value={this.props.form.private.value}
              />
            </View>
            {
              this.props.form.location.shown &&
              <View style={styles.input}>
                <LocationSearch
                  {...this._inputProps}
                  {...this.props.form.location}
                />
              </View>
            }
            {
              this.props.form.dest.shown &&
              <View style={styles.input}>
                <LocationSearch
                  {...this._inputProps}
                  {...this.props.form.dest}
                />
              </View>
            }
            {
              this.props.form.startDate.shown &&
              <View style={styles.input}>
                <TimeSelector
                  {...this.props.form.startDate}
                  onFocus={this._focusElement}
                  onChange={this._onDateChange}
                  scrollTo={this._scrollTo}
                />
              </View>
            }
            {
              this.props.form.endDate.shown &&
              <View style={styles.input}>
                <TimeSelector
                  {...this.props.form.endDate}
                  onFocus={this._focusElement}
                  onChange={this._onDateChange}
                  scrollTo={this._scrollTo}
                />
              </View>
            }
            <View style={styles.input}>
              <FriendSelector
                {...this.props.form.friends}
                onFocus={this._focusElement}
                scrollTo={this._scrollTo}
                onChange={this._onChange}
              />
            </View>
            {
              this.props.form.capacity.shown &&
              <View style={styles.input}>
                <Capacity
                  {...this.props.form.capacity}
                  onChange={this._onChange}
                />
              </View>
            }
            <View style={styles.optionalFields}>
              <MyText style={styles.optText}>
                Add Field
              </MyText>
              <View style={styles.fieldContainer}>
                {
                  !this.props.form.capacity.shown &&
                  <TouchableOpacity onPress={this._show.bind(null, 'capacity')} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/capacity_btn.png')}
                      style={{height: 40, width: 114}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
                {
                  !this.props.form.desc.shown &&
                  <TouchableOpacity onPress={this._show.bind(null, 'desc')} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/description_btn.png')}
                      style={{height: 40, width: 131}}
                    />
                  </TouchableOpacity>
                }
                {
                  !this.props.form.dest.shown &&
                  <TouchableOpacity onPress={this._show.bind(null, 'dest')} style={{margin: 5}}>
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
                  this.props.form.capacity.shown &&
                  <TouchableOpacity onPress={this._show.bind(null, 'capacity')} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/capacity_btn.png')}
                      style={{height: 40, width: 114}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
                {
                  this.props.form.desc.shown &&
                  <TouchableOpacity onPress={this._show.bind(null, 'desc')} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/description_btn.png')}
                      style={{height: 40, width: 131}}
                    />
                  </TouchableOpacity>
                }
                {
                  this.props.form.dest.shown &&
                  <TouchableOpacity onPress={this._show.bind(null, 'dest')} style={{margin: 5}}>
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

  _onScroll = () => {
    console.log(this.state.scrollTo);
    if (!this.state.scrollTo && !this.props.form.friends.focus) {
      this.props.dispatch(Actions.blurFields());
      Keyboard.dismiss();
    }
  }

  _show = (field) => {
    this.props.dispatch(Actions.showhideField(field));
  }

  _privateSwitch = () => {
   this.props.dispatch(Actions.setFormValue('private', !this.props.form.private.value));
 }

  _scrollTo = (num) => {
    this.setState({scrollTo: true});
    this.refs.scrollView.scrollTo({y: num, animated: true});
    setTimeout(() => { this.setState({scrollTo: false}); }, 2000);
  }

  _focusElement = (el) => {
    this.props.dispatch(Actions.focusField(el));
  }

  _onDateChange = (key, value) => {
    if (key === 'startDate' && this.props.form.endDate.value < value) {
      this.props.dispatch(Actions.setFormValue('endDate', value));
    }
    if (key === 'endDate' && value < this.props.form.startDate.value) {
      value = this.props.form.startDate.value;
    }
    this.props.dispatch(Actions.setFormValue(key, value));
  }

  _onChange = (stateKey, value) => {
    this.props.dispatch(Actions.setFormValue(stateKey, value));
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
