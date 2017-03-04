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
  email: null,
  gender: null,
  new: null,
});

export const Startup = Record({
  userLoaded: false,
  fontLoaded: false,
  filtersLoaded: false,
  regionLoaded: false,
  imagesLoaded: false,
});
