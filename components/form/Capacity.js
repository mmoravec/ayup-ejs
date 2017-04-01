import React from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import MyText from '../common/MyText';
const {height, width} = Dimensions.get('window');

export default class Capacity extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <MyText style={styles.label}>Capacity</MyText>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={this._decrement}>
            <Ionicons
              size={30}
              name={'ios-remove'}
            />
          </TouchableOpacity>
          <MyText style={styles.text}>{this.props.capacity}</MyText>
          <TouchableOpacity onPress={this._increment}>
            <Ionicons
              size={30}
              name={'ios-add'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _increment = () => {
    let inc = this.props.capacity;
    inc++;
    this.props.onChange(this.props.stateKey, inc);
  }
  _decrement = () => {
    let dec = this.props.capacity;
    dec = (dec > 0) ? dec-- : dec;
    this.props.onChange(this.props.stateKey, dec);
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#b9c1ca',
    height: 72,
    flexDirection: 'row',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 25,
  },
  text: {
    fontSize: 16,
    color: '#6a7989',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    color: '#6a7989',
    marginTop: 30,
    marginLeft: 20,
    marginRight: width * 0.3,
    alignSelf: 'flex-start',
  },
  swButton: {
    position: 'absolute',
    right: 16,
    bottom: 10,
  },
});
