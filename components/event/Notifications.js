import _ from "lodash";
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
import MyText from '../common/MyText';
import Actions from '../../state/Actions';
import { connect } from 'react-redux';
const {height, width} = Dimensions.get('window');

@connect((data) => Notifications.getDataProps(data))
export default class Notifications extends React.Component {
    static getDataProps(data) {
        return {
            notifications: data.phone.localNotifications,
            event: data.events.selectedEvent,
        };
    }

    notifications = [];
    componentWillReceiveProps(newProps) {
        this.notifications = [{
            id: 0,
            label: "15 Minutes Before Start",
            value: new Date(newProps.event.start_time).getTime() - 15 * (60 * 1000),
            title: "15 minutes",
        },
        {
            id: 1,
            label: "30 Minutes Before Start",
            value: new Date(newProps.event.start_time).getTime() - 30 * (60 * 1000),
            title: "30 minutes",
        },
        {
            id: 2,
            label: "45 Minutes Before Start",
            value: new Date(newProps.event.start_time).getTime() - 45 * (60 * 1000),
            title: "45 minutes",
        },
        {
            id: 3,
            label: "1 Hour Before Start",
            value: new Date(newProps.event.start_time).getTime() - 60 * (60 * 1000),
            title: "1 hour",
        },
        {
            id: 4,
            label: "2 Hours Before Start",
            value: new Date(newProps.event.start_time).getTime() - 120 * (60 * 1000),
            title: "2 hours",
        },
        {
            id: 5,
            label: "1 Day Before Start",
            value: new Date(newProps.event.start_time).getTime() - (60 * 24) * (60 * 1000),
            title: "1 day",
        },
    ];
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     debugger;
    //     if (_.size(nextProps.notifications) !== _.size(this.props.notifications)) {
    //         return true;
    //     } else if (this.props.show !== nextProps.show) {
    //         return true;
    //     }
    // }

    render() {
        if (this.props.show) {
            return (
              <Modal
                animationType={"slide"}
                onRequestClose={this._closeModal}
                transparent>
                <View style={styles.view}>
                  <View style={styles.container}>
                    <MyText style={styles.label}>Current Notifications</MyText>
                  </View>
                  {this._renderNotifications()}
                  <View style={styles.container}>
                    <MyText style={styles.label}>Add Notifications</MyText>
                  </View>
                  {this._renderOptions()}
                  <View style={styles.bottom}>
                    <TouchableOpacity
                      underlayColor="transparent"
                      style={styles.hlightSave}
                      onPress={this._closeModal}>
                      <Image
                        style={styles.btnDone}
                        resizeMode={"contain"}
                        source={require("../../assets/images/btn_done.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            );
        } else {
            return null;
        }
    }
    _closeModal = () => {
        this.props.close();
    }
    _renderNotifications = () => {
        let notifications = this.props.notifications[this.props.event.id];
        return (
            notifications ? 
            _.map(notifications, notification => {
                return (
                    <TouchableOpacity key={notification.id} onPress={this._removeNotification.bind(this, notification)}>
                        <View style={styles.notification}>
                            <MyText style={styles.time}>
                            {notification.label}
                            </MyText>
                            <Image
                                source={require('../../assets/images/add_friend.png')}
                                style={[styles.add, {transform: [{rotate: '45deg'}]}]}
                            />
                        </View>
                    </TouchableOpacity>
                );
            }) : null
        );
    }
    _renderOptions = () => {
        return (
            this.notifications.map(notification => {
                return (
                    <TouchableOpacity key={notification.id} onPress={this._addNotification.bind(this, notification)}>
                        <View style={styles.notification}>
                            <MyText style={styles.time}>
                            {notification.label}
                            </MyText>
                            <Image
                                source={require('../../assets/images/add_friend.png')}
                                style={styles.add}
                            />
                        </View>
                    </TouchableOpacity>
                );
            })
        );
    }
    _addNotification = (val) => {
        this.props.dispatch(Actions.addNotification(val, this.props.event));
    }
    _removeNotification = (val) => {
        this.props.dispatch(Actions.removeNotification(val, this.props.event));
    }
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: "#fff",
        height,
        width,
        paddingTop: 20,
    },
    label: {
        marginTop: 15,
        marginLeft: 15,
        fontSize: 18,
        color: "#6a7989",
    },
    time: {
        fontSize: 16,
        marginLeft: 15,
    },
    add: {
        height: 30,
        width: 30,
        margin: 18,
    },
    notification: {
      height: 50,
      flexDirection: 'row',  
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#b9c1ca',
        paddingBottom: 10,
    },
    hlightSave: {
        alignSelf: "center",
    },
    bottom: {
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        bottom: 0,
        height: height * 0.1,
        width,
        flexDirection: "row",
        justifyContent: "space-around",
        zIndex: 2,
    },
    btnDone: {
        width: 115,
    },
});
