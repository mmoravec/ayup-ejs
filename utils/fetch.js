
export default class Fetch {
  static async getData(url, headers, params) {
    if (Object.keys(params).length > 0) {
      let pString = "?";
      for (var key in params) {
        pString += key;
        pString += "=";
        pString += params[key];
        pString += '&';
      }
      url += pString;
    }
    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return error;
    }
  }
}
