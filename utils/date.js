export function duration(start, end) {
  let diff = end - start;
  let minutes = Math.floor(diff / 60000);
  if (minutes < 60) {
    return minutes + "mins";
  } else if (minutes < 2880) {
    let hours = Math.floor(minutes / 60);
    return hours + "hrs";
  } else {
    let days = Math.floor(minutes / 1440);
    return days + "days";
  }
}
