import { combineReducers, applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import EventsReducer from './EventsReducer';
import UserReducer from './UserReducer';
import sagas from '../sagas';

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    //combine all reducers here
    combineReducers({
      events: EventsReducer,
      user: UserReducer,
    }),
    applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(sagas);

  export default store;
