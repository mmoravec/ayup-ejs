import { List, Record } from 'immutable';

export const EventState = Record({
  nearbyEvents: new List(),
});

export const User = Record({
  id: null,
  authToken: null,
  name: null,
  isGuest: null,
});
