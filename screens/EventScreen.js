import _ from "lodash";
import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import EventButton from '../components/event/Button';
import EventComments from '../components/event/Comments';
import Notifications from '../components/event/Notifications';
import GuestInfo from '../components/event/GuestInfo';
import AddFriend from '../components/event/AddFriend';
import Content from '../components/event/Content';
import Actions from '../state/Actions';
const {height, width} = Dimensions.get('window');

@connect(data => EventScreen.getDataProps(data))
export default class EventScreen extends React.Component {

  state = {
    showCommentBox: false,
    showGuestInfo: false,
    showAddFriend: false,
    showNotification: false,
    comment: '',
    parentID: null,
    guestIndex: 0,
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
      let commentProps = {
        showCommentBox: this.state.showCommentBox,
        comment: this.state.comment,
        onChangeText: this._onCommentText,
        saveComment: this._saveComment,
      };
      let contentProps = {
        onCommentPress: this._onCommentPress,
        onScroll: this._onScroll,
        guestClick: this._onGuestClick,
        showAddFriend: this.showAddFriend,
        onNotificationClick: this._onNotificationClick,
      };
      return (
        <View style={styles.scrollView}>
          <Content {...contentProps} />
          <Notifications show={this.state.showNotification} close={this._closeNotification} />
          <GuestInfo showGuestInfo={this.state.showGuestInfo} close={this._closeGuestInfo} index={this.state.guestIndex} />
          <AddFriend show={this.state.showAddFriend} hide={this.showAddFriend} />
          <EventButton />
          {this._renderBackBtn()}
          <EventComments {...commentProps} />
        </View> 
      );
    }
  }

  showAddFriend = () => {
    this.setState({showAddFriend: !this.state.showAddFriend});
  }

  _renderBackBtn = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity style={styles.back} underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  _closeGuestInfo = () => {
    this.setState({showGuestInfo: false});
  }

  _closeNotification = () => {
    this.setState({showNotification: false});
  }

  _backBtnPress = _.debounce(() => {
      this.props.dispatch(Actions.zeroSelectedEvent());
      this.props.dispatch(Actions.zeroSelectedComment());
      this.props.dispatch(Actions.routeChange('Back'));
    }, 3000, {
      leading: true,
   });

  _onCommentPress = (parentID) => {
    if (typeof parentID === 'string') {
      this.setState({showCommentBox: true, parentID});
    } else {
      this.setState({parentID: null, showCommentBox: true});
    }
  }

  _onGuestClick = (i) => {
    this.setState({showGuestInfo: true});
    this.setState({guestIndex: i});
  }

  _onNotificationClick = () => {
     this.setState({showNotification: true});
  }

  _onScroll = () => {
    this.setState({showCommentBox: false, showGuestInfo: false});
  }

  _onCommentText = (text) => {
    this.setState({comment: text});
  }

  _saveComment = () => {
    this.props.dispatch(
      Actions.saveComment(this.state.comment,
        this.props.selectedEvent.id, this.state.parentID)
    );
    this.setState({showCommentBox: false, comment: ''});
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnBack: {
    width: 80,
    height: 80,
  },
  back: {
    position: 'absolute',
    zIndex: 3,
  },
});
