import { AsyncStorage } from 'react-native';

const Keys = {
  User: 'AyupUser',
  Phone: 'AyupPhone',
};

async function getUserAsync() {
  let results = await AsyncStorage.getItem(Keys.User);

  try {
    return JSON.parse(results);
  } catch (e) {
    return null;
  }
}

async function getPhoneStateAsync() {
  let results = await AsyncStorage.getItem(Keys.Phone);

  try {
    return JSON.parse(results);
  } catch (e) {
    return null;
  }
}

function savePhoneStateAsync(phone) {
  return AsyncStorage.setItem(Keys.Phone, JSON.stringify(phone));
}


function saveUserAsync(user) {
  return AsyncStorage.setItem(Keys.User, JSON.stringify(user));
}

function removeUserAsync() {
  return AsyncStorage.removeItem(Keys.User);
}

function clearAllAsync() {
  return AsyncStorage.clear();
}

export default {
  saveUserAsync,
  getUserAsync,
  getPhoneStateAsync,
  savePhoneStateAsync,
  removeUserAsync,
  clearAllAsync,
};
