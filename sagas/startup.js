import { put, call } from 'redux-saga/effects';
import ActionTypes from '../state/ActionTypes';

export default function* startup() {
  yield call(loadFilters);
  yield call(setInitialRegion);
}

function* loadFilters() {
  let filters =
  [
    {
      "id": 0,
      "title": "basketball",
      "image": require("../assets/images/filters/basketball.png"),
    },
    {
      "id": 1,
      "title": "badminton",
      "image": require("../assets/images/filters/badminton.png"),
    },
    {
      "id": 2,
      "title": "baseball",
      "image": require("../assets/images/filters/baseball.png"),
    },
    {
      "id": 3,
      "title": "bicycle",
      "image": require("../assets/images/filters/bicycle.png"),
    },
    {
      "id": 4,
      "title": "boxing",
      "image": require("../assets/images/filters/boxing.png"),
    },
    {
      "id": 5,
      "title": "climbing",
      "image": require("../assets/images/filters/climbing.png"),
    },
    {
      "id": 6,
      "title": "dancing",
      "image": require("../assets/images/filters/dancing.png"),
    },
    {
      "id": 7,
      "title": "football",
      "image": require("../assets/images/filters/football.png"),
    },
    {
      "id": 8,
      "title": "golf",
      "image": require("../assets/images/filters/golf.png"),
    },
    {
      "id": 9,
      "title": "hiking",
      "image": require("../assets/images/filters/hiking.png"),
    },
    {
      "id": 10,
      "title": "hockey",
      "image": require("../assets/images/filters/hockey.png"),
    },
    {
      "id": 11,
      "title": "kickball",
      "image": require("../assets/images/filters/kickball.png"),
    },
    {
      "id": 12,
      "title": "pingpong",
      "image": require("../assets/images/filters/pingpong.png"),
    },
    {
      "id": 13,
      "title": "running",
      "image": require("../assets/images/filters/running.png"),
    },
    {
      "id": 14,
      "title": "soccer",
      "image": require("../assets/images/filters/soccer.png"),
    },
    {
      "id": 15,
      "title": "softball",
      "image": require("../assets/images/filters/softball.png"),
    },
    {
      "id": 16,
      "title": "tennis",
      "image": require("../assets/images/filters/tennis.png"),
    },
    {
      "id": 17,
      "title": "volleyball",
      "image": require("../assets/images/filters/volleyball.png"),
    },
  ];
  yield put({ type: ActionTypes.SET_FILTERS, filters });
}

function* setInitialRegion() {
  let region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  yield put({ type: ActionTypes.SET_REGION, region });
}
