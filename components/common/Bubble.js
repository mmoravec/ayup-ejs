import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import MyText from './MyText';

export default class Bubble extends React.Component {
    render() {
      let image = this.props.data.capacity === 0 ? require('../../assets/images/joined.png') : require('../../assets/images/joined_notjoined.png');
      return (
        <View style={[styles.container, this.props.style]}>
          <Image
            source={image}
            style={styles.joinedBubble}
          />
          <MyText style={styles.joined}>{this.props.data.accepted.length}</MyText>
          {
            (this.props.data.capacity - this.props.data.accepted.length) > 9  ?
              <MyText style={[styles.left, {right: 5}]}>{this.props.data.capacity - this.props.data.accepted.length}</MyText> :
              <MyText style={[styles.left, {right: 7}]}>{this.props.data.capacity - this.props.data.accepted.length}</MyText>
          }
        </View>
      );
    }
}

const styles = StyleSheet.create({
  joinedBubble: {
    height: 26,
    width: 40,
  },
  joined: {
    position: 'absolute',
    left: 8,
    top: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#fff',
    fontFamily: 'LatoRegular',
  },
  left: {
    position: 'absolute',
    color: '#fff',
    top: 8,
    fontSize: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    fontFamily: 'LatoRegular',
  },
  container: {
    height: 26,
    width: 40,
  },
});
