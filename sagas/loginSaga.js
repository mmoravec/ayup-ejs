import { NavigationActions } from '@exponent/ex-navigation'
import { takeEvery } from 'redux-saga'
import { fork, call, take, put } from 'redux-saga/effects'
import ActionTypes from '../state/ActionTypes'
import Store from '../state/Store';
import Router from '../navigation/router'
// import Api from '...'

//TODO: hookup actual fetch calls
// function* authorize(user, password) {
//   try {
//     // const token = yield call(Api.authorize, user, password)
//     // yield put({type: 'LOGIN_SUCCESS', token})
//     // yield call(Api.storeItem, {token})
//   } catch(error) {
//     yield put({type: 'LOGIN_ERROR', error})
//   }
// }

function* authorize() {
  let navigatorUID = Store.getState().navigation.currentNavigatorUID;
  Store.dispatch(NavigationActions.push(navigatorUID, Router.getRoute('home')));
}

//TODO: change this flow to more closely match exponents
// function* loginFlow() {
//   while (true) {
//     const {user, password} = yield take('LOGIN_REQUEST')
//     // fork return a Task object
//     const task = yield fork(authorize, user, password)
//     const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
//     // if (action.type === 'LOGOUT')
//       // yield cancel(task)
//     // yield call(Api.clearItem, 'token')
//   }
// }

export function* watchLogin() {
  yield takeEvery(ActionTypes.SIGN_IN, authorize);
}
