import React from 'react';

const Summarize = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7zm0 2h18v20H7V6z"
    />
    <rect x="10" y="11" width="12" height="2" rx="1" />
    <rect x="10" y="15" width="12" height="2" rx="1" />
    <rect x="10" y="19" width="7" height="2" rx="1" />
    <path d="M23.5 4.5 24.25 6.5 26.25 7.25 24.25 8 23.5 10 22.75 8 20.75 7.25 22.75 6.5z" />
  </svg>
);

export default Summarize;
