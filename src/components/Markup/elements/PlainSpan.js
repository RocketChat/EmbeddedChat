import React from 'react';
import PropTypes from 'prop-types';
import styles from './PlainSpan.module.css';

const PlainSpan = ({ contents, classes }) => {

  let classnames = `${classes.bold ? styles.bold : ""} ${classes.italics ? styles.italics : ""} ${classes.strike? styles.strike: ""}`
  return <span className={`${classnames}`}>
    {contents}
  </span>
}

export default PlainSpan;

PlainSpan.propTypes = {
  contents: PropTypes.string,
  classes: PropTypes.object,
};
