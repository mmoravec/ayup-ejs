import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { List } from 'immutable';
import _ from 'lodash';
import ImmutableListView from 'react-native-immutable-list-view';
import MyText from './common/MyText';
import Bubble from './common/Bubble';
import Figures from '../constants/activities';
import { Comment } from '../state/Records';
import sampleComments from '../sample/comments';
import EventGuests from '../components/EventGuests';
import Filter from '../utils/filters';
import { duration } from '../utils/date';
import Actions from '../state/Actions';
const dateFormat = require('dateformat');
const {width} = Dimensions.get('window');

@connect(data => EventContent.getDataProps(data))
export default class EventContent extends React.Component {

  static getDataProps(data) {
    return {
      event: data.events.selectedEvent,
      comments: new List(Filter.sortComments(data.events.selectedComments)),
    };
  }

  state = {
    commenting: false,
    ready: false,
    comment: '',
    parentID: null,
    scrollY: 0,
  }

  componentWillMount() {
    this.props.dispatch(Actions.loadComments(this.props.event.id));
  }

  render() {
    return (
      <ImmutableListView
        style={{zIndex: 1}}
        ref={(listView) => { this._listView = listView; }}
        immutableData={this.props.comments}
        renderRow={this._renderRow}
        renderHeader={this._renderHeader}
        onScroll={this._onScroll}
        keyboardShouldPersistTaps={'always'}
      />
    );
  }

  _onScroll = () => {
    if (this.state.ready) {
      this.setState({commenting: false, ready: false});
    }
  }

  _renderHeader = () => {
    let event = this.props.event;
    let guests = {
      accepted: event.accepted,
      rejected: event.rejected,
      invited: event.invited,
      requested: event.requested,
    };
    let start = new Date(event.startDate);
    let end = new Date(event.endDate);
    return (
      <View style={{backgroundColor: 'rgba(0,0,0,0.0)'}}>
        <View style={{height: 150, backgroundColor: 'rgba(0,0,0,0.0)'}} />
        <View style={styles.topInfo}>
          <View>
            <Image
              source={{uri: event.host.profilePic}}
              style={styles.profilePic}
            />
          </View>
          <View style={styles.headerName}>
            <MyText style={{fontSize: 18, marginBottom: 5}}>{event.host.name}</MyText>
          </View>
          <View style={styles.figure}>
            <MyText style={{alignSelf: 'center', fontSize: 14}}>{dateFormat(start, "ddd, mmm dd")}</MyText>
            <MyText style={{alignSelf: 'center', fontSize: 14}}>{dateFormat(start, "shortTime")}</MyText>
            <MyText style={{alignSelf: 'center', fontSize: 14, color: "#b3b3b3"}}>{duration(start, end)}</MyText>
          </View>
        </View>
        <View style={styles.middleInfo}>
          <MyText style={{fontSize: 24, margin: 14, marginBottom: 6}}>{event.title}</MyText>
          <MyText style={{fontSize: 14, marginLeft: 14, marginBottom: 14}}>{event.location.text}</MyText>
          {event.description !== "" &&
            <MyText style={{fontSize: 16, margin: 14, color: '#808080'}}>{event.description}</MyText>}
        </View>
        <View style={styles.bottomInfo}>
          <View style={{flexDirection: 'row'}}>
            <MyText style={{color: '#5bc4a5', fontSize: 16, margin: 14, marginRight: 2}}>Going </MyText>
            <MyText style={{color: '#ee366f', fontSize: 16, marginTop: 14}}>/ Unconfirmed</MyText>
            <Bubble data={event} style={{alignSelf: 'center', position:'absolute', right: 10}} />
          </View>
          <EventGuests guests={guests} />
        </View>
        <View style={styles.comments}>
          <MyText style={styles.seeAll}>Comments({this.props.comments.size})</MyText>
          <TouchableOpacity style={styles.commentBtn} underlayColor={'#f2f2f2'} onPress={this._onCommentPress}>
            <MaterialCommunityIcons
              size={12}
              name={'message'}
              color={"#c7c7c7"}
              style={{marginTop: 3}}
            />
            <MyText style={styles.commentTxt}>Comment</MyText>
          </TouchableOpacity>
        </View>
        {this._renderCommentBox()}
      </View>
    );
  }

