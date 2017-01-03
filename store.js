import { combineReducers, applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createLogger from 'redux-logger';
import { createNavigationEnabledStore, NavigationReducer } from '@exponent/ex-navigation';
import reducer from './reducers';
import sagas from './sagas';

  const loggerMiddleware = createLogger({
    stateTransformer: state => state.toJS(),
  });

  const sagaMiddleware = createSagaMiddleware();

  const createStoreWithNavigation = createNavigationEnabledStore({
    createStore,
    navigationStateKey: 'navigation',
  });

  const store = createStoreWithNavigation(
    combineReducers({
      navigation: NavigationReducer,
      reducer,
    }),
    applyMiddleware(sagaMiddleware)
  );
  
  sagaMiddleware.run(sagas);

  export default store;
