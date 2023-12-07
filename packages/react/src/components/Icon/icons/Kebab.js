import React from 'react';
import { Tooltip } from '@mui/material';
const Kebab = (props) => (
  <Tooltip title="Options" arrow>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="currentColor"
    {...props}
  >
    <path d="M18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8Z M18 16C18 17.1046 17.1046 18 16 18C14.8954 18 14 17.1046 14 16C14 14.8954 14.8954 14 16 14C17.1046 14 18 14.8954 18 16Z M18 24C18 25.1046 17.1046 26 16 26C14.8954 26 14 25.1046 14 24C14 22.8954 14.8954 22 16 22C17.1046 22 18 22.8954 18 24Z" />
  </svg>
  </Tooltip>
);

export default Kebab;
