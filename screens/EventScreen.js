import React from 'react';
import { Components } from 'exponent';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Icons from '../constants/icons';
import Figures from '../constants/figures';
import Actions from '../state/Actions';
import MyText from '../components/common/MyText';
const {height, width} = Dimensions.get('window');

@connect(data => EventScreen.getDataProps(data))
export default class EventScreen extends React.Component {

  static getDataProps(data) {
    return {
      selectedEvent: data.events.selectedEvent,
    };
  }

  render() {
    let event = this.props.selectedEvent;
    let coord = {
      longitude: event.location.coordinates[0],
      latitude: event.location.coordinates[1],
      latitudeDelta: 0.003850375166415176,
      longitudeDelta: 0.01609325556559327,
    };
    let marker = {
      longitude: event.location.coordinates[0],
      latitude: event.location.coordinates[1] - 0.001,
      latitudeDelta: 0.003850375166415176,
      longitudeDelta: 0.01609325556559327,
    };
    let icon = Icons[event.activity].icon;
    return (
      <View style={styles.scrollView}>
        <TouchableOpacity style={styles.back} underlayColor="transparent" onPress={this._backBtnPress}>
          <Image
            source={require('../assets/images/btn_back.png')}
            style={styles.btnBack}
          />
        </TouchableOpacity>
        <ScrollView
          ref="scrollView"
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={styles.form}>
          <Components.MapView
            style={styles.map}
            onRegionChangeComplete={this._onRegionChange}
            zoomEnabled={false}
            scrollEnabled={false}
            provider={"google"}
            initialRegion={coord}>
            <Components.MapView.Marker
              key={0}
              coordinate={marker}
              image={icon}
            />
          </Components.MapView>
          <View style={styles.topInfo}>
            <View style={{height: 100, width: 100}}>
              <Image
                source={{uri: event.author.profilePic}}
                style={styles.profilePic}
              />
            </View>
            <View style={styles.name}>
              <Text style={{fontFamily: 'LatoRegular', fontSize: 20}}>{event.author.name}</Text>
            </View>
            <View style={styles.figure}>
              <Image
                source={Figures[event.activity].icon}
                style={{height: 40, width: 40, marginLeft: 20}}
              />
              <MyText style={{marginTop: 8}}>4am - 4:15am</MyText>
            </View>
          </View>
          <View style={styles.middleInfo}>
            <MyText style={{fontSize: 24, margin: 14, marginBottom: 6}}>{event.title}</MyText>
            <MyText style={{fontSize: 14, marginLeft: 14}}>{event.location.text}</MyText>
            {event.description &&
              <MyText style={{fontSize: 16, margin: 14, color: '#808080'}}>{event.description}</MyText>}
          </View>
          <View style={styles.bottomInfo}>
            <MyText style={{color: '#5bc4a5', fontSize: 14, margin: 14, marginRight: 2}}>People going</MyText>
            <MyText style={{color: '#ee366f', fontSize: 14, marginTop: 14}}>/ Unconfirmed</MyText>
          </View>
          <View style={styles.btmPadding} />
        </ScrollView>
      </View>
    );
  }

  _backBtnPress = () => {
    this.props.navigator.pop();
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  form: {
    flexDirection: 'column',
  },
  map: {
    height: 150,
  },
  name: {
    height: 100,
    width: 150,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  figure: {
    justifyContent: 'center',
    marginLeft: 20,
  },
  profilePic: {
    height: 76,
    width: 76,
    margin: 12,
    borderRadius: 38,
  },
  topInfo: {
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    flexDirection: 'row',
  },
  middleInfo: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  bottomInfo: {
    flexDirection: 'row',
  },
  input: {
    backgroundColor: '#fff',
  },
  btnBack: {
    width: 40,
    height: 40,
  },
  back: {
    left: 15,
    top: 15,
    position: 'absolute',
  },
});
