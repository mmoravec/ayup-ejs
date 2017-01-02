import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createLogger from 'redux-logger';
import reducer from './reducers';
import sagas from './sagas';

export default function configureStore(onComplete) {
  const loggerMiddleware = createLogger({
    stateTransformer: state => state.toJS(),
  });

  const sagaMiddleware = createSagaMiddleware();

  let store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(sagas);
  return store;
}
