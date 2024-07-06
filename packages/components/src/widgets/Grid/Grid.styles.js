import { css } from '@emotion/react';

export const gridStyles = {
  container: css`
    display: grid;
    height: 100%;
  `,
  dynamic: (cols, gap, gapX, gapY, xs, md, lg, xl, xxl) => css`
    ${cols && `grid-template-columns: repeat(${cols}, 1fr);`}
    ${gap && `gap: ${gap};`}
    ${gapX && `column-gap: ${gapX};`}
    ${gapY && `row-gap: ${gapY};`}

    @media (max-width: 600px) {
      ${xs && xs.cols && `grid-template-columns: repeat(${xs.cols}, 1fr);`};
      ${xs && xs.gapX && `column-gap: ${xs.gapX};`};
    }

    @media (min-width: 600px) {
      ${md && md.cols && `grid-template-columns: repeat(${md.cols}, 1fr);`};
      ${md && md.gapX && `column-gap: ${md.gapX};`};
    }

    @media (min-width: 768px) {
      ${lg && lg.cols && `grid-template-columns: repeat(${lg.cols}, 1fr);`};
      ${lg && lg.gapX && `column-gap: ${lg.gapX};`};
    }

    @media (min-width: 992px) {
      ${xl && xl.cols && `grid-template-columns: repeat(${xl.cols}, 1fr);`};
      ${xl && xl.gapX && `column-gap: ${xl.gapX};`};
    }

    @media (min-width: 1200px) {
      ${xxl && xxl.cols && `grid-template-columns: repeat(${xxl.cols}, 1fr);`};
      ${xxl && xxl.gapX && `column-gap: ${xxl.gapX};`};
    }
  `,
};

export const gridItemStyles = {
  dynamicItem: (standard, xs, md, lg, xl, xxl) => css`
    ${standard && standard.colSpan && `grid-column: span ${standard.colSpan}`};
    ${standard && standard.rowSpan && `grid-row: span ${standard.rowSpan}`};
    ${standard &&
    standard.colStart &&
    `grid-column-start: ${standard.colStart}`};
    ${standard && standard.colEnd && `grid-column-end: ${standard.colEnd}`};
    ${standard && standard.rowStart && `grid-row-start: ${standard.rowStart}`};
    ${standard && standard.rowEnd && `grid-row-end: ${standard.rowEnd}`};

    @media (min-width: 600px) {
      ${xs && xs.colSpan && `grid-column: span ${xs.colSpan}`};
      ${xs && xs.rowSpan && `grid-row: span ${xs.rowSpan}`};
      ${xs && xs.colStart && `grid-column-start: ${xs.colStart}`};
      ${xs && xs.colEnd && `grid-column-end: ${xs.colEnd}`};
      ${xs && xs.rowStart && `grid-row-start: ${xs.rowStart}`};
      ${xs && xs.rowEnd && `grid-row-end: ${xs.rowEnd}`};
    }

    @media (min-width: 600px) {
      ${md && md.colSpan && `grid-column: span ${md.colSpan}`};
      ${md && md.rowSpan && `grid-row: span ${md.rowSpan}`};
      ${md && md.colStart && `grid-column-start: ${md.colStart}`};
      ${md && md.colEnd && `grid-column-end: ${md.colEnd}`};
      ${md && md.rowStart && `grid-row-start: ${md.rowStart}`};
      ${md && md.rowEnd && `grid-row-end: ${md.rowEnd}`};
    }

    @media (min-width: 768px) {
      ${lg && lg.colSpan && `grid-column: span ${lg.colSpan}`};
      ${lg && lg.rowSpan && `grid-row: span ${lg.rowSpan}`};
      ${lg && lg.colStart && `grid-column-start: ${lg.colStart}`};
      ${lg && lg.colEnd && `grid-column-end: ${lg.colEnd}`};
      ${lg && lg.rowStart && `grid-row-start: ${lg.rowStart}`};
      ${lg && lg.rowEnd && `grid-row-end: ${lg.rowEnd}`};
    }

    @media (min-width: 992px) {
      ${xl && xl.colSpan && `grid-column: span ${xl.colSpan}`};
      ${xl && xl.rowSpan && `grid-row: span ${xl.rowSpan}`};
      ${xl && xl.colStart && `grid-column-start: ${xl.colStart}`};
      ${xl && xl.colEnd && `grid-column-end: ${xl.colEnd}`};
      ${xl && xl.rowStart && `grid-row-start: ${xl.rowStart}`};
      ${xl && xl.rowEnd && `grid-row-end: ${xl.rowEnd}`};
    }

    @media (min-width: 1200px) {
      ${xxl && xxl.colSpan && `grid-column: span ${xxl.colSpan}`};
      ${xxl && xxl.rowSpan && `grid-row: span ${xxl.rowSpan}`};
      ${xxl && xxl.colStart && `grid-column-start: ${xxl.colStart}`};
      ${xxl && xxl.colEnd && `grid-column-end: ${xxl.colEnd}`};
      ${xxl && xxl.rowStart && `grid-row-start: ${xxl.rowStart}`};
      ${xxl && xxl.rowEnd && `grid-row-end: ${xxl.rowEnd}`};
    }
  `,
};
