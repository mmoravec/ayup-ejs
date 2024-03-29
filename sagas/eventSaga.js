import _ from "lodash";
import { List } from "immutable";
import { delay } from "redux-saga";
import { takeLatest, select, call, put, fork } from "redux-saga/effects";
import ActionTypes from "../state/ActionTypes";
import { Event, Form } from "../state/Records";
import { request } from "../utils/fetch";
import { URL, POST, GET, DELETE, PUT } from "../constants/rest";
import Filters from "../utils/filters";
//http://restbus.info/api/locations/37.784825,-122.395592/predictions
//use this endpoint for bus info in SF

export function* watchEventAction() {
  yield [
    takeLatest(ActionTypes.SAVE_EVENT, saveEvent),
    takeLatest(ActionTypes.LOAD_EVENT, loadEvent),
    takeLatest(ActionTypes.REGION_CHANGE, updateNearbyEvents),
    takeLatest(ActionTypes.ACCEPT_EVENT, acceptEvent),
    takeLatest(ActionTypes.REQUEST_EVENT, requestEvent),
    takeLatest(ActionTypes.DELETE_EVENT, deleteEvent),
    takeLatest(ActionTypes.REJECT_EVENT, rejectEvent),
    takeLatest(ActionTypes.LOAD_COMMENTS, loadComments),
    takeLatest(ActionTypes.SAVE_COMMENT, saveComment),
    takeLatest(ActionTypes.ACCEPT_REQUEST, acceptRequest),
    takeLatest(ActionTypes.REJECT_REQUEST, rejectRequest),
    takeLatest(ActionTypes.MODIFY_EVENT, modifyEvent),
    takeLatest(ActionTypes.UPDATE_EVENT, updateEvent),
    takeLatest(ActionTypes.INVITE_USER, inviteUser),
    takeLatest(ActionTypes.COPY_EVENT, copyEvent),
    takeLatest(
      [ActionTypes.REMOVE_ACTIVITY, ActionTypes.ADD_ACTIVITY],
      filterEvents
    ),
  ];
}

function* saveEvent(action) {
  let event;
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    event = yield call(request, POST, URL + "/v1.0/events", action.event);
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR, error });
    return;
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield put({
    type: ActionTypes.UPDATE_REGION,
    longitude: action.event.location.coordinates[0],
    latitude: action.event.location.coordinates[1],
  });
  let notification = {
    id: 0,
    label: "15 Minutes Before Start",
    value: new Date(action.event.start_time).getTime() - 15 * (60 * 1000),
    title: "15 minutes",
  };
  yield put({
    type: ActionTypes.ADD_NOTIFICATION,
    notification,
    event: event.body,
  });
  yield call(delay, 1000);
  yield put({ type: ActionTypes.ZERO_FORM });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Back" });
}

function* filterEvents(action) {
  const eventState = yield select(state => state.events);
  let activities = Filters.filterEvents(
    eventState.allEvents,
    eventState.filters
  );
  let filter = pushEvents(activities);
  yield put({ type: ActionTypes.SET_NEARBY, data: filter.events });
  if (filter.venues) {
    yield put({ type: ActionTypes.SET_VENUES, data: filter.venues });
  }
}

function* updateEvent(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(
      request,
      PUT,
      URL + "/v1.0/events/" + action.eventID,
      action.event
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR, error });
    return;
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield put({ type: ActionTypes.ZERO_FORM });
  yield put({ type: ActionTypes.LOAD_EVENT, eventID: action.eventID });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Back" });
}

