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
  selectedComments: new List(),
});

export const User = Record({
  fbid: null,
  id: null,
  authToken: null,
  name: null,
  profilePic: null,
  friends: new List(),
  email: null,
  gender: null,
  new: null,
  expires: null,
  invited: new List(),
  rejected: new List(),
  joined: new List(),
  hosted: new List(),
  requested: new List(),
  completed: new List(),
  events: new List(),
  about: null,
  badges: new List(),
  activities: new List(),
  secret: null,
});

export const PhoneState = Record({
  userLoaded: false,
  fontLoaded: false,
  filtersLoaded: false,
  imagesLoaded: false,
  status: '',
  optly: null,
  optlyVariation: '',
  locationGranted: false,
  contactsGranted: false,
  notificationGranted: false,
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

export const FormState = Record({
  startDate: {
    focus: false,
    shown: true,
    value: '',
    label: 'Start Date',
    stateKey: 'startDate',
  },
  endDate: {
    focus: false,
    shown: true,
    value: '',
    label: 'End Date',
    stateKey: 'endDate',
  },
  title: {
    label: 'Title',
    focus: false,
    shown: true,
    value: '',
    stateKey: 'title',
  },
  desc: {
    label: 'Description',
    focus: false,
    shown: false,
    value: '',
    stateKey: 'desc',
  },
  location: {
    focus: false,
    label: 'Meeting Location',
    shown: true,
    value: '',
    lnglat: [],
    stateKey: 'location',
  },
  dest: {
    focus: false,
    shown: false,
    label: 'Destination',
    value: '',
    lnglat: [],
    stateKey: 'dest',
  },
  friends: {
    focus: false,
    shown: true,
    value: [],
    stateKey: 'friends',
    label: 'Friends',
  },
  activity: {
    focus: false,
    shown: true,
    value: 'basketball',
    stateKey: 'activity',
  },
  private: {
    focus: false,
    shown: true,
    value: false,
    stateKey: 'private',
  },
  capacity: {
    focus: false,
    shown: false,
    value: 0,
    stateKey: 'capacity',
  },
});
