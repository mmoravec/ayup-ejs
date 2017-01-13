import { List, Record } from 'immutable';

export const EventState = Record({
  inView: new List(),
  createdEvents: new List(),
});
