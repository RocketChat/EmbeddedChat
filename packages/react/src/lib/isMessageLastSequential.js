import isMessageSequential from './isMessageSequential';

const isMessageLastSequential = (current, next) => {
  if (!next) {
    return true;
  }

  if (current.u._id !== next.u._id) {
    return true;
  }

  if (!isMessageSequential(next, current, 300)) {
    return true;
  }

  return false;
};

export default isMessageLastSequential;
