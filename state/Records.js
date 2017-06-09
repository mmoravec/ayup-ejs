import { List, Record, Map } from "immutable";
import ActionTypes from "./ActionTypes";

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

export const Profile = Record({
  id: null,
  name: null,
  profile_pic: null,
  phone: null,
  friends: new List(),
  invited: new List(),
  rejected: new List(),
  going: new List(),
  hosted: new List(),
  completed: new List(),
  requested: new List(),
  deleted: new List(),
  not_going: new List(),
  about: null,
  badges: new List(),
  activities: new List(),
  email: null,
  gender: null,
  exponent_token: null,
});

export const Credential = Record({
  access_token: null,
  expires_in: null,
  secret: null,
  user_id: null,
});

export const Account = Record({
  id: null,
  ayup_id: null,
  email: null,
  gender: null,
  phone: null,
  fbid: null,
  address: null,
  last_location: null,
  last_login: null,
});

export const PhoneState = Record({
  credLoaded: false,
  fontLoaded: false,
  filtersLoaded: false,
  imagesLoaded: false,
  status: ActionTypes.INACTIVE,
  statusMessage: "",
  optly: null,
  optlyVariation: "",
  locationGranted: false,
  contactsGranted: false,
  notificationsGranted: false,
  notification: {},
  contacts: {},
  fbFriends: {},
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
  content: "",
});

export const FormState = Record({
  startDate: {
    focus: false,
    shown: true,
    value: "",
    label: "Start Date",
    stateKey: "startDate",
  },
  endDate: {
    focus: false,
    shown: true,
    value: "",
    label: "End Date",
    stateKey: "endDate",
  },
  title: {
    label: "Title",
    focus: false,
    shown: true,
    value: "",
    stateKey: "title",
  },
  desc: {
    label: "Description",
    focus: false,
    shown: false,
    value: "",
    stateKey: "desc",
  },
  location: {
    focus: false,
    label: "Meeting Location",
    shown: true,
    value: "",
    lnglat: [],
    stateKey: "location",
  },
  dest: {
    focus: false,
    shown: false,
    label: "Destination",
    value: "",
    lnglat: [],
    stateKey: "dest",
  },
  friends: {
    focus: false,
    shown: true,
    value: new List(),
    stateKey: "friends",
    label: "Friends",
  },
  activity: {
    focus: false,
    shown: true,
    value: "basketball",
    stateKey: "activity",
  },
  private: {
    focus: false,
    shown: true,
    value: false,
    stateKey: "private",
  },
  capacity: {
    focus: false,
    shown: false,
    value: 0,
    stateKey: "capacity",
  },
});
