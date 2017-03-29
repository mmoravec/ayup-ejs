import {call, put, take} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import { List } from 'immutable';
import ActionTypes from '../state/ActionTypes';
import { GET } from '../constants/rest';
import { request } from '../utils/fetch';

export function* refreshUserFriends() {
    const action = yield take(ActionTypes.SET_CURRENT_USER);
    let friends = yield call(request, GET,
      "https://graph.facebook.com/v2.8/me/friends/" +
      "?fields=name,id,picture.width(120).height(120)&" +
      "access_token=" + action.user.authToken,
    );
    yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.data)});
    while (true) {
        yield call(delay, 30000);
        let newFriends = yield call(request, GET,
          "https://graph.facebook.com/v2.8/me/friends/" +
          "?fields=name,id,picture.width(120).height(120)&access_token=" + action.user.authToken,
        );
        if (newFriends.data.length !== friends.data.length) {
            friends = newFriends;
            yield put({type: ActionTypes.SET_FRIENDS, friends: new List(friends.data)});
        }
    }
}
