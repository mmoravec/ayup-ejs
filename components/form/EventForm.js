import _ from 'lodash';
import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Switch,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LocationSearch from "./LocationSearch";
import { ActivitySelector, ActivityInput} from "./ActivitySelector";
import TimeSelector from "./TimeSelector";
import FriendSelector from "./FriendSelector";
import Capacity from "./Capacity";
import SaveButton from "./SaveButton";
import MyText from "../common/MyText";
import Hoshi from "../common/Hoshi";
import Actions from "../../state/Actions";
const { height, width } = Dimensions.get("window");

@connect(data => EventForm.getDataProps(data))
export default class EventForm extends React.Component {
  static getDataProps(data) {
    return {
      form: data.form,
    };
  }

  onScroll = _.debounce(() => {
      this.setState({ scrollTo: false });
    }, 1400);

  state = {
    scrollY: new Animated.Value(0),
    staticY: 0,
    warn: false,
    scrollTo: true,
  };

  constructor(props) {
    super(props);
    this._inputProps = {
      style: styles.hoshi,
      editable: true,
      borderColor: "#8bd1c6",
      scrollTo: this._scrollTo,
    };
    this._titleProps = {
      onFocus: this._focusElement.bind(this, "title"),
      onChangeText: text =>
        this.props.dispatch(Actions.setFormValue("title", text)),
      ...this._inputProps,
      maxLength: 22,
      scrollTo: this._scrollTo,
    };
    this._descProps = {
      onFocus: this._focusElement.bind(this, "desc"),
      onChangeText: text =>
        this.props.dispatch(Actions.setFormValue("desc", text)),
      ...this._inputProps,
      maxLength: 400,
      scrollTo: this._scrollTo,
      multiline: true,
      height: 60,
    };
    this._actionProps = {
      action: this._saveBtnPress,
      image: require("../../assets/images/btn_save.png"),
      image2: require("../../assets/images/btn_update.png"),
    };
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    let margin = this.state.scrollY.interpolate({
      inputRange: [-150, 0, 90, 400],
      outputRange: [0.9, 0.9, 1, 1],
    });
    let y = this.state.scrollY.interpolate({
      inputRange: [-150, 0, 90, 400],
      outputRange: [-50, -50, 0, 0],
    });
    return (
      <View>
        <Animated.View style={styles.scrollView}>
          <Animated.ScrollView
            ref={view => { this._scrollView = view; }}
            keyboardShouldPersistTaps={"always"}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              { useNativeDriver: true, listener: this._onScroll }
            )}
            contentContainerStyle={styles.form}>
            <TouchableOpacity onPress={this._resetForm} style={{position: 'absolute', right: 20, top: 25, zIndex: 2}}>
              <View style={{borderRadius: 25, width: 30, height: 30, backgroundColor: "#fff", alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                <MaterialCommunityIcons
                  size={20}
                  name={'refresh'}
                  style={{backgroundColor: 'transparent'}}
                />
              </View>
              <MyText style={{fontSize: 10, color: "#666666"}}>Reset</MyText>
            </TouchableOpacity>
            <ActivitySelector
              {...this.props.form.activity}
              onChange={this._onChange}
              onFocus={this._focusElement}
            />
            <Animated.View style={{transform: [{scale: margin}, {translateY: y}]}}>
              <View style={[styles.input, styles.topInput]}>
                <ActivityInput
                  {...this.props.form.activity}
                  onFocus={this._focusElement}
                  onChange={this._onDateChange}
                />
              </View>
              <View style={styles.input}>
                <Hoshi
                  {...this._titleProps}
                  {...this.props.form.title}
                  returnKeyType={"next"}
                />
              </View>
              <View style={styles.switch}>
                {
                  this.props.form.private.value ?
                  <MyText style={styles.text}>Private</MyText> :
                  <MyText style={styles.text}>Public</MyText>
                }
                <Switch
                  style={styles.swButton}
                  onValueChange={this._privateSwitch}
                  value={this.props.form.private.value}
                />
              </View>
              {this.props.form.location.shown &&
                <View style={styles.input}>
                  <LocationSearch
                    {...this._inputProps}
                    {...this.props.form.location}
                  />
                </View>}
              {this.props.form.dest.shown &&
                <View style={styles.input}>
                  <LocationSearch
                    {...this._inputProps}
                    {...this.props.form.dest}
                  />
                </View>}
              {this.props.form.startDate.shown &&
                <View style={styles.input}>
                  <TimeSelector
                    {...this.props.form.startDate}
                    onFocus={this._focusElement}
                    onChange={this._onDateChange}
                    scrollTo={this._scrollTo}
                  />
                </View>}
              {this.props.form.endDate.shown &&
                <View style={styles.input}>
                  <TimeSelector
                    {...this.props.form.endDate}
                    onFocus={this._focusElement}
                    onChange={this._onDateChange}
                    scrollTo={this._scrollTo}
                  />
                </View>}
              <View style={styles.input}>
                {this.props.form.friends.shown &&
                  <FriendSelector
                    {...this.props.form.friends}
                    onFocus={this._focusElement}
                    scrollTo={this._scrollTo}
                    onChange={this._onChange}
                  />
                }
              </View>
              {this.props.form.capacity.shown &&
                <View style={styles.input}>
                  <Capacity
                    {...this.props.form.capacity}
                    onChange={this._onChange}
                  />
                </View>}
              {this.props.form.desc.shown &&
              <View style={styles.input}>
                <Hoshi {...this._descProps} {...this.props.form.desc} />
              </View>}
              {
                this.props.form.request.shown &&
                <View style={styles.switch}>
                  {
                    !this.props.form.request.value ?
                    <MyText style={styles.text}>Manually Accept Requests</MyText> :
                    <MyText style={styles.text}>Automatically Accept Requests</MyText>
                  }
                  <Switch
                    style={styles.swButton}
                    onValueChange={this._requestSwitch}
                    value={this.props.form.request.value}
                  />
                </View>
              }
              <View style={styles.optionalFields}>
                <MyText style={styles.optText}>
                  Optional Fields
                </MyText>
                <View style={styles.fieldContainer}>
                  {!this.props.form.capacity.shown &&
                    <TouchableOpacity
                      onPress={this._showCapacity}
                      style={{ margin: 5, height: 40 }}>
                      <Image
                        source={require("../../assets/images/capacity_btn.png")}
                        style={{ height: 40, width: 114 }}
                        resizeMode={"contain"}
                      />
                    </TouchableOpacity>}
                  {!this.props.form.desc.shown &&
                    <TouchableOpacity
                      onPress={this._showDescription}
                      style={{ margin: 5, height: 40 }}>
                      <Image
                        source={require("../../assets/images/description_btn.png")}
                        style={{ height: 40, width: 131 }}
                      />
                    </TouchableOpacity>}
                  {!this.props.form.dest.shown &&
                    <TouchableOpacity
                      onPress={this._showDestination}
                      style={{ margin: 5, height: 40 }}>
                      <Image
                        source={require("../../assets/images/destination_btn.png")}
                        style={{ height: 40, width: 122 }}
                        resizeMode={"contain"}
                      />
                    </TouchableOpacity>}
                  {!this.props.form.request.shown &&
                    <TouchableOpacity
                      onPress={this._showRequest}
                      style={{ margin: 5, height: 40 }}>
                      <Image
                        source={require("../../assets/images/request_btn.png")}
                        style={{ height: 40, width: 111 }}
                        resizeMode={"contain"}
                      />
                    </TouchableOpacity>}
                </View>
              </View>
              <View style={styles.optionalFields}>
                <MyText style={styles.optText}>
                  Remove Field
                </MyText>
                <View style={styles.fieldContainer}>
                  {this.props.form.capacity.shown &&
                    <TouchableOpacity
                      onPress={this._showCapacity}
                      style={{ margin: 5, height: 40 }}>
                      <Image
                        source={require("../../assets/images/-capacity_btn.png")}
                        style={{ height: 40, width: 114 }}
                        resizeMode={"contain"}
                      />
                    </TouchableOpacity>}
                  {this.props.form.desc.shown &&
                    <TouchableOpacity
                      onPress={this._showDescription}
                      style={{ margin: 5, height: 40 }}>
                      <Image
                        source={require("../../assets/images/-description_btn.png")}
                        style={{ height: 40, width: 131 }}
                      />
                    </TouchableOpacity>}
                  {this.props.form.dest.shown &&
                    <TouchableOpacity
                      onPress={this._showDestination}
                      style={{ margin: 5, height: 40 }}>
                      <Image
                        source={require("../../assets/images/-destination_btn.png")}
                        style={{ height: 40, width: 122 }}
                        resizeMode={"contain"}
                      />
                    </TouchableOpacity>}
                  {this.props.form.request.shown &&
                    <TouchableOpacity
                      onPress={this._showRequest}
                      style={{ margin: 5, height: 40 }}>
                      <Image
                        source={require("../../assets/images/-request_btn.png")}
                        style={{ height: 40, width: 111 }}
                        resizeMode={"contain"}
                      />
                    </TouchableOpacity>}
                </View>
              </View>
              <View style={{ height: height * 0.1 }} />
            </Animated.View>
          </Animated.ScrollView>
        </Animated.View>
        <SaveButton {...this._actionProps} event={this.state} />
      </View>
    );
  }

