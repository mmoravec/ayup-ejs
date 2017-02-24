import all from '../constants/filters';

export default class Filters {
  static getSelectedActivitiesObject(ids) {
    let activities = {};
    all.map(fil => {
      if (ids.indexOf(fil.id) > -1) {
        activities[fil.title] = fil;
      }
    });
    return activities;
  }

  static getSelectedActivitiesArray(ids) {
    return all.map(fil => {
      if (ids.indexOf(fil.id) > -1) {
        return fil;
      }
    });
  }

  static filtersFromIds(ids) {
    return all.map(fil => {
      if (ids.indexOf(fil.id) > -1) {
        fil['selected'] = true;
        return fil;
      } else {
        fil['selected'] = false;
        return fil;
      }
    });
  }
}
