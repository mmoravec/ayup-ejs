import { AsyncStorage } from "react-native";

const Keys = {
  Phone: "LayupPhone",
  Filters: "LayupFilters",
  Credentials: "LayupCredentials",
};

async function getUserAsync() {
  let results = await AsyncStorage.getItem(Keys.User);

  try {
    return JSON.parse(results);
  } catch (e) {
    return null;
  }
}

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
  console.log(credentials);
  return AsyncStorage.setItem(Keys.Credentials, JSON.stringify(credentials));
}

function savePhoneStateAsync(phone) {
  return AsyncStorage.setItem(Keys.Phone, JSON.stringify(phone));
}

function saveFiltersAsync(filters) {
  console.log("save filters async");
  return AsyncStorage.setItem(Keys.Filters, JSON.stringify(filters));
}

function clearAllAsync() {
  return AsyncStorage.clear();
}

export default {
  getUserAsync,
  getPhoneStateAsync,
  savePhoneStateAsync,
  clearAllAsync,
  saveFiltersAsync,
  getFiltersAsync,
  getCredentialAsync,
  saveCredentialAsync,
};
