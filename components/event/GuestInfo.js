import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import {
  Ionicons,
} from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import Actions from '../../state/Actions';
import MyText from '../common/MyText';
const {height, width} = Dimensions.get('window');

@connect(data => GuestInfo.getDataProps(data))
export default class GuestInfo extends React.Component {
  static getDataProps(data) {
    return {
      event: data.events.selectedEvent,
      profile: data.profile,
    };
  }
  state = {
    selectedUser: null,
    hostInfo: true,
    index: 0,
    requested: this.props.event.requested,
    changed: false,
    //TODO: updated to requested when backend switches over
  }
  componentDidUpdate(prevProps) {
    if (this._swiper && prevProps.index !== this.props.index) {
      this._swiper.scrollBy(this.props.index, true);
    }
  }

  render() {
    //TODO: change this to requested once nick pushes new backend
    if (this.props.profile.id === this.props.event.host.id &&
      this.state.requested.length > 0 && this.state.hostInfo) {
      return (
        <Modal
          animationType={"slide"}
          onRequestClose={this._closeModal}
          transparent>
          <View style={{height, width, flex: 1, backgroundColor: 'rgba(255,255,255,.8)'}}>
            <TouchableOpacity onPress={this._closeModal} style={styles.back}>
              <Ionicons
                size={40}
                name={'ios-close-circle-outline'}
              />
            </TouchableOpacity>
            <Swiper
              style={styles.swiper}
              onMomentumScrollEnd={this._onMomentumScrollEnd}
              ref={(swiper) => { this._swiper = swiper; }}>
              {
                this.state.requested.map(g =>
                  <Card
                    key={g.name}
                    profilePic={g.profile_pic}
                    opacity={0.4}
                    user={g}
                    host
                    nextSlide={this._nextSlide}
                  />
                )
              }
            </Swiper>
          </View>
        </Modal>
      );
    } else if (this.props.showGuestInfo) {
      return (
        <Modal
          animationType={"slide"}
          onRequestClose={this._closeModal}
          transparent>
          <View style={{height, width, flex: 1, backgroundColor: 'rgba(255,255,255,.8)'}}>
            <TouchableOpacity onPress={this._closeModal} style={styles.back}>
              <Ionicons
                size={40}
                name={'ios-close-circle-outline'}
              />
            </TouchableOpacity>
            <Swiper
              renderPagination={this._renderPagination}
              paginationStyle={{ bottom: -23, left: null, right: 10}}
              ref={(swiper) => { this._swiper = swiper; }}
              onMomentumScrollEnd={this._onMomentumScrollEnd}
              style={styles.swiper}>
              {this._renderGuests()}
            </Swiper>
          </View>
        </Modal>
      );
    } else {
      return null;
    }
  }

  _closeModal = () => {
    this.props.close();
    this.setState({hostInfo: false});
  }
  _renderPagination = (index, total, context) => {
    return (
      <View
        style={{
        position: 'absolute',
        bottom: Platform.OS === 'android' ? 25 : 10,
        right: 10,
      }}>
        <MyText style={{ color: 'grey' }}>
          <MyText
            style={{
            color: 'black',
            fontSize: 20,
          }}>{index + 1}</MyText>/{total}
        </MyText>
      </View>
    );
  }

  _renderGuests = () => {
    let event = this.props.event;
    let joined = event.going.concat(event.requested, event.invited);
    return joined.map(g => {
      return (
        <Card
          key={g.name}
          profilePic={g.profile_pic}
          nextSlide={this._nextSlide}
          user={g}
          host={false}
        />
      );
    });
  }

  _onMomentumScrollEnd = (e, state, context) => {
    this.setState({index: state.index});
  }

  _nextSlide = () => {
    this.setState({changed: true});
    if (this.state.requested.length <= this.state.index + 1) {
      this._closeModal();
    }
    this._swiper.scrollBy(this.state.index + 1, true);
  }

}

@connect(data => Card.getDataProps(data))
class Card extends React.Component {

    static getDataProps(data) {
      return {
        event: data.events.selectedEvent,
      };
    }

  state = {
    clicked: '',
  }

  render() {
    return (
      <View style={styles.imageContainer}>
        <Image
          style={styles.box}
          resizeMode={'contain'}
          source={require('../../assets/images/pretty_modal.png')}>
          <View style={styles.picName}>
            {this.props.profilePic !== "" &&
              <Image
                source={{ uri: this.props.profilePic }}
                style={styles.image}
              />}
            {this.props.profilePic === "" &&
              <Image
                source={require("../../assets/images/sms_circle.png")}
                style={styles.image}>
                <MyText
                  style={{
                    marginLeft: 25,
                    marginTop: 30,
                    backgroundColor: "transparent",
                  }}>
                  SMS
                </MyText>
              </Image>}
            <MyText style={styles.name}>{this.props.user.name}</MyText>
          </View>
        </Image>
        {this._renderButtons()}
      </View>
    );
  }
  //TODO: Put badges here

  _acceptUser = () => {
    //accept user action
    this.props.dispatch(Actions.acceptRequest(this.props.event.id, this.props.user.id));
    this.props.nextSlide();
    this.setState({clicked: 'Accepted'});
  }

  _rejectUser = () => {
    this.props.dispatch(Actions.rejectRequest(this.props.event.id, this.props.user.id));
    this.props.nextSlide();
    this.setState({clicked: 'Rejected'});
  }

  _renderButtons = () => {
    if (this.state.clicked === '' && this.props.host) {
      return (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={this._rejectUser}>
            <Image
              resizeMode={'contain'}
              source={require('../../assets/images/reject.png')}
              style={{height: 40}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._acceptUser}>
            <Image
              resizeMode={'contain'}
              source={require('../../assets/images/accept.png')}
              style={{height: 40}}
            />
          </TouchableOpacity>
        </View>
      );
    } else if (this.props.host) {
      let color = this.state.clicked === 'Accepted' ? '#8bd1c6' : '#ee366f';
      return (
        <View style={styles.buttons}>
          <MyText style={[styles.status, {color}]}>{this.state.clicked}</MyText>
        </View>
      );
    } else {
      return <View style={styles.buttons} />;
    }
  }
}

const styles = StyleSheet.create({
  status: {
    fontSize: 18,
    color: '#8bd1c6',
  },
  swiper: {
    zIndex: 1,
  },
  back: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 2,
  },
  image: {
    height: 80,
    width: 80,
    marginLeft: 35,
    borderRadius: 40,
  },
  imageContainer : {
    alignItems: 'center',
    flexDirection: 'column',
    height,
    width,
    justifyContent: 'center',
  },
  box: {
    height: 216,
    width: 340,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picName: {
    width: 340,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    marginRight: 35,
    width: 160,
    alignSelf: 'center',
  },
  buttons: {
    width: 260,
    justifyContent: 'space-around',
    flexDirection: 'row',
    height: 40,
  },
});
