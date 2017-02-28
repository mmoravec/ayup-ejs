import {
    put,
    call,
} from 'redux-saga/effects';
import {
    List,
} from 'immutable';
import { Font } from 'exponent';
import ActionTypes from '../state/ActionTypes';
import LocalStorage from '../state/LocalStorage';
import {
    User,
    Filter,
} from '../state/Records';
import filters from '../constants/filters';

//TODO: Add caching scheme for fonts and images from crash example
export default function* startup() {
    yield [
        call(setInitialRegion),
        call(getUser),
        call(loadFilters),
        call(loadFonts),
    ];
}

function* loadFonts() {
  yield call(getFonts);
  yield put({
      type: ActionTypes.FONT_LOADED,
  });
}

function* loadFilters() {
    let filterList = new List(filters.map(filter => {
        return filter.id;
    }));
    yield put({
        type: ActionTypes.SET_FILTERS,
        filterList,
    });
    yield put({
        type: ActionTypes.FILTERS_LOADED,
    });
}

function* getUser() {
    let user = yield call(LocalStorage.getUserAsync);
    if (user === null || !user.id) {
        user = {
            'new': true,
        };
    }
    user = new User(user);
    yield put({
        type: ActionTypes.SET_CURRENT_USER,
        user,
    });
    yield put({
        type: ActionTypes.USER_LOADED,
    });
}

function* setInitialRegion() {
    let region = {
        latitude: 37.78825,
        longitude: -122.4324,
    };
    yield put({
        type: ActionTypes.SET_REGION,
        region,
    });
    yield put({
        type: ActionTypes.REGION_LOADED,
    });
}

async function getFonts() {
 Font.loadAsync({ 'LatoRegular': require('../assets/fonts/Lato-Regular.ttf')});
}
