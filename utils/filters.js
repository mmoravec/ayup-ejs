import { List } from "immutable";
import dateFormat from "dateformat";
import all from "../constants/activities";

export default class Filters {
  static sortComments(comments) {
    let unsorted = [];
    comments = comments.sort(function(a, b) {
      return new Date(b.posted_on) - new Date(a.posted_on);
    });
    comments = comments.filter(comment => {
      if (comment.parent_id === "") {
        return comment;
      } else {
        unsorted.splice(0, 0, comment);
      }
    });
    if (unsorted.length > 0) {
      unsorted.map(unsort => {
        var result = comments.findIndex(function(obj) {
          return obj.id === unsort.parent_id;
        });
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
    return events.filter(event => {
      if (filters.indexOf(event.activity) > -1 && event.private === false) {
        return event;
      }
    });
  }

  static getHeadersAscend = events => {
    events = events
      .groupBy(x => {
        let start = new Date(x.start_time);
        let end = new Date(x.end_time);
        if (end - start > 2678400000) {
          return "Every Day";
        } else {
          return dateFormat(start, "fullDate");
        }
      })
      .sort((a, b) => {
        let n = new Date(a.get(0).start_time).getTime();
        let f = new Date(b.get(0).start_time).getTime();
        if (n > f) {
          return 1;
        } else if (f > n) {
          return -1;
        } else {
          return 0;
        }
      });
    return events;
  };
  static getHeadersDescend = events => {
    events = events
      .groupBy(x => {
        let date = new Date(x.start_time);
        return dateFormat(date, "fullDate");
      })
      .sort((a, b) => {
        let n = new Date(a.get(0).start_time).getTime();
        let f = new Date(b.get(0).start_time).getTime();
        if (n < f) {
          return 1;
        } else if (f < n) {
          return -1;
        } else {
          return 0;
        }
      });
    return events;
  };
  static filtersFromIds(ids) {
    return all.map(fil => {
      if (ids.indexOf(fil.id) > -1) {
        fil["selected"] = true;
        return fil;
      } else {
        fil["selected"] = false;
        return fil;
      }
    });
  }
}
