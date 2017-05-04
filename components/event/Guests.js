import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import Icons from '../../constants/activities';
import Actions from '../../state/Actions';
const dateFormat = require('dateformat');
const {height, width} = Dimensions.get('window');

export default class EventGuests extends React.Component {

  render() {
    return (
      <ScrollView
        style={styles.scrollview}
        horizontal={true}>
        {
          this.props.guests.accepted.map(g =>
            <Image
              source={{uri: g.profilePic}}
              style={styles.image}
              key={g.name}
            />
          )
        }
        {
          this.props.guests.invited.map(g =>
            <Image
              source={{uri: g.profilePic}}
              style={styles.image}
              opacity={0.4}
              key={g.name}
            />
          )
        }
        {
          this.props.guests.requested.map(g =>
            <Image
              source={{uri: g.profilePic}}
              style={styles.image}
              opacity={0.4}
              key={g.name}
            />
          )
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 50,
    width: 50,
    margin: 5,
    borderRadius: 25,
  },
});
