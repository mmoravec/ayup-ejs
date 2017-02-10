import { List, Record } from 'immutable';

export const EventState = Record({
  nearbyEvents: new List(),
  filters: new List(),
  region: {
    latitude: null,
    longitude: null,
    latitudeDelta: null,
    longitudeDelta: null,
  },
});

export const User = Record({
  id: null,
  authToken: null,
  name: null,
  isGuest: null,
});
