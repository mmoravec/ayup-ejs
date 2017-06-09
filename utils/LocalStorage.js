import { AsyncStorage } from "react-native";

const Keys = {
  Phone: "AyupPhone",
  Filters: "AyupFilters",
  Credentials: "AyupCredentials",
};

async function getCredentialAsync() {
  let results = await AsyncStorage.getItem(Keys.Credentials);
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

async function getFiltersAsync() {
  let results = await AsyncStorage.getItem(Keys.Filters);

  try {
    return JSON.parse(results);
  } catch (e) {
    return null;
  }
}

function saveCredentialAsync(credentials) {
  return AsyncStorage.setItem(Keys.Credentials, JSON.stringify(credentials));
}

function savePhoneStateAsync(phone) {
  return AsyncStorage.setItem(Keys.Phone, JSON.stringify(phone));
}

function saveFiltersAsync(filters) {
  return AsyncStorage.setItem(Keys.Filters, JSON.stringify(filters));
}

function clearAllAsync() {
  return AsyncStorage.clear();
}

function clearCredentials() {
  return AsyncStorage.removeItem(Keys.Credentials);
}

export default {
  getPhoneStateAsync,
  savePhoneStateAsync,
  clearAllAsync,
  saveFiltersAsync,
  getFiltersAsync,
  getCredentialAsync,
  saveCredentialAsync,
  clearCredentials,
};
