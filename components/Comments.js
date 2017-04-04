import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Text,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { List } from 'immutable';
import ImmutableListView from 'react-native-immutable-list-view';
import MyText from './common/MyText';
import Bubble from './common/Bubble';
import Figures from '../constants/figures';
import { Comment } from '../state/Records';
import sampleComments from '../sample/comments';
import EventGuests from '../components/EventGuests';
import Filter from '../utils/filters';
const dateFormat = require('dateformat');
const {height, width} = Dimensions.get('window');

export default class Comments extends React.Component {

  constructor(props) {
    super(props);
    let comments = [];
    sampleComments.map(comment => {
      comment.posted = new Date(comment.posted);
      comment.modified = new Date(comment.modified);
      let push = new Comment(comment);
      comments.push(push);
    });
    this._comments = Filter.sortComments(new List(comments));
  }

  componentDidMount() {
    setTimeout(() => {
      this._commentsRef.measure((fx, fy, width, height, px, py) => {
        this._commentValueY = py;
      });
    }, 200);
  }

  render() {
    if (this._comments !== null) {
      return (
        <ImmutableListView
          ref={(listView) => { this._listView = listView; }}
          immutableData={this._comments}
          renderRow={this._renderRow}
          renderHeader={this._renderHeader}
        />
      );
    } else {
      return null;
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
            <Text style={{fontFamily: 'LatoRegular', fontSize: 20}}>{event.host.name}</Text>
          </View>
          <View style={styles.figure}>
            <Image
              source={Figures[event.activity].icon}
              style={{height: 40, width: 40, alignSelf: 'center'}}
            />
            <MyText style={{marginTop: 8}}>4am - 4:15am</MyText>
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
        <TouchableHighlight ref={view => { this._commentsRef = view; }} underlayColor={'#f2f2f2'} style={{backgroundColor: '#fff'}} onPress={this._scrollToComments}>
          <View>
            <MyText style={styles.seeAll}>See all comments</MyText>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _renderRow = (rowData) => {
    let _imageBox = styles.imageBox;
    if (rowData.parentid) {
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
              <MaterialIcons
                name={'reply'}
                size={14}
                color={"#c7c7c7"}
              />
              <MyText style={{color:"#5f5f5f"}}> Reply</MyText>
              <MyText style={{color:"#c7c7c7"}}> • </MyText>
              {this._renderTime(rowData.posted)}
            </View>
          </View>
        </View>
      </View>
    );
  }

  _scrollToComments = () => {
    this._listView.scrollTo({x: 0, y: this._commentValueY, animated: true});
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
  },
  parent: {
    flexDirection: 'row',
    flex: 1,
    margin: 5,
  },
  commentPic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 10,
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
