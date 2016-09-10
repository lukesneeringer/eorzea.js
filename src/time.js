/**
 * A module for dealing with tracking Eorzea time.
 */
'use strict';

var strftime = require('strftime');


var EorzeaTime = function(hour, minute, second) {
  hour = hour || 0;
  minute = minute || 0;
  second = second || 0;

  // Record the second.
  this.second = parseInt(second % 60);

  // Record the minute.
  // If seconds were provided as a value over 60, convert the overage into
  // minutes.
  if (second > 60) {
    minute += parseInt(second / 60);
  }
  this.minute = parseInt(minute % 60);

  // Record the hour.
  // If minutes were provided as a value over 60, convert the overage into
  // hours. Discard any hour in excess of 23 (Eorzea time does not really have
  // tracked full days).
  if (minute > 60) {
    hour += parseInt(minute / 60);
  }
  this.hour = parseInt(hour % 24);
};

EorzeaTime.prototype = Object.create(Object.prototype);
EorzeaTime.prototype.constructor = EorzeaTime;


/**
 * Coerce the given arguments, if possible, to a Time object.
 * Converts a series of ints to a Time, or otherwise returns back the first
 * argument with no modifications.
 *
 * An internal method for use by methods of Time; developers should use
 * `new Time(...)` or `Time.now()` to make times.
 */
EorzeaTime._coerce = function(hour, minute, second) {
  if (typeof hour === 'number') {
    return new EorzeaTime(hour, minute, second);
  }

  // Okay, this is something else. Assume it is already an EorzeaTime and
  // pass it through.
  return hour;
};


/**
 * Return a Time object representing the current Eorzean time.
 */
EorzeaTime.now = function() {
  // The Eorzea time multiplier a known constant.
  var EORZEA_TIME_CONSTANT = 3600 / 175;

  // Multiply the current Unix timestamp by the Eorzea time constant.
  var epochTimestamp = new Date().getTime() / 1000;
  var eorzeaTimestamp = epochTimestamp * EORZEA_TIME_CONSTANT;

  // Return the result as an Eorzea Time object.
  return new EorzeaTime(
    (eorzeaTimestamp / 3600) % 24,
    (eorzeaTimestamp / 60) % 60,
    eorzeaTimestamp % 60
  );
};


/**
 * Return true if and only if the two Eorzean times are equal.
 * However, discard seconds for this purpose.
 */
EorzeaTime.prototype.eq = function(other) {
  // Sanity check: If we got integers, make them a Time object.
  other = EorzeaTime._coerce.apply(null, arguments);

  // If either the hour or minute do not match, return false.
  if (this.hour !== other.hour) {
    return false;
  }
  if (this.minute !== other.minute) {
    return false;
  }

  // The times are equivalent.
  return true;
};


/**
 * Return the time formatted using the provided format string.
 *
 * Follows general strftime conventions, and barfs if you try to use anything
 * involving a day or date (e.g. month, day of the week, year, etc.), as
 * Eorzea's calendar is limited to time of day.
 */
EorzeaTime.prototype.strftime = function(format) {
  // Sanity check: Since Eorzea effectively only has times and not days or
  // dates or the like, throw an exception if the format string has a format
  // that does not make sense.
  var invalid = ['a', 'A', 'b', 'B', 'c', 'd', 'h', 'j', 'm', 'U', 'w', 'W',
                 'x', 'y', 'Y', 'z', 'Z'];
  for (var i = 0; i < invalid.length; i += 1) {
    if (format.indexOf('%' + invalid[i]) !== -1) {
      throw new TypeError(
        'In Eorzea, strftime format strings may not include the format ' +
        'string `%' + invalid[i] + '`.'
      );
    }
  }

  // Convert our timestamp to a throwaway JavaScript date, which can be passed
  // to strftime.
  var dt = new Date(1980, 1, 1, this.hour, this.minute, this.second);

  // Return the strftime result for that date.
  return strftime(format, dt);
};


/**
 * Return a string representing the given Eorzea time.
 */
EorzeaTime.prototype.toString = function() {
  return this.strftime('%X Eorzea Time');
};


module.exports = EorzeaTime;