  _onScroll = (event) => {
    if (!this.state.scrollTo && !this.props.form.friends.focus) {
      this.props.dispatch(Actions.blurFields());
      Keyboard.dismiss();
    }
    this.setState({staticY: event.nativeEvent.contentOffset.y });
  };

  _showDestination = field => {
    this.props.dispatch(Actions.showhideField('dest'));
  };

  _showCapacity = field => {
    this.props.dispatch(Actions.showhideField('capacity'));
  };

  _showRequest = field => {
    this.props.dispatch(Actions.showhideField('request'));
  };

  _showDescription = field => {
    this.props.dispatch(Actions.showhideField('desc'));
  };

  _privateSwitch = () => {
    this.props.dispatch(
      Actions.setFormValue("private", !this.props.form.private.value)
    );
  };

  _requestSwitch = () => {
    this.props.dispatch(
      Actions.setFormValue("request", !this.props.form.request.value)
    );
  };

  _scrollTo = num => {
    this.setState({ scrollTo: true });
    this._scrollView._component.scrollTo({ y: num + this.state.staticY, animated: true });
    this.onScroll();
  };

  _focusElement = el => {
    this.props.dispatch(Actions.focusField(el));
  };

  _onDateChange = (key, value) => {
    if (key === "startDate" && this.props.form.endDate.value < value) {
      this.props.dispatch(Actions.setFormValue("endDate", value));
    }
    if (key === "endDate" && value < this.props.form.startDate.value) {
      value = this.props.form.startDate.value;
    }
    if (key === "endDate" && value > new Date(this.props.form.startDate.value.getTime() + 12096e5)) {
      value = new Date(this.props.form.startDate.value.getTime() + 12096e5);
    }
    this.props.dispatch(Actions.setFormValue(key, value));
  };

  _onChange = (stateKey, value) => {
    this.props.dispatch(Actions.setFormValue(stateKey, value));
  };

  _resetForm = () => {
    this.props.dispatch(Actions.zeroForm());
  }
}

const styles = StyleSheet.create({
  optionalFields: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#b9c1ca",
  },
  scrollView: {
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: 10,
    height,
  },
  form: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  input: {
    backgroundColor: "#fff",
  },
  topInput: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  hoshi: {
    paddingTop: 10,
  },
  switch: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#b9c1ca",
    height: 72,
  },
  text: {
    fontSize: 16,
    fontFamily: "LatoRegular",
    position: "absolute",
    bottom: 16,
    left: 14,
    color: "#6a7989",
  },
  swButton: {
    position: "absolute",
    right: 16,
    bottom: 10,
  },
  optText: {
    fontSize: 16,
    color: "#6a7989",
    marginTop: 15,
    marginLeft: 15,
  },
  fieldContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginBottom: 15,
  },
});
