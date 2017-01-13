import { List, Record } from 'immutable';

export const EventState = Record({
  event: '',
});

export const User = Record({
  id: null,
  authToken: null,
  name: null,
  isGuest: null,
});
