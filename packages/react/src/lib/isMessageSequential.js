import { differenceInSeconds, isSameDay } from 'date-fns';

const isMessageSequential = (current, previous, groupingRange) => {
  if (!previous) {
    return false;
  }

  if (current.t || previous.t) {
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

  const isTimeDiffSmall =
    differenceInSeconds(new Date(current.ts), new Date(previous.ts)) <
    groupingRange;

  const isMessageNewDay =
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return isTimeDiffSmall && !isMessageNewDay;
};

export default isMessageSequential;
