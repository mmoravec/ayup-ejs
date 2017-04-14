import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Fuse from 'fuse.js';
import ImmutableListView from 'react-native-immutable-list-view';
import MyText from '../common/MyText';
const {height, width} = Dimensions.get('window');

@connect((data) => FriendSelector.getDataProps(data))
export default class FriendSelector extends React.Component {

  static getDataProps(data) {
    return {
      friends: data.user.friends,
    };
  }

  state = {
    addBtnLeft: new Animated.Value(15),
    addBtnRotate: new Animated.Value(0),
    addingFriend: false,
    invitedFriends: new List(),
    filteredFriends: new List(),
    inputText: "",
    incScrollY: 0,
  }

  _fuseOptions = {
    shouldSort: true,
    tokenize: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "name",
    ],
  };

  _fuse = new Fuse(this.props.friends.toJS(), this._fuseOptions);

  componentDidMount() {
    setTimeout(() => {
      this._view.measure((fx, fy, width, height, px, py) => {
        this._scrollY = py;
      });
    }, 200);
  }

  componetDidUpdate(prevProps, prevState) {
    if (prevProps.friends !== this.props.friends) {
      this._fuse = new Fuse(this.props.friends.toJS(), this._fuseOptions);
    }
  }

  render() {
    return (
      <View ref={view => { this._view = view; }} style={styles.container}>
        <MyText style={styles.label}>Add Friends:</MyText>
        {this._renderInvitedFriends()}
        {this._renderAddButton()}
        {this._renderFilteredFriends()}
      </View>
    );
  }

  _renderAddButton = () => {
    const spin = this.state.addBtnRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });
    if (this.state.addingFriend) {
      Animated.timing(this.state.addBtnLeft, {toValue: width * 0.75, duration: 500}).start();
      Animated.timing(this.state.addBtnRotate, {toValue: 1, duration: 500}).start();
    } else {
      Animated.timing(this.state.addBtnLeft, {toValue: 15, duration: 500}).start();
      Animated.timing(this.state.addBtnRotate, {toValue: 0, duration: 500}).start();
    }
    return (
      <View>
        <Animated.View
          style={{
            marginLeft: this.state.addBtnLeft,
            marginBottom: 15,
            marginTop: 15,
            zIndex: 0,
          }}>
          <TouchableOpacity onPress={this._addFriend}>
            <Animated.Image
              source={require('../../assets/images/add_friend.png')}
              style={[styles.add, {transform: [{rotate: spin}]}]}
            />
          </TouchableOpacity>
        </Animated.View>
        {this._renderInput()}
      </View>
    );
  }
  _addFriend = () => {
    if (!this.state.addingFriend) {
      this.setState({inputText: ''});
      this.props.onFocus(this.props.stateKey);
      setTimeout(() => { this.props.scrollTo(this._scrollY + this.state.invitedFriends.size * 60 - 80)}, 200);
    }
    this.setState({addingFriend: !this.state.addingFriend});
  }

  _renderInput = () => {
    if (this.state.addingFriend) {
      return (
        <View style={styles.friendFilter}>
          <TextInput
            autoFocus={true}
            style={styles.input}
            value={this.state.inputText}
            onChangeText={this._onChangeText}
          />
        </View>
      );
    }
  }

  _onChangeText = (text) => {
    this.setState({inputText: text});
    let filteredFriends = this._fuse.search(text);
    this.setState({filteredFriends: new List(filteredFriends)});
  }

  _renderInvitedFriends = () => {
    if (this.state.invitedFriends.size > 0) {
      return (
        <ImmutableListView
          immutableData={this.state.invitedFriends}
          renderRow={this._renderInvitedRow}
          keyboardShouldPersistTaps={'always'}
        />
      );
    }
  }

  _renderFilteredFriends = () => {
    if (this.state.addingFriend && this.props.friends.size > 0) {
      return (
        <ImmutableListView
          immutableData={this.state.filteredFriends}
          renderRow={this._renderFilterRow}
          keyboardShouldPersistTaps={'always'}
          style={{marginBottom: 300}}
        />
      );
    }
  }

  _renderFilterRow = (rowData) => {
    let push = this._pushFriend.bind(this, rowData);
    return (
      <TouchableHighlight underlayColor={'#f2f2f2'} onPress={push}>
        <View style={styles.friend}>
          <View style={styles.imageBox}>
            <Image
              source={{uri: rowData.profilePic}}
              style={styles.friendPic}
            />
          </View>
          <View style={styles.nameBox}>
            <MyText style={styles.name}>{rowData.name}</MyText>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderInvitedRow = (rowData) => {
    let remove = this._removeFriend.bind(this, rowData);
    return (
      <View style={styles.friend}>
        <View style={styles.imageBox}>
          <Image
            source={{uri: rowData.profilePic}}
            style={styles.friendPic}
          />
        </View>
        <View style={styles.nameBox}>
          <MyText style={styles.name}>{rowData.name}</MyText>
        </View>
        <TouchableOpacity onPress={remove}>
          <Image
            source={require('../../assets/images/add_friend.png')}
            style={[styles.remove, {transform: [{rotate: '45deg'}]}]}
          />
        </TouchableOpacity>
      </View>
    );
  }

  _pushFriend = (friend) => {
    let friends = this.state.invitedFriends;
    var result = friends.find(obj => obj.name === friend.name);
    if (!result) {
      friends = friends.push(friend);
      this.setState({invitedFriends: friends});
      this.props.onChange(this.props.stateKey, friends);
    }
  }

  _removeFriend = (friend) => {
    let friends = this.state.invitedFriends;
    let newFriends = friends.filter(obj => obj.fbid !== friend.fbid);
    this.setState({invitedFriends: newFriends});
    this.props.onChange(this.props.stateKey, newFriends);
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: '#b9c1ca',
    paddingBottom: 10,
  },
  label: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 16,
    color: "#6a7989"
  },
  add: {
    height: 40,
    width: 40,
  },
  remove: {
    height: 30,
    width: 30,
    margin: 18,
  },
  friend: {
    height: 60,
    flexDirection: 'row',
  },
  friendFilter: {
    height: 40,
    left: 15,
    top: 15,
    position: 'absolute',
    width: width * 0.6,
  },
  input: {
    width: width * 0.6,
    height: 40,
    fontSize: 18,
    fontFamily: 'LatoRegular',
  },
  friendPic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 10,
  },
  imageBox: {
    height: 60,
  },
  nameBox: {
    height: 60,
  },
  name: {
    fontSize: 16,
    marginTop: 25,
    marginLeft: 10,
  },
});
