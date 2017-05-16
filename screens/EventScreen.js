import React from 'react';
import { MapView } from 'expo';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import EventButton from '../components/event/Button';
import EventComments from '../components/event/Comments';
import Icons from '../constants/activities';
import Content from '../components/event/Content';
import MapStyle from '../constants/mapstyle';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect(data => EventScreen.getDataProps(data))
export default class EventScreen extends React.Component {

  state = {
    noScroll: false,
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
      let commentProps = {
        noScroll: this.state.noScroll,
        comment: this.state.comment,
        onChangeText: this._onCommentText,
        saveComment: this._saveComment,
      };
      let contentProps = {
        onCommentPress: this._onCommentPress,
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
          <View style={styles.bottom} />
          <EventComments {...commentProps} />
        </View>
      );
    }
  }

  _backBtnPress = () => {
    this.props.dispatch(Actions.zeroSelectedEvent());
    this.props.dispatch(Actions.zeroSelectedComment());
    this.props.dispatch(Actions.routeChange('Back'));
  }

  _onCommentPress = (parentID) => {
    if (typeof parentID === 'string') {
      this.setState({noScroll: true, parentID});
    } else {
      this.setState({parentID: null, noScroll: true});
    }
  }

  _onScroll = () => {
    this.setState({noScroll: false});
  }

  _onCommentText = (text) => {
    this.setState({comment: text});
  }

  _saveComment = () => {
    this.props.dispatch(
      Actions.saveComment(this.state.comment,
        this.props.selectedEvent.id, this.state.parentID)
    );
    this.setState({noScroll: false, comment: ''});
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
    top: 10,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width,
    height: height * 0.5,
    backgroundColor: "#fff",
  },
});
