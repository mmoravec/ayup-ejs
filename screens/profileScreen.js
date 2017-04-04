import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import MyText from '../components/common/MyText';
import Badges from '../constants/badges';
import Activities from '../constants/figures';
import Actions from '../state/Actions';

@connect(data => ProfileScreen.getDataProps(data))
export default class ProfileScreen extends React.Component {

  static getDataProps(data) {
    return {
      user: data.user,
    };
  }

  componentWillMount() {
    this.props.dispatch(Actions.getProfile())
  }

  render() {
    let user = this.props.user;
    return (
      <Image source={require('../assets/images/bkgd_map.png')} style={styles.container}>
        <TouchableOpacity style={{zIndex: 2}} onPress={this._onCloseBtnPress}>
          <Image
            source={require('../assets/images/btn_close_prof.png')}
            style={styles.btnclose}
          />
        </TouchableOpacity>
        <View style={styles.scrollContainer}>
          <ScrollView
            contentContainerStyle={styles.form}>
            <View style={styles.topInfo}>
              <Image
                source={{uri: user.profilePic}}
                style={styles.profilePic}
              />
              <MyText style={{fontSize: 20, marginTop: 60}}>{user.name}</MyText>
            </View>
            <ScrollView horizontal={true} style={styles.badges}>
              {
                user.badges.map(badge => {
                  return (
                    <Image
                      source={Badges[badge.type]}
                      style={{height: 60, width: 60, margin: 10}}
                      key={badge.id}
                    />
                  );
                })
              }
            </ScrollView>
            {this._renderActivities(user)}
            <View style={{padding: 10, flexDirection: 'column'}}>
              <MyText style={{fontSize: 18}}>About Me:</MyText>
              <MyText>{user.about}</MyText>
            </View>
          </ScrollView>
        </View>
      </Image>
    );
  }

  _renderActivities = (user) => {
    let alt = 0;
    return (
      <ScrollView horizontal={true} style={{height: 160, borderBottomColor: '#e5e5e5',
          borderBottomWidth: 2}}>
        {
          user.activities.map(act => {
            alt++;
            if (alt % 2 > 0) {
              return (
                <View key={act.name} style={{height: 160, width: 80}}>
                  <Image
                    source={Activities[act.name].icon}
                    style={styles.actTopImage}
                  />
                </View>
              );
            } else {
              return (
                <View key={act.name} style={{height: 160, width: 80}}>
                  <Image
                    source={Activities[act.name].icon}
                    style={styles.actBotImage}
                  />
                </View>
              );
            }
          })
        }
      </ScrollView>
    )
  }

  _onCloseBtnPress = () => {
    this.props.dispatch(Actions.routeChange('Back'));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
  },
  scrollContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
  },
  btnclose: {
    height: 60,
    width: 60,
    position: 'absolute',
    right: 40,
    top: 10,
  },
  profilePic: {
    height: 100,
    width: 100,
    borderRadius: 50,
    margin: 20,
  },
  topInfo: {
    height: 140,
    flexDirection: 'row',
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 2,
  },
  badges: {
    height: 80,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e5e5',
  },
  actTopImage: {
    height: 55,
    width: 55,
    margin: 10,
  },
  actBotImage: {
    height: 55,
    width: 55,
    margin: 10,
    marginTop: 80,
  },
});