function* updateNearbyEvents(action) {
  //TODO: call to rest api here
  const profile = yield select(state => state.profile);
  const eventState = yield select(state => state.events);
  if (!profile.age_group) {
    return;
  }
  let region = {
    latitude: action.latitude,
    longitude: action.longitude,
    latitudeDelta: action.latitudeDelta ? action.latitudeDelta : 0.086552,
    longitudeDelta: action.longitudeDelta ? action.longitudeDelta : 0.061562,
  };
  let scope = Math.floor(region.latitudeDelta * 53000), events;
  try {
    events = yield call(
      request,
      GET,
      URL +
        "/v1.0/events/search/" +
        profile.age_group +
        "?lat=" +
        region.latitude +
        "&long=" +
        region.longitude +
        "&scope=" +
        scope
    );
  } catch (error) {
    return;
  }
  if (events.body) {
    let all = events.body;
    yield put({ type: ActionTypes.SET_UNFILTERED_EVENTS, data: all });
    let activities = Filters.filterEvents(all, eventState.filters);
    yield put({ type: ActionTypes.SET_ALLEVENTS, data: activities });
    let filter = pushEvents(activities);
    yield put({ type: ActionTypes.SET_NEARBY, data: filter.events });
    if (filter.venues) {
      yield put({ type: ActionTypes.SET_VENUES, data: filter.venues });
    }
  } else {
    yield put({ type: ActionTypes.SET_ALLEVENTS, data: null });
    yield put({ type: ActionTypes.SET_NEARBY, data: null });
    yield put({ type: ActionTypes.SET_UNFILTERED_EVENTS, data: null });
  }
}

function* acceptEvent(action) {
  const eventState = yield select(state => state.events.selectedEvent);
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(
      request,
      POST,
      URL + "/v1.0/events/" + action.eventID + "/accept"
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
    return;
  }
  let notification = {
    id: 0,
    label: "15 Minutes Before Start",
    value: new Date(eventState.start_time).getTime() - 15 * (60 * 1000),
    title: "15 minutes",
  };
  yield put({
    type: ActionTypes.ADD_NOTIFICATION,
    notification,
    event: eventState,
  });
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield put({ type: ActionTypes.GET_PROFILE });
  yield fork(loadEvent, action);
}

function* acceptRequest(action) {
  const eventState = yield select(state => state.events.selectedEvent);
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(
      request,
      POST,
      URL + "/v1.0/events/" + action.eventID + "/accept?userid=" + action.userID
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
    return;
  }
  let notification = {
    id: 0,
    label: "15 Minutes Before Start",
    value: new Date(eventState.start_time).getTime() - 15 * (60 * 1000),
    title: "15 minutes",
  };
  yield put({
    type: ActionTypes.ADD_NOTIFICATION,
    notification,
    event: eventState,
  });
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield put({ type: ActionTypes.GET_PROFILE });
  yield fork(loadEvent, action);
}

function* rejectRequest(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(
      request,
      POST,
      URL + "/v1.0/events/" + action.eventID + "/reject?userid=" + action.userID
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
    return;
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield put({ type: ActionTypes.GET_PROFILE });
  yield fork(loadEvent, action);
}

function* requestEvent(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(
      request,
      POST,
      URL + "/v1.0/events/" + action.eventID + "/request"
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield fork(loadEvent, action);
}

function* deleteEvent(action) {
  const region = yield select(state => state.events.region);
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(request, DELETE, URL + "/v1.0/events/" + action.eventID);
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield call(delay, 2000);
  yield fork(updateNearbyEvents, region);
  yield put({
    type: ActionTypes.CANCEL_EVENT_NOTIFICATIONS,
    eventID: action.eventID,
  });
  yield put({ type: ActionTypes.ZERO_SELECTED_COMMENT });
  yield put({ type: ActionTypes.ZERO_SELECTED_EVENT });
  yield put({ type: ActionTypes.GET_PROFILE });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "Back" });
}

function* rejectEvent(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(
      request,
      POST,
      URL + "/v1.0/events/" + action.eventID + "/reject"
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
  }
  yield put({
    type: ActionTypes.CANCEL_EVENT_NOTIFICATIONS,
    eventID: action.eventID,
  });
  yield put({ type: ActionTypes.ALERT_SUCCESS });
  yield put({ type: ActionTypes.GET_PROFILE });
  yield fork(loadEvent, action);
}

function* inviteUser(action) {
  yield put({ type: ActionTypes.ALERT_SAVING });
  try {
    yield call(
      request,
      POST,
      URL + "/v1.0/events/" + action.eventID + "/invite?userid=" + action.userID
    );
  } catch (error) {
    yield put({ type: ActionTypes.ALERT_ERROR });
    return;
  }
  yield put({ type: ActionTypes.ALERT_SUCCESS, message: "Invites Sent!" });
  yield fork(loadEvent, action);
}

