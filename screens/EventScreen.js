import React from 'react';
import { MapView } from 'expo';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import EventButton from '../components/EventButton';
import Icons from '../constants/activities';
import Content from '../components/EventContent';
import MapStyle from '../constants/mapstyle';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect(data => EventScreen.getDataProps(data))
export default class EventScreen extends React.Component {

  state = {
    commenting: false,
    comment: '',
    parentID: null,
  }

  static getDataProps(data) {
    return {
      selectedEvent: data.events.selectedEvent,
    };
  }

  render() {
    if (this.props.selectedEvent === null) {
      return <ActivityIndicator style={{marginTop: 200}} />;
    } else {
      let event = this.props.selectedEvent;
      let coord = {
        longitude: event.location.coordinates[0],
        latitude: event.location.coordinates[1] - 0.008,
        latitudeDelta: 0.003850375166415176,
        longitudeDelta: 0.01609325556559327,
      };
      let marker = {
        longitude: event.location.coordinates[0],
        latitude: event.location.coordinates[1],
        latitudeDelta: 0.003850375166415176,
        longitudeDelta: 0.01609325556559327,
      };
      let icon = Icons[event.activity].icon;
      let contentProps = {
        commentPress: this._onCommentPress,
        onReplyPress: this._onReplyPress,
        onScroll: this._onScroll,
      };
      return (
        <View style={styles.scrollView}>
          <MapView
            style={styles.map}
            zoomEnabled={false}
            customMapStyle={MapStyle}
            scrollEnabled={false}
            provider={"google"}
            region={coord}>
            <MapView.Marker
              key={0}
              coordinate={marker}
              image={icon}
            />
          </MapView>
          <TouchableOpacity style={styles.back} underlayColor="transparent" onPress={this._backBtnPress}>
            <Image
              source={require('../assets/images/btn_back.png')}
              style={styles.btnBack}
            />
          </TouchableOpacity>
          <Content {...contentProps} />
          <EventButton />
          {this._renderCommentBox()}
          <View style={styles.bottom} />
        </View>
      );
    }
  }

  _renderCommentBox = () => {
    console.log(this.state.commenting);
    if (true) {
      console.log('view should show');
      return (
        <KeyboardAvoidingView behavior={'padding'} style={{flex: 1, backgroundColor: "#fa3", bottom: 0, position:'absolute'}}>
          <View style={{height: 50, padding: 5, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: '#e9e9e9', flexDirection: 'row'}}>
            <View style={{height: 40, borderRadius: 5, borderWidth: 1, borderColor: "#c8c8cd", width: width * 0.8}}>
              <TextInput
                autoFocus={true}
                style={{margin: 5, height: 30, width: width * 0.8}}
                value={this.state.comment}
                onChangeText={this._onCommentText}
              />
            </View>
            <TouchableOpacity style={{alignSelf: 'center'}} onPress={this._saveComment}>
              <Image
                source={require('../assets/images/reply.png')}
                style={{height: 25}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    }
  }

  _onScroll = () => {
    this.setState({commenting: false});
  }

  _onCommentPress = () => {
    this.setState({parentID: null});
    this.setState({commenting: true});
  }

  _onReplyPress = (parentID) => {
    console.log('pressing!');
    console.log(parentID);
    this.setState({parentID});
    this.setState({commenting: true});
  }

  _onCommentText = (text) => {
    this.setState({comment: text});
  }

  _saveComment = () => {
    this.props.dispatch(
      Actions.saveComment(this.state.comment,
        this.props.event.id, this.state.parentID)
    );
    this.setState({commenting: false});
  }

  _backBtnPress = () => {
    this.props.dispatch(Actions.zeroSelectedEvent());
    this.props.dispatch(Actions.routeChange('Back'));
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  form: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  map: {
    flex: 1,
    zIndex: 0,
    position: 'absolute',
    height,
    width,
  },
  figure: {
    justifyContent: 'center',
    marginLeft: 20,
  },
  btnBack: {
    width: 80,
    height: 80,
  },
  back: {
    position: 'absolute',
    zIndex: 100,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width,
    height: height * 0.5,
    backgroundColor: "#fff",
  },
});
