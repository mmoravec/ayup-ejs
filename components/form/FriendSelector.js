import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MyText from '../common/MyText';
const {height, width} = Dimensions.get('window');

export default class FriendSelector extends React.Component {

  state = {
    addBtnLeft: new Animated.Value(15),
    addBtnRotate: new Animated.Value(0),
    addingFriend: false,
  }

  render() {
    return (
      <View style={styles.container}>
        <MyText style={styles.label}>Add Friends:</MyText>
        {this._renderAddButton()}
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
            transform: [{
              rotate: spin,
            }],
          }}>
          <TouchableOpacity onPress={this._addFriend}>
            <Image
              source={require('../../assets/images/add_friend.png')}
              style={styles.add}
            />
          </TouchableOpacity>
        </Animated.View>
        {this._renderInput()}
      </View>
    );
  }
  _addFriend = () => {
    this.setState({addingFriend: !this.state.addingFriend});
  }

  _renderInput = () => {
    if (this.state.addingFriend) {
      return (
        <TextInput autoFocus={true} style={styles.input} />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: '#b9c1ca',
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
  input: {
    position: 'absolute',
    width: width * 0.6,
    height: 40,
    left: 15,
  },
});