function* loadComments(action) {
  let data;
  try {
    data = yield call(
      request,
      GET,
      URL + "/v1.0/comments?eventid=" + action.eventID
    );
  } catch (error) {
    yield call(delay, 5000);
    yield fork(loadComments, action);
    return;
  }
  yield put({ type: ActionTypes.SET_COMMENTS, comments: new List(data.body) });
}

function* saveComment(action) {
  const profile = yield select(state => state.profile);
  let comment = {
    content: action.comment,
    parent_id: action.parentID ? action.parentID : null,
    author: {
      id: profile.id,
      profile_pic: profile.profile_pic,
      name: profile.name,
    },
    event_id: action.eventID,
  };
  try {
    yield call(request, POST, URL + "/v1.0/comments", comment);
  } catch (error) {
    yield call(delay, 5000);
    yield fork(saveComment, action);
    return;
  }
  yield call(loadComments, action);
}

function* loadEvent(action) {
  let data;
  try {
    data = yield call(request, GET, URL + "/v1.0/events/" + action.eventID);
  } catch (error) {
    yield call(delay, 5000);
    yield fork(loadEvent, action);
    return;
  }
  let body = data.body;
  body.completed = new Date(data.body.end_time) < new Date();
  body.invited = data.body.invited.filter(friend => {
    return friend.profile_pic;
  });
  if (body.capacity > 0 && body.capacity <= body.going.length) {
    body.atCapacity = true;
  }

  yield put({
    type: ActionTypes.SET_SELECTED_EVENT,
    selectedEvent: new Event({ ...data.body }),
  });
}

function* modifyEvent(action) {
  const event = yield select(state => state.events);

  let form = Form.toJS();
  form = transformEvent(event, form);
  form.friends.shown = false;
  form.status = "update";
  yield put({ type: ActionTypes.SET_FORM, form });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "NewEvent" });
}

function* copyEvent(action) {
  const event = yield select(state => state.events.selectedEvent);
  let form = Form.toJS();
  form = transformEvent(event, form);
  form.friends.value = new List(
    _.map(
      event.going.concat(event.invited, event.requested, event.not_going),
      event => {
        return {
          item: {
            ayup_id: event.id,
            ...event,
          },
          key: event.id,
        };
      }
    )
  );
  form.friends.shown = true;
  form.status = "create";
  yield put({ type: ActionTypes.SET_FORM, form });
  yield put({ type: ActionTypes.ROUTE_CHANGE, newRoute: "NewEvent" });
}

function transformEvent(event, form) {
  event.forEach((val, key) => {
    switch (key) {
      case "start_time":
        form["startDate"].value = new Date(val);
        break;
      case "end_time":
        form["endDate"].value = new Date(val);
        break;
      case "destination":
        form["dest"].value = val.text;
        form["dest"].lnglat = val.coordinates;
        if (val.text !== "") {
          form["dest"].shown = true;
        }
        break;
      case "description":
        form["desc"].value = val;
        if (val !== "") {
          form["desc"].shown = true;
        }
        break;
      case "location":
        form["location"].value = val.text;
        form["location"].lnglat = val.coordinates;
        break;
      case "title":
        form["title"].value = val;
        break;
      case "activity":
        form["activity"].value = val;
        break;
      case "private":
        form["private"].value = val;
        break;
      case "auto_accept":
        form["request"].value = val;
        if (val === true) {
          form["request"].shown = true;
        }
        break;
      case "capacity":
        form["capacity"].value = val;
        if (val !== 0) {
          form["capacity"].shown = true;
        }
    }
  });
  return form;
}

function pushEvents(events) {
  let map = {};
  let filtered = [], venues = [];
  events.map(event => {
    let long = event.location.coordinates[0];
    let lat = event.location.coordinates[1];
    let latlong = lat.toString() + long.toString();
    if (!map[latlong]) {
      map[latlong] = event;
    } else if (Array.isArray(map[latlong])) {
      map[latlong].push(event);
    } else {
      let temp = map[latlong];
      map[latlong] = [temp];
    }
    return event;
  });
  _.mapValues(map, o => {
    if (Array.isArray(o)) {
      let venue = {
        location: o[0].location,
        text: o[0].location.text,
        events: new List(o),
        activity: o[0].activity,
        id: o[0].id,
        private: false,
      };
      venues.push(venue);
    } else {
      filtered.push(o);
    }
  });
  return { events: filtered, venues };
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
