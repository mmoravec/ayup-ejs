import { combineReducers, applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createNavigationEnabledStore, NavigationReducer } from '@expo/ex-navigation';
import EventsReducer from './EventsReducer';
import UserReducer from './UserReducer';
import PhoneStateReducer from './PhoneStateReducer';
import sagas from '../sagas';
import routeTracker from '../navigation/routeTracker';

  const sagaMiddleware = createSagaMiddleware();

  //ex-navigation requires use of this function to create the store
  const createStoreWithNavigation = createNavigationEnabledStore({
    createStore,
    navigationStateKey: 'navigation',
  });

  const store = createStoreWithNavigation(
    //combine all reducers here
    combineReducers({
      navigation: NavigationReducer,
      events: EventsReducer,
      user: UserReducer,
      startup: PhoneStateReducer,
    }),
    applyMiddleware(sagaMiddleware, routeTracker)
  );

  sagaMiddleware.run(sagas);

  export default store;
