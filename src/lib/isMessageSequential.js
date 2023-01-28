import { differenceInSeconds, isSameDay } from 'date-fns';

const isMessageSequential = (current, previous, groupingRange) => {
  if (!previous) {
    return false;
  }

  if (current.t || previous.t) {
    return false;
  }

  if (current.tmid) {
    return [previous.tmid, previous._id].includes(current.tmid);
  }

  if (previous.tmid) {
    return false;
  }

  if (current.groupable === false) {
    return false;
  }

  if (current.u._id !== previous.u._id) {
    return false;
  }

  if (current.alias !== previous.alias) {
    return false;
  }

  console.log(
    differenceInSeconds(new Date(current.ts), new Date(previous.ts)),
    current.msg,
    previous.msg
  );

  return (
    differenceInSeconds(new Date(current.ts), new Date(previous.ts)) <
      groupingRange &&
    previous &&
    isSameDay(new Date(current.ts), new Date(previous.ts))
  );
};

export default isMessageSequential;
