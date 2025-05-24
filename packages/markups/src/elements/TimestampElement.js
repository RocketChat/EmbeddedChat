import React from 'react';
import PropTypes from 'prop-types';
import CodeElement from './CodeElement';

function timeAgo(dateParam, locale) {
  const int = new Intl.RelativeTimeFormat(locale, { style: 'long' });

  const date = new Date(dateParam).getTime();
  const today = new Date().getTime();
  const seconds = Math.round((date - today) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = new Date(date).getMonth() - new Date().getMonth();
  const years = new Date(date).getFullYear() - new Date().getFullYear();

  if (Math.abs(seconds) < 60) {
    return int.format(seconds, 'seconds');
  }
  if (Math.abs(minutes) < 60) {
    return int.format(minutes, 'minutes');
  }
  if (Math.abs(hours) < 24) {
    return int.format(hours, 'hours');
  }
  if (Math.abs(days) < 7) {
    return int.format(days, 'days');
  }
  if (Math.abs(weeks) < 4) {
    return int.format(weeks, 'weeks');
  }
  if (Math.abs(months) < 12) {
    return int.format(months, 'months');
  }
  return int.format(years, 'years');
}

const formatTimestamp = (timestamp, format) => {
  const date = new Date(timestamp * 1000);

  const getOrdinalDate = (day) => {
    const suffix = ['th', 'st', 'nd', 'rd'];
    const val = day % 100;
    return day + (suffix[(val - 20) % 10] || suffix[val] || suffix[0]);
  };

  const timeZoneOffset = date.getTimezoneOffset();
  const sign = timeZoneOffset > 0 ? '-' : '+';
  const hours = Math.floor(Math.abs(timeZoneOffset) / 60);
  const minutes = Math.abs(timeZoneOffset) % 60;
  const timeZone = `GMT${sign}${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}`;

  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = getOrdinalDate(date.getDate());
  const year = date.getFullYear();
  const time = date.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const shortDate = date.toLocaleDateString('en-US');
  const shortTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  switch (format) {
    case 't': {
      return shortTime;
    }
    case 'T': {
      return time;
    }
    case 'd': {
      return shortDate;
    }
    case 'D': {
      return `${shortDate}, ${shortTime}`;
    }
    case 'f': {
      return `${month} ${day}, ${year} at ${time} ${timeZone}`;
    }
    case 'F': {
      const weekday = date.toLocaleString('en-US', { weekday: 'long' });
      return `${weekday}, ${month} ${day} ${year} at ${time} ${timeZone}`;
    }
    case 'R': {
      return timeAgo(timestamp * 1000, 'en');
    }
    default: {
      return date.toLocaleString();
    }
  }
};

const TimestampElement = ({ contents }) => {
  if (typeof contents === 'object' && contents.timestamp && contents.format) {
    const { timestamp, format } = contents;

    const formattedTimestamp = formatTimestamp(parseInt(timestamp, 10), format);
    return <CodeElement contents={{ value: formattedTimestamp }} />;
  }

  return null;
};

export default TimestampElement;

TimestampElement.propTypes = {
  contents: PropTypes.shape({
    timestamp: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
  }).isRequired,
};
