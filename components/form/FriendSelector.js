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
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { List } from 'immutable';
import ImmutableListView from 'react-native-immutable-list-view';
import Fuse from 'fuse.js';
import MyText from '../common/MyText';
import Actions from '../../state/Actions';
const {height, width} = Dimensions.get('window');

@connect((data) => FriendSelector.getDataProps(data))
export default class FriendSelector extends React.Component {

  static getDataProps(data) {
    return {
      friends: data.profile.friends,
    };
  }

  state = {
    addBtnLeft: new Animated.Value(15),
    addBtnRotate: new Animated.Value(0),
    addingFriend: false,
    invitedFriends: [],
    filteredFriends: [],
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
      {
        name: 'name',
        weight: 0.4,
      },
      {
        name: 'profile_pic',
        weight: 0.6
      }
    ],
  };
  
  _fuse = new Fuse(this.props.friends, this._fuseOptions);

  componentDidMount() {
    setTimeout(() => {
      this._view.measure((fx, fy, width, height, px, py) => {
        this._scrollY = py;
      });
    }, 200);
  }

  componetDidUpdate(prevProps, prevState) {
    if (prevProps.friends !== this.props.friends) {
      this._fuse = new Fuse(this.props.friends, this._fuseOptions);
    }
  }

  render() {
    return (
      <View ref={view => { this._view = view; }} style={styles.container}>
        <MyText style={styles.label}>Add Friends</MyText>
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
    if (this.props.focus) {
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
    if (!this.props.focus) {
      this.setState({inputText: ''});
      setTimeout(() => { this.props.scrollTo(this._scrollY + this.props.value.size * 60 - 80); }, 200);
    }
    this.props.onFocus(this.props.stateKey);
    this.props.dispatch(Actions.inviteFriends());
  }

  _renderInput = () => {
    if (this.props.focus) {
      return (
        <View style={styles.friendFilter}>
          <TextInput
            autoFocus
            style={styles.input}
            value={this.state.inputText}
            onChangeText={this._onChangeText}
            returnKeyType={'done'}
            onSubmitEditing={this._addFriend}
          />
        </View>
      );
    }
  }

  _onChangeText = (text) => {
    this.setState({inputText: text});
    let filteredFriends = this._fuse.search(text);
    this.setState({filteredFriends});
  }

  _renderInvitedFriends = () => {
    if (this.props.value.size > 0) {
      return (
        <ImmutableListView
          immutableData={this.props.value}
          renderRow={this._renderInvitedRow}
          keyboardShouldPersistTaps={'always'}
        />
      );
    }
  }

  _renderFilteredFriends = () => {
    if (this.props.focus && this.props.friends.length > 0) {
      return (
        <FlatList
          data={this.state.filteredFriends}
          renderItem={this._renderFilterRow}
          keyExtractor={this._keyExtractor}
          keyboardShouldPersistTaps={'always'}
          style={{marginBottom: 300}}
        />
      );
    }
  }

  _keyExtractor = (item, index) => item.ayup_id;

  _renderFilterRow = (rowData) => {
    let push = this._pushFriend.bind(this, rowData), num;
    if (rowData.item.phone) {
      num = "(" + rowData.item.phone.substring(0, 3) + ") " +
      rowData.item.phone.substring(3, 6) + "-" + rowData.item.phone.substring(6);
    }
    return (
      <TouchableHighlight underlayColor={'#f2f2f2'} onPress={push}>
        <View style={styles.friend}>
          <View style={styles.imageBox}>
            {this._renderProfPic(rowData)}
          </View>
          <View style={styles.nameBox}>
            <MyText style={styles.name}>{rowData.item.name}</MyText>
            {
              rowData.item.phone && !rowData.item.profile_pic &&
              <MyText style={styles.phone}>{num}</MyText>
            }
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderInvitedRow = (rowData) => {
    let remove = this._removeFriend.bind(this, rowData), num;
    if (rowData.item.phone) {
      num = "(" + rowData.item.phone.substring(0, 3) + ") " +
      rowData.item.phone.substring(3, 6) + "-" + rowData.item.phone.substring(6);
    }
    return (
      <View style={styles.friend}>
        <View style={styles.imageBox}>
          {this._renderProfPic(rowData)}
        </View>
        <View style={styles.nameBox}>
          <MyText style={styles.name}>{rowData.item.name}</MyText>
          {
            rowData.item.phone && !rowData.item.profile_pic &&
            <MyText style={styles.phone}>{num}</MyText>
          }
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

  _renderProfPic = (rowData) => {
    if (rowData.item.profile_pic) {
      return (
        <Image
          source={{uri: rowData.item.profile_pic}}
          style={styles.friendPic}
        />
      );
    } else {
      return (
        <Image
          source={require('../../assets/images/sms_circle.png')}
          style={styles.friendPic}>
          <MyText style={{margin: 10, marginTop: 16, backgroundColor: "transparent" }}>SMS</MyText>
        </Image>
      );
    }
  }

  _pushFriend = (friend) => {
    let friends = this.props.value;
    var result = friends.find(obj => obj.item.name === friend.item.name);
    if (!result) {
      friends = friends.push(friend);
      this.props.onChange(this.props.stateKey, friends);
    }
  }

  _removeFriend = (friend) => {
    let friends = this.props.value;
    let newFriends = friends.filter(obj => obj.fbid !== friend.fbid);
    this.props.onChange(this.props.stateKey, newFriends);
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#b9c1ca',
    paddingBottom: 10,
  },
  label: {
    marginTop: 15,
    marginLeft: 15,
    fontSize: 16,
    color: "#6a7989",
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
    justifyContent: 'center',
    flexDirection: 'column',
  },
  name: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 10,
  },
  phone: {
    fontSize: 10,
    marginLeft: 10,
    color: '#758282',
  },
});
