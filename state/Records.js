import { List, Record, Map } from 'immutable';

export const EventState = Record({
  nearbyEvents: new List(),
  filters: new List(),
  filter: {
    startTime: null,
    endTime: null,
  },
  region: {
    latitude: null,
    longitude: null,
    latitudeDelta: null,
    longitudeDelta: null,
  },
  selectedEvent: null,
});

export const User = Record({
  fbid: null,
  id: null,
  authToken: null,
  name: null,
  profilePic: null,
  friends: null,
  email: null,
  gender: null,
  new: null,
  expires: null,
  playedWith: null,
  invited: new List(),
  rejected: null,
  joined: new List(),
  hosted: new List(),
  requested: new List(),
  completed: new List(),
  about: null,
  badges: null,
  activities: null,
  secret: null,
});

export const PhoneState = Record({
  userLoaded: false,
  fontLoaded: false,
  filtersLoaded: false,
  regionLoaded: false,
  imagesLoaded: false,
  status: '',
});

export const Comment = Record({
  id: null,
  eventid: null,
  parentid: null,
  slug: null,
  fullslug: null,
  posted: null,
  modified: null,
  author: null,
  content: '',
});
