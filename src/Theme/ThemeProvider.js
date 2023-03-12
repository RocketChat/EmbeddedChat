import React, { useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../context/ThemeContext';

const ThemeContextProvider = (props) => {
  const [primaryColor, setPrimaryColor] = useState(props.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(props.secondaryColor);

  const theme = useMemo(
    () => ({
      primaryColor,
      secondaryColor,
    }),
    [primaryColor, secondaryColor]
  );

  const updateTheme = (newPrimaryColor, newSecondaryColor) => {
    setPrimaryColor(newPrimaryColor);
    setSecondaryColor(newSecondaryColor);
  };

  useMemo(() => {
    updateTheme(primaryColor, secondaryColor);
  }, [primaryColor, secondaryColor]);

  return (
    <ThemeContext.Provider value={theme}>
      <div
        style={{
          backgroundColor: `${primaryColor}`,
          color: `${secondaryColor}`,
          height: '100vh',
        }}
      >
        {props.children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

ThemeContextProvider.propTypes = {
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
  children: PropTypes.node,
};
