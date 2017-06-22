export function duration(start, end) {
  let duration =
    Math.round(Math.abs(end.getTime() - start.getTime()) / 15) * 15;
  let format = "";
  if (duration <= 0) {
    format = "";
  } else if (duration < 3500000) {
    format = Math.round(duration / 60000) + "min";
  } else if (duration < 86400000) {
    format = Math.ceil(duration / (1000 * 3600)) + "hrs";
  } else {
    format = Math.ceil(duration / (1000 * 3600 * 24)) + "days";
  }
  return format;
}
