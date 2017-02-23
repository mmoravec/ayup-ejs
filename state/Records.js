import { List, Record, Map } from 'immutable';

export const EventState = Record({
  nearbyEvents: new List(),
  filters: new List(),
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

export const Filter = Record({
  id: null,
  title: null,
  image: null,
  selected: true,
});

export const Startup = Record({
  userLoaded: false,
  fontLoaded: false,
  filtersLoaded: false,
  regionLoaded: false,
});
