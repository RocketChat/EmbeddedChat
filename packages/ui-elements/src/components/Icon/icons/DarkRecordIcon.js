import React from 'react';

const DarkRecordIcon = (props) => (
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
      stroke="white"
      strokeWidth="2"
      fill="black"
    />
    <circle cx="12" cy="12" r="6" fill="white" />
  </svg>
);

export default DarkRecordIcon;
