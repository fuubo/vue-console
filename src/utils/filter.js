import moment from 'moment'
let dateFormat = function (data) {
  if (data) {
    return moment(String(data)).format('YYYY-MM-DD')
  }
  return ''
}
let dateAndTime = function (data) {
  if (data) {
    return moment(String(data)).format('YYYY-MM-DD HH:mm')
  }
  return ''
}
let age = function (data) {
  if (data && data !== '') {
    return moment().diff(data, 'years');

  } else {
    return ''
  }
}

export {
  dateFormat,
  dateAndTime,
  age
}