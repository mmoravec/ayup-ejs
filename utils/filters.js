export default class Filters {
  static getSelectedActivitiesObject(filters) {
    let activities = {};
    filters.map(filter => {
      if (filter.selected) {
        activities[filter.title] = filter;
      }
    });
    return activities;
  }

  static getSelectedActivitiesArray(filters) {
    let activities = [];
    filters.map(filter => {
      if (filter.selected) {
        activities.push(filter);
      }
    });
    return activities;
  }
}