  _renderRow = (rowData) => {
    let replyPress = this._onReplyPress.bind(this, rowData.id);
    let _imageBox = styles.imageBox;
    if (rowData.parentID) {
      _imageBox = styles.extImageBox;
    }
    return (
      <View style={styles.grandparent}>
        <View style={styles.parent}>
          <View style={_imageBox}>
            <Image
              source={{uri: rowData.author.profilePic}}
              style={styles.commentPic}
            />
          </View>
          <View style={styles.contentParent}>
            <View style={styles.contentBox}>
              <MyText style={styles.name}>{rowData.author.name}</MyText>
              <MyText style={styles.content}>{rowData.content}</MyText>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={replyPress}>
                <MaterialIcons
                  name={'reply'}
                  size={14}
                  color={"#c7c7c7"}
                />
                <MyText style={{color:"#5f5f5f"}}> Reply</MyText>
              </TouchableOpacity>
              <MyText style={{color:"#c7c7c7"}}> • </MyText>
              {this._renderTime(rowData.modified)}
            </View>
          </View>
        </View>
      </View>
    );
  }

  _onCommentPress = () => {
    this._listView.scrollTo({y: 0, animated: false});
    this.setState({parentID: null, commenting: true});
    _.delay(() => this.setState({ready: true}), 1000);
  }

  _onReplyPress = (parentID) => {
    this._listView.scrollTo({y: 0, animated: false});
    this.setState({parentID, commenting: true});
    _.delay(() => this.setState({ready: true}), 1000);
  }

  _renderCommentBox = () => {
    if (this.state.commenting) {
      return (
        <KeyboardAvoidingView behavior={'position'} style={{flex: 1}}>
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

  _renderTime = (date) => {
    let now = new Date();
    let then = new Date(date);
    let diff = now - then;
    let minutes = Math.floor(diff / 60000);
    if (minutes < 60) {
      return <MyText style={{color:"#5f5f5f"}}>{minutes} mins </MyText>;
    } else if (minutes < 2880) {
      let hours = Math.floor(minutes / 60);
      return <MyText style={{color:"#5f5f5f"}}>{hours} hrs</MyText>;
    } else if (minutes < 14400) {
      let days = Math.floor(minutes / 1440);
      return <MyText style={{color:"#5f5f5f"}}>{days} days</MyText>;
    } else if (minutes < 525600) {
      return <MyText style={{color:"#5f5f5f"}}>{dateFormat(then, 'mmm d')}, {dateFormat(then, 'h:mm tt')}</MyText>;
    } else {
      let years = Math.floor(minutes / 525600);
      return <MyText style={{color:"#5f5f5f"}}>{dateFormat(then, 'mmm d yyyy')}, {dateFormat(then, 'shortTime')}</MyText>;
    }
  }
}

const styles = StyleSheet.create({
  grandparent: {
    backgroundColor: '#fff',
    zIndex: 1,
  },
  parent: {
    flexDirection: 'row',
    flex: 1,
    margin: 5,
  },
  commentTxt: {
    marginLeft: 5,
    fontSize: 14,
    color: "#5f5f5f",
  },
  comments: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentPic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 10,
  },
  commentBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginRight: 5,
    marginTop: 5,
    paddingRight: 5,
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
  },
  seeAll: {
    fontSize: 18,
    margin: 10,
    color: '#5f5f5f',
  },
  headerName: {
    height: 100,
    width: width * 0.4,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  profilePic: {
    height: 76,
    width: 76,
    margin: 12,
    borderRadius: 38,
  },
  middleInfo: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    backgroundColor: '#fff',
  },
  bottomInfo: {
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  topInfo: {
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  figure: {
    justifyContent: 'center',
    width: width * 0.3,
  },
  content: {
    fontSize: 14,
    color: '#808080',
  },
  imageBox: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  extImageBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 2,
  },
  contentBox: {
    backgroundColor: '#edf7f6',
    borderRadius: 10,
    padding: 10,
  },
  contentParent: {
    flex: 4,
    margin: 5,
  },
});
