import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import Actions from '../state/Actions';
import MyText from '../components/common/MyText';
const {height, width} = Dimensions.get('window');

@connect()
export default class SettingsScreen extends React.Component {

  render() {
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <TouchableOpacity style={styles.backPress} underlayColor="transparent" onPress={this._home}>
          {
            (Platform.OS === 'ios') &&
            <Image
              source={require('../assets/images/btn_back.png')}
              style={styles.btnBack}
            />
          }
        </TouchableOpacity>
        <ScrollView style={styles.scrollParent}>
          <View style={styles.group}>
            <TouchableOpacity onPress={this._signOut}>
              <View style={styles.signOutButton}>
                <MyText>
                  Sign Out
                </MyText>
                <MaterialIcons
                  size={24}
                  style={{marginRight: 20}}
                  name={'keyboard-arrow-right'}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.seperator} />
            <TouchableOpacity onPress={this._feedback}>
              <View style={styles.signOutButton}>
                <MyText>
                  Feedback
                </MyText>
                <MaterialIcons
                  size={24}
                  style={{marginRight: 20}}
                  name={'keyboard-arrow-right'}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Image>
    );
  }
  _signOut = () => {
    this.props.dispatch(Actions.logOut());
  }
  _home = () => {
    this.props.dispatch(Actions.routeChange('Back'));
  }
  _feedback = () => {
    Linking.openURL('https://goo.gl/forms/yoyvyrKkxR3PwLeu1');
  }
}

const styles = StyleSheet.create({
  signOutButton: {
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    width: width * 0.95,
    height: 40,
    paddingLeft: 15,
    flexDirection: 'row',
  },
  seperator: {
    borderBottomWidth: 1,
    borderColor: '#e2eceb',
  },
  group: {
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
  },
  btnBack: {
    width: 80,
    height: 80,
  },
  backPress: {
    zIndex: 2,
    width: 80,
    height: 80,
  },
  scrollParent: {
    width: width * 0.95,
    marginLeft: width * 0.025,
  },
});
