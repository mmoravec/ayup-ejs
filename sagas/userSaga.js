import {call, put, take} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {Platform} from 'react-native';
import { List } from 'immutable';
import ActionTypes from '../state/ActionTypes';
import {User} from '../state/Records';
import Fetch from '../utils/fetch';

export function* refreshUserFriends() {
    const action = yield take(ActionTypes.SET_CURRENT_USER);
    let friends = yield call(Fetch.getData, "https://graph.facebook.com/v2.8/me/friends", {}, {
        fields: "name,id,picture.width(120).height(120)",
        access_token: action.user.authToken,
    });
    yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.data)});
    while (true) {
        yield call(delay, 30000);
        let newFriends = yield call(Fetch.getData, "https://graph.facebook.com/v2.8/me/friends", {}, {
            fields: "name,id,picture.width(120).height(120)",
            access_token: action.user.authToken,
        });
        if (newFriends.data.length !== friends.data.length) {
            friends = newFriends;
            yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.data)});
        }
    }
}
