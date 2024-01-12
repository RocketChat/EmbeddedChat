import React from 'react';
import { css } from '@emotion/react';
import { Button } from '../Button';
import { Box } from '../Box';

const outerContainerCss = css`
  position:fixed;
  background-color: rgba(0, 0, 0, 0.3);
  left:0;
  top:0;
  bottom:0;
  right:0;
  z-index: 100;
`;
const containerCss = css`
  background-color:white;
  color: black;
  position:fixed;
  left:50%;
  top:50%;
  translate: -50% -50%;
  width: 30rem;
  padding: 1.5rem;
  padding-bottom: 3rem;
  border-radius: 10px;
  z-index: 101;
`;


const ErrorModal = ({ message, onClose, onConfirm }) => {
  return (
    <>
      <Box css={outerContainerCss} onClick={onClose}/>
      <Box css={containerCss}>
        <h2> <span css={css`opacity:60%;`}> ⚠︎ </span> {message} </h2>
        <p>Send it as attachment instead?</p>
        <Button css={css`position:absolute; right:1em;`} onClick={onConfirm}>Ok</Button>
        <span css={css`position:absolute; top:1em; right:1em;cursor:pointer;scale:1.5;`} onClick={onClose}> ⨯ </span>
      </Box>
    </>
  );
};

export default ErrorModal;
