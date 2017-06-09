import { combineReducers, applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import EventsReducer from "./EventsReducer";
import FormReducer from "./FormReducer";
import PhoneStateReducer from "./PhoneStateReducer";
import CredentialReducer from "./CredentialReducer";
import ProfileReducer from "./ProfileReducer";
import AccountReducer from "./AccountReducer";
import sagas from "../sagas";
import routeTracker from "../navigation/routeTracker";
import Navigator from "../navigation/Navigator";

const sagaMiddleware = createSagaMiddleware();

const navReducer = (state, action) => {
  const newState = Navigator.router.getStateForAction(action, state);
  return newState || state;
};

const store = createStore(
  //combine all reducers here
  combineReducers({
    navigation: navReducer,
    events: EventsReducer,
    phone: PhoneStateReducer,
    form: FormReducer,
    credential: CredentialReducer,
    account: AccountReducer,
    profile: ProfileReducer,
  }),
  applyMiddleware(sagaMiddleware, routeTracker)
);

sagaMiddleware.run(sagas);

export default store;
