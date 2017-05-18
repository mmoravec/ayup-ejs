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
      user: data.user,
    };
  }
  state = {
    selectedUser: null,
    hostInfo: true,
    index: 0,
    requested: this.props.event.accepted,
    //TODO: updated to requested when backend switches over
  }
  componentDidUpdate(prevProps) {
    if (this._swiper && prevProps.index !== this.props.index) {
      this._swiper.scrollBy(this.props.index, true);
    }
  }

  render() {
    //TODO: change this to requested once nick pushes new backend
    if (this.props.user.id === this.props.event.host.userID &&
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
                    profilePic={g.profilePic}
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
    let joined = event.accepted.concat(event.requested, event.invited);
    return joined.map(g => {
      return (
        <Card
          key={g.name}
          profilePic={g.profilePic}
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
    if (this.state.requested.length <= this.state.index + 1) {
      this.setState({hostInfo: false});
    }
    this._swiper.scrollBy(this.state.index + 1, true);
  }

}

class Card extends React.Component {

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
            <Image
              source={{uri: this.props.profilePic}}
              style={styles.image}
            />
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
    this.props.nextSlide();
    this.setState({clicked: 'Accepted'});
  }

  _rejectUser = () => {
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
    marginTop: 35,
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
  },
  picName: {
    width: 340,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    marginTop: 60,
    marginRight: 35,
    width: 160,
    justifyContent: 'center',
  },
  buttons: {
    width: 260,
    justifyContent: 'space-around',
    flexDirection: 'row',
    height: 40,
  },
});
