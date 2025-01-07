import React from 'react';

const StopRecord = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="none"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="black"
      strokeWidth="2"
      fill="white"
    />
    <rect x="9" y="9" width="6" height="6" fill="black" />
  </svg>
);

export default StopRecord;
