const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isDifferentDay =
    date.getDate() !== now.getDate() ||
    date.getMonth() !== now.getMonth() ||
    date.getFullYear() !== now.getFullYear();

  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedTime = date.toLocaleTimeString('en-US', options);

  return isDifferentDay
    ? `${date.toLocaleDateString('en-US', {
        weekday: 'long',
      })} ${formattedTime}`
    : formattedTime;
};

export default formatTimestamp;
