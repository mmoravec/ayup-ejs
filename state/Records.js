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
  id: null,
  authToken: null,
  name: null,
  profilePic: null,
  email: null,
  gender: null,
  new: null,
  playedWith: null,
  invited: null,
  rejected: null,
  joined: null,
  hosted: null,
  completed: null,
  about: null,
  badges: null,
  activities: null,
});

export const Startup = Record({
  userLoaded: false,
  fontLoaded: false,
  filtersLoaded: false,
  regionLoaded: false,
  imagesLoaded: false,
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
