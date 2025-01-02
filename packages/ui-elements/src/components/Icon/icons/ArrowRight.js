import React from 'react';

const ArrowRight = (props) => {
  const rotateDegrees = -90;
  const transformStyle = `rotate(${rotateDegrees}deg)`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      className="rcx-svg--directional"
      fill="currentColor"
      {...props}
      style={{ transform: transformStyle }}
    >
      <path d="M10,11.9512195 L14.4571429,7.51219512 C14.7415132,7.22898071 15.2013439,7.22898071 15.4857143,7.51219512 L15.4857143,7.51219512 C15.7685918,7.79392277 15.769524,8.25162572 15.4877964,8.53450327 C15.4871038,8.53519872 15.4864097,8.53589275 15.4857143,8.53658537 L10.7056652,13.2972034 C10.315473,13.6858094 9.68452704,13.6858094 9.29433482,13.2972034 L4.51428571,8.53658537 C4.23140816,8.25485772 4.23047597,7.79715477 4.51220362,7.51427722 C4.51289624,7.51358177 4.51359027,7.51288774 4.51428571,7.51219512 L4.51428571,7.51219512 C4.7986561,7.22898071 5.25848675,7.22898071 5.54285714,7.51219512 L7.51428571,9.47560976 L10,11.9512195 Z" />
    </svg>
  );
};

export default ArrowRight;
