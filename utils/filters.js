import all from '../constants/activities';

export default class Filters {

  static sortComments(comments) {
    let unsorted = [];
    comments = comments.sort(function(a, b) {
      return b.posted - a.posted;
    });
    comments = comments.filter(comment => {
      if (comment.get('parentid') === null) {
        return comment;
      } else {
        unsorted.splice(0, 0, comment);
      }
    });
    if (unsorted.length > 0) {
      unsorted.map(unsort => {
        var result = comments.findIndex(function(obj) { return obj.get('id') === unsort.parentid; });
        comments = comments.splice(result + 1, 0, unsort);
      });
    }
    return comments;
  }
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
    return all.filter(fil => {
      if (ids.indexOf(fil.id) > -1) {
        return fil;
      }
    });
  }

  static filterEvents(events, filters) {
    return events;
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
