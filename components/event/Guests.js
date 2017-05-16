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
import { MaterialIcons } from '@expo/vector-icons';
import Icons from '../../constants/activities';
import Actions from '../../state/Actions';
import MyText from '../common/MyText';
const dateFormat = require('dateformat');
const {height, width} = Dimensions.get('window');

export default class EventGuests extends React.Component {

  state = {
    selectedUser: null,
  }

  render() {
    return (
      <View>
        {this._renderUser()}
        <ScrollView
          style={styles.scrollview}
          horizontal={true}>
          {
            this.props.guests.accepted.map(g =>
              <GuestPic
                key={g.name}
                profilePic={g.profilePic}
                opacity={1}
                user={g}
                selectPic={this._selectPic.bind(this, g)}
              />
            )
          }
          {
            this.props.guests.invited.map(g =>
              <GuestPic
                key={g.name}
                profilePic={g.profilePic}
                opacity={0.4}
                user={g}
                selectPic={this._selectPic.bind(this, g)}
              />
            )
          }
          {
            this.props.guests.requested.map(g =>
              <GuestPic
                key={g.name}
                profilePic={g.profilePic}
                opacity={0.4}
                user={g}
                selectPic={this._selectPic.bind(this, g)}
              />
            )
          }
        </ScrollView>
      </View>
    );
  }

  _renderUser = () => {
    if (this.state.selectedUser && this.props.noScroll) {
      return (
        <View style={{zIndex: 5, height:80, width, position: 'absolute', top: -80}}>
          <View style={{borderWidth: 1, backgroundColor: '#fff', height:70, width: 150}}>
            <MyText>{this.state.selectedUser.name}</MyText>
          </View>
          <MaterialIcons
            style={{backgroundColor: 'transparent'}}
            size={24}
            name={'arrow-drop-down'}
            color={"#222"}
          />
        </View>
      );
    } else {
      return null;
    }
  }

  _selectPic = (user) => {
    this.setState({selectedUser: user});
  }
}

class GuestPic extends React.Component {

  render() {
    return (
      <TouchableOpacity onPress={this.props.selectPic}>
        <Image
          source={{uri: this.props.profilePic}}
          style={styles.image}
          opacity={this.props.opacity}
        />
      </TouchableOpacity>
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
