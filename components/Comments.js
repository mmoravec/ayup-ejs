import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { List } from 'immutable';
import ImmutableListView from 'react-native-immutable-list-view';
import MyText from './common/MyText';
import Actions from '../state/Actions';
import { User, Comment } from '../state/Records';
import sampleComments from '../sample/comments';
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

  render() {
    if (this._comments !== null) {
      return (
        <ImmutableListView
          immutableData={this._comments}
          renderRow={this._renderRow}
          renderHeader={this.props.header}
        />
      );
    } else {
      return null;
    }
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
