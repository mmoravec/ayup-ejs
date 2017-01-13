import SegmentIO from 'react-native-segment-io-analytics';

const navigationStateKey = 'navigation';

// gets the current screen from navigation state
function getCurrentScreen(getStateFn) {
  const navigationState = getStateFn()[navigationStateKey];
  // navigationState can be null when exnav is initializing
  if (!navigationState) return null;

  const { currentNavigatorUID, navigators } = navigationState;
  if (!currentNavigatorUID) return null;

  const { index, routes } = navigators[currentNavigatorUID];
  const { routeName } = routes[index];
  return routeName;
}

const screenTracking = ({ getState }) => next => action => {
  if (!action.type.startsWith('EX_NAVIGATION')) return next(action);
  const currentScreen = getCurrentScreen(getState);
  const result = next(action);
  const nextScreen = getCurrentScreen(getState);
  if (nextScreen !== currentScreen) {
//    SegmentIO.screen(nextScreen);
//TODO Install segmentIO
  }
  return result;
};

export default screenTracking;
