import { Record } from 'immutable';

export const User = Record({
  id: null,
  authToken: null,
  name: null,
  isGuest: null,
});
