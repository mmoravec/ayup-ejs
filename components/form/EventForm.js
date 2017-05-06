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
    console.log('getDataProps)');
    console.log(data.form);
    return {
      form: data.form,
    };
  }

  state = {
    scrollY: new Animated.Value(0),
    warn: false,
  }

  constructor(props) {
    super(props);
    this._inputProps = {
      style: styles.hoshi,
      editable: true,
      borderColor: '#8bd1c6',
      scrollTo: this._scrollTo,
    };
    this._actionProps = {
      action: this._saveBtnPress,
      image: require('../../assets/images/btn_save.png'),
      warnMessage: "Please fill out Title, Start Date, End Date, and Location",
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('nextprops');
    console.log(nextProps);
    return true;
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    console.log('eventform render');
    console.log(this.props.form);
    return (
      <View>
        <View style={styles.scrollView}>
          <ScrollView
            ref="scrollView"
            keyboardShouldPersistTaps={'always'}
            contentContainerStyle={styles.form}>
            <ActivitySelector />
            <View style={[styles.input, styles.topInput]}>
              <Hoshi {...this._inputProps} {...this.props.form.title} />
            </View>
            {
              this.props.form.desc.shown &&
              <View style={styles.input}>
                <Hoshi {...this._inputProps} stateKey={'desc'} />
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
                  {...this._inputProps}
                  {...this.props.form.startDate}
                />
              </View>
            }
            {
              this.props.form.endDate.shown &&
              <View style={styles.input}>
                <TimeSelector
                  {...this._inputProps}
                  {...this.props.form.endDate}
                />
              </View>
            }
            <View style={styles.input}>
              <FriendSelector
                {...this._inputProps}
                {...this.props.form.friends}
              />
            </View>
            {
              this.props.form.capacity.shown &&
              <View style={styles.input}>
                <Capacity
                  onChange={this._onChange}
                  stateKey={'capacity'}
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
                  <TouchableOpacity onPress={this._showCapacity} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/capacity_btn.png')}
                      style={{height: 40, width: 114}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
                {
                  !this.props.form.desc.shown &&
                  <TouchableOpacity onPress={this._showDescription} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/description_btn.png')}
                      style={{height: 40, width: 131}}
                    />
                  </TouchableOpacity>
                }
                {
                  !this.props.form.dest.shown &&
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
                  this.props.form.capacity.shown &&
                  <TouchableOpacity onPress={this._showCapacity} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/capacity_btn.png')}
                      style={{height: 40, width: 114}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                }
                {
                  this.props.form.desc.shown &&
                  <TouchableOpacity onPress={this._showDescription} style={{margin: 5}}>
                    <Image
                      source={require('../../assets/images/description_btn.png')}
                      style={{height: 40, width: 131}}
                    />
                  </TouchableOpacity>
                }
                {
                  this.props.form.dest.shown &&
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

  _showDestination = () => {
    this.props.dispatch(Actions.showhideField('dest'));
  }

  _privateSwitch = () => {
   this.setState({private: !this.state.private});
 }


  _scrollTo = (num) => {
    this.refs.scrollView.scrollTo({y: num, animated: true});
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
