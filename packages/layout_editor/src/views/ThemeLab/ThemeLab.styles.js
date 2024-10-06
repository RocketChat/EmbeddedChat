import { css } from '@emotion/react';

export const getThemeLabStyles = ({ theme }) => {
  const styles = {
    sectionContainer: css`
      display: flex;
      align-items: center;
      justify-content: space-around;
    `,

    section: css`
      cursor: pointer;
    `,
    sectionActive: css`
      border-bottom: 1px solid ${theme.colors.primary};
    `,

    btn: css`
      border-radius: 0.25rem;
      border: 1px solid ${theme.colors.border};
      margin: 0 0.75rem 0.75rem;
    `,

    syntaxBox: css`
      position: relative;
    `,

    closeBtn: css`
      padding: 0.5rem;
    `,

    modalTitle: css`
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `,
  };

  return styles;
};

export const getPaletteSettings = ({ theme }) => {
  const styles = {
    main: css`
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.25rem 0.75rem;
    `,
    colorSection: css`
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid ${theme.colors.border};
    `,
    typographySection: css`
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid ${theme.colors.border};
    `,

    commonSelect: css`
      display: flex;
      gap: 1.25rem;
      justify-content: space-between;
      padding: 1.25rem 0;
      position: relative;
    `,

    palette: css`
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `,
  };

  return styles;
};

export const getLayoutSettings = ({ theme }) => {
  const styles = {
    main: css`
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.25rem 0.75rem;
    `,
    variantSection: css`
      padding: 0.5rem;
      border: 1px solid ${theme.colors.border};
      border-radius: 0.25rem;
    `,

    toolSection: css`
      padding: 0.5rem;
      border: 1px solid ${theme.colors.border};
      border-radius: 0.25rem;
    `,

    commonSelect: css`
      display: flex;
      gap: 1.25rem;
      justify-content: space-between;
      padding: 1.25rem 0;
      position: relative;
    `,

    headerItems: css`
      padding: 1.25rem 0;
    `,

    itemContainer: css`
      display: flex;
      flex-wrap: wrap;
      padding: 0.5rem 0;
    `,
  };

  return styles;
};

export const getColorMangerStyles = () => {
  const styles = {
    pickerContainer: css`
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.25rem;
    `,

    colorPicker: css`
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 1;

      .saturation-white,
      .saturation-black,
      .hue-horizontal {
        cursor: pointer;
      }
    `,
  };

  return styles;
};

export const getFontManagerStyles = () => {
  const styles = {
    commonSelect: css`
      display: flex;
      gap: 1.25rem;
      justify-content: space-between;
      padding: 1.25rem 0;
      position: relative;
    `,
  };

  return styles;
};
