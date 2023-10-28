import { css } from '@emotion/react';

// Define Reusable CSS constants
function toEm(pxValue) {
  return `${pxValue / 16}em`;
}

function toRem(pxValue) {
  return `${pxValue / 16}rem`;
}

// Emotion styles
const styles = {
  ecGrid: css`
    display: flex;
    flex-flow: row wrap;
    margin-block: calc(${toRem(16)} / -2);
    margin-inline: calc(${toRem(16)} / -2);
  `,
  ecGridWrapper: css`
    overflow: hidden;
  `,
  ecGridXs: css`
    & > .ec-grid {
      margin-block: calc(${toRem(16)} / -2);
      margin-inline: calc(${toRem(16)} / -2);
    }
  `,
  [`@media screen and (min-width: ${toEm(600)})`]: {
    '.ec-grid': {
      marginBlock: `calc(${toRem(16)} / -2)`,
      marginInline: `calc(${toRem(16)} / -2)`,
    },
  },
  ecGridSm: css`
    & > .ec-grid {
      margin-block: calc(${toRem(16)} / -2);
      margin-inline: calc(${toRem(16)} / -2);
    }
  `,
  [`@media screen and (min-width: ${toEm(768)})`]: {
    '.ec-grid': {
      marginBlock: `calc(${toRem(24)} / -2)`,
      marginInline: `calc(${toRem(24)} / -2)`,
    },
  },
  ecGridMd: css`
    & > .ec-grid {
      margin-block: calc(${toRem(24)} / -2);
      margin-inline: calc(${toRem(24)} / -2);
    }
  `,
  [`@media screen and (min-width: ${toEm(1024)})`]: {
    '.ec-grid': {
      marginBlock: `calc(${toRem(24)} / -2)`,
      marginInline: `calc(${toRem(24)} / -2)`,
    },
  },
  ecGridLg: css`
    & > .ec-grid {
      margin-block: calc(${toRem(24)} / -2);
      margin-inline: calc(${toRem(24)} / -2);
    }
  `,
  [`@media screen and (min-width: ${toEm(1280)})`]: {
    '.ec-grid': {
      marginBlock: `calc(${toRem(24)} / -2)`,
      marginInline: `calc(${toRem(24)} / -2)`,
    },
  },
  ecGridXl: css`
    & > .ec-grid {
      margin-block: calc(${toRem(24)} / -2);
      margin-inline: calc(${toRem(24)} / -2);
    }
  `,
  [`@media screen and (min-width: ${toEm(1600)})`]: {
    '.ec-grid': {
      marginBlock: `calc(${toRem(24)} / -2)`,
      marginInline: `calc(${toRem(24)} / -2)`,
    },
  },
  ecGridXxl: css`
    & > .ec-grid {
      margin-block: calc(${toRem(24)} / -2);
      margin-inline: calc(${toRem(24)} / -2);
    }
  `,
  [`@media screen and (min-width: ${toEm(1920)})`]: {
    '.ec-grid': {
      marginBlock: `calc(${toRem(24)} / -2)`,
      marginInline: `calc(${toRem(24)} / -2)`,
    },
  },
  ecGridXxxl: css`
    & > .ec-grid {
      margin-block: calc(${toRem(24)} / -2);
      margin-inline: calc(${toRem(24)} / -2);
    }
  `,
  ecGridItem: css`
    flex: 1 1 0;
    padding-block: calc(${toRem(16)} / 2);
    padding-inline: calc(${toRem(16)} / 2);
  `,
  ecGridItemXs1: css`
    flex-grow: 0;
    flex-basis: 25%;
    max-width: 25%;
  `,
  ecGridItemXs2: css`
    flex-grow: 0;
    flex-basis: 50%;
    max-width: 50%;
  `,
  ecGridItemXs3: css`
    flex-grow: 0;
    flex-basis: 75%;
    max-width: 75%;
  `,
  exGridItemXs4: css`
    flex-grow: 0;
    flex-basis: 100%;
    max-width: 100%;
  `,
  ecGridXs: css`
    & > .ec-grid__item {
      padding-block: calc(${toRem(16)} / 2);
      padding-inline: calc(${toRem(16)} / 2);
    }
  `,
  ecGridXs: css`
    & > .ec-grid__item--xs-1 {
      flex-grow: 0;
      flex-basis: 25%;
      max-width: 25%;
    }
  `,
  ecGridXs: css`
    & > .ec-grid__item--xs-2 {
      flex-grow: 0;
      flex-basis: 50%;
      max-width: 50%;
    }
  `,
  ecGridXs: css`
    & > .ec-grid__item--xs-3 {
      flex-grow: 0;
      flex-basis: 75%;
      max-width: 75%;
    }
  `,
  ecGridXs: css`
    & > .ec-grid__item--xs-4 {
      flex-grow: 0;
      flex-basis: 100%;
      max-width: 100%;
    }
  `,
  [`@media screen and (min-width: ${toEm(600)})`]: {
    '.ec-grid__item': {
      paddingBlock: `calc(${toRem(16)} / 2 )`,
      paddingInline: `calc(${toRem(16)} / 2 )`,
    },
    '.ec-grid__item--sm-1': {
      flexGrow: '0',
      flexBasis: '12.5%',
      maxWidth: '12.5%',
    },
    '.ec-grid__item--sm-2': {
      flexGrow: '0',
      flexBasis: '25%',
      maxWidth: '25%',
    },
    '.ec-grid__item--sm-3': {
      flexGrow: '0',
      flexBasis: '37.5%',
      maxWidth: '37.5%',
    },
    '.ec-grid__item--sm-4': {
      flexGrow: '0',
      flexBasis: '50%',
      maxWidth: '50%',
    },
    '.ec-grid__item--sm-5': {
      flexGrow: '0',
      flexBasis: '62.5%',
      maxWidth: '62.5%',
    },
    '.ec-grid__item--sm-6': {
      flexGrow: '0',
      flexBasis: '75%',
      maxWidth: '75%',
    },
    '.ec-grid__item--sm-7': {
      flexGrow: '0',
      flexBasis: '87.5%',
      maxWidth: '87.5%',
    },
    '.ec-grid__item--sm-8': {
      flexGrow: '0',
      flexBasis: '100%',
      maxWidth: '100%',
    },
  },
  ecGridSm: css`
    & > .ec-grid__item {
      padding-block: calc(${toRem(16)} / 2);
      padding-inline: calc(${toRem(16)} / 2);
    }
  `,
  ecGridSm: css`
    & > .ec-grid__item--sm-1 {
      flex-grow: 0;
      flex-basis: 12.5%;
      max-width: 12.5%;
    }
  `,
  ecGridSm: css`
    & > .ec-grid__item--sm-2 {
      flex-grow: 0;
      flex-basis: 25%;
      max-width: 25%;
    }
  `,
  ecGridSm: css`
    & > .ec-grid__item--sm-3 {
      flex-grow: 0;
      flex-basis: 37.5%;
      max-width: 37.5%;
    }
  `,
  ecGridSm: css`
    & > .ec-grid__item--sm-4 {
      flex-grow: 0;
      flex-basis: 50%;
      max-width: 50%;
    }
  `,
  ecGridSm: css`
    & > .ec-grid__item--sm-5 {
      flex-grow: 0;
      flex-basis: 62.5%;
      max-width: 62.5%;
    }
  `,
  ecGridSm: css`
    & > .ec-grid__item--sm-6 {
      flex-grow: 0;
      flex-basis: 75%;
      max-width: 75%;
    }
  `,
  ecGridSm: css`
    & > .ec-grid__item--sm-7 {
      flex-grow: 0;
      flex-basis: 87.5%;
      max-width: 87.5%;
    }
  `,
  ecGridSm: css`
    & > .ec-grid__item--sm-8 {
      flex-grow: 0;
      flex-basis: 100%;
      max-width: 100%;
    }
  `,
  [`@media screen and (min-width: ${toEm(768)})`]: {
    '.ec-grid__item': {
      paddingBlock: `calc(${toRem(24)} / 2 )`,
      paddingInline: `calc(${toRem(24)} / 2 )`,
    },
    '.ec-grid__item--md-1': {
      flexGrow: '0',
      flexBasis: '12.5%',
      maxWidth: '12.5%',
    },
    '.ec-grid__item--md-2': {
      flexGrow: '0',
      flexBasis: '25%',
      maxWidth: '25%',
    },
    '.ec-grid__item--md-3': {
      flexGrow: '0',
      flexBasis: '37.5%',
      maxWidth: '37.5%',
    },
    '.ec-grid__item--md-4': {
      flexGrow: '0',
      flexBasis: '50%',
      maxWidth: '50%',
    },
    '.ec-grid__item--md-5': {
      flexGrow: '0',
      flexBasis: '62.5%',
      maxWidth: '62.5%',
    },
    '.ec-grid__item--md-6': {
      flexGrow: '0',
      flexBasis: '75%',
      maxWidth: '75%',
    },
    '.ec-grid__item--md-7': {
      flexGrow: '0',
      flexBasis: '87.5%',
      maxWidth: '87.5%',
    },
    '.ec-grid__item--md-8': {
      flexGrow: '0',
      flexBasis: '100%',
      maxWidth: '100%',
    },
  },
  ecGridMd: css`
    & > .ec-grid__item {
      padding-block: calc(${toRem(16)} / 2);
      padding-inline: calc(${toRem(16)} / 2);
    }
  `,
  ecGridMd: css`
    & > .ec-grid__item--md-1 {
      flex-grow: 0;
      flex-basis: 12.5%;
      max-width: 12.5%;
    }
  `,
  ecGridMd: css`
    & > .ec-grid__item--md-2 {
      flex-grow: 0;
      flex-basis: 25%;
      max-width: 25%;
    }
  `,
  ecGridMd: css`
    & > .ec-grid__item--md-3 {
      flex-grow: 0;
      flex-basis: 37.5%;
      max-width: 37.5%;
    }
  `,
  ecGridMd: css`
    & > .ec-grid__item--md-4 {
      flex-grow: 0;
      flex-basis: 50%;
      max-width: 50%;
    }
  `,
  ecGridMd: css`
    & > .ec-grid__item--md-5 {
      flex-grow: 0;
      flex-basis: 62.5%;
      max-width: 62.5%;
    }
  `,
  ecGridMd: css`
    & > .ec-grid__item--md-6 {
      flex-grow: 0;
      flex-basis: 75%;
      max-width: 75%;
    }
  `,
  ecGridMd: css`
    & > .ec-grid__item--md-7 {
      flex-grow: 0;
      flex-basis: 87.5%;
      max-width: 87.5%;
    }
  `,
  ecGridMd: css`
    & > .ec-grid__item--md-8 {
      flex-grow: 0;
      flex-basis: 100%;
      max-width: 100%;
    }
  `,
  [`@media screen and (min-width: ${toEm(1024)})`]: {
    '.ec-grid__item': {
      paddingBlock: `calc(${toRem(24)} / 2 )`,
      paddingInline: `calc(${toRem(24)} / 2 )`,
    },
    '.ec-grid__item--lg-1': {
      flexGrow: '0',
      flexBasis: '8.3333333333%',
      maxWidth: '8.3333333333%',
    },
    '.ec-grid__item--lg-2': {
      flexGrow: '0',
      flexBasis: '16.6666666667%',
      maxWidth: '16.6666666667%',
    },
    '.ec-grid__item--lg-3': {
      flexGrow: '0',
      flexBasis: '25%',
      maxWidth: '25%',
    },
    '.ec-grid__item--lg-4': {
      flexGrow: '0',
      flexBasis: '33.3333333333%',
      maxWidth: '33.3333333333%',
    },
    '.ec-grid__item--lg-5': {
      flexGrow: '0',
      flexBasis: '41.6666666667%',
      maxWidth: '41.6666666667%',
    },
    '.ec-grid__item--lg-6': {
      flexGrow: '0',
      flexBasis: '50%',
      maxWidth: '50%',
    },
    '.ec-grid__item--lg-7': {
      flexGrow: '0',
      flexBasis: '58.3333333333%',
      maxWidth: '58.3333333333%',
    },
    '.ec-grid__item--lg-8': {
      flexGrow: '0',
      flexBasis: '66.6666666667%',
      maxWidth: '66.6666666667%;',
    },
    '.ec-grid__item--lg-9': {
      flexGrow: '0',
      flexBasis: '75%',
      maxWidth: '75%',
    },
    '.ec-grid__item--lg-10': {
      flexGrow: '0',
      flexBasis: '83.3333333333%',
      maxWidth: '83.3333333333%',
    },
    '.ec-grid__item--lg-11': {
      flexGrow: '0',
      flexBasis: '91.6666666667%',
      maxWidth: '91.6666666667%',
    },
    '.ec-grid__item--lg-12': {
      flexGrow: '0',
      flexBasis: '100%',
      maxWidth: '100%',
    },
  },
  ecGridLg: css`
    & > .ec-grid__item {
      padding-block: calc(${toRem(24)} / 2);
      padding-inline: calc(${toRem(24)} / 2);
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-1 {
      flex-grow: 0;
      flex-basis: 8.3333333333%;
      max-width: 8.3333333333%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-2 {
      flex-grow: 0;
      flex-basis: 16.6666666667%;
      max-width: 16.6666666667%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-3 {
      flex-grow: 0;
      flex-basis: 25%;
      max-width: 25%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-4 {
      flex-grow: 0;
      flex-basis: 33.3333333333%;
      max-width: 33.3333333333%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-5 {
      flex-grow: 0;
      flex-basis: 41.6666666667%;
      max-width: 41.6666666667%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-6 {
      flex-grow: 0;
      flex-basis: 50%;
      max-width: 50%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-7 {
      flex-grow: 0;
      flex-basis: 58.3333333333%;
      max-width: 58.3333333333%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-8 {
      flex-grow: 0;
      flex-basis: 66.6666666667%;
      max-width: 66.6666666667%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-9 {
      flex-grow: 0;
      flex-basis: 75%;
      max-width: 75%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-10 {
      flex-grow: 0;
      flex-basis: 83.3333333333%;
      max-width: 83.3333333333%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-11 {
      flex-grow: 0;
      flex-basis: 91.6666666667%;
      max-width: 91.6666666667%;
    }
  `,
  ecGridLg: css`
    & > .ec-grid__item--lg-12 {
      flex-grow: 0;
      flex-basis: 100%;
      max-width: 100%;
    }
  `,
  [`@media screen and (min-width: ${toEm(1280)})`]: {
    '.ec-grid__item': {
      paddingBlock: `calc(${toRem(24)} / 2 )`,
      paddingInline: `calc(${toRem(24)} / 2 )`,
    },
    '.ec-grid__item--xl-1': {
      flexGrow: '0',
      flexBasis: '8.3333333333%',
      maxWidth: '8.3333333333%',
    },
    '.ec-grid__item--xl-2': {
      flexGrow: '0',
      flexBasis: '16.6666666667%',
      maxWidth: '16.6666666667%',
    },
    '.ec-grid__item--xl-3': {
      flexGrow: '0',
      flexBasis: '25%',
      maxWidth: '25%',
    },
    '.ec-grid__item--xl-4': {
      flexGrow: '0',
      flexBasis: '33.3333333333%',
      maxWidth: '33.3333333333%',
    },
    '.ec-grid__item--xl-5': {
      flexGrow: '0',
      flexBasis: '41.6666666667%',
      maxWidth: '41.6666666667%',
    },
    '.ec-grid__item--xl-6': {
      flexGrow: '0',
      flexBasis: '50%',
      maxWidth: '50%',
    },
    '.ec-grid__item--xl-7': {
      flexGrow: '0',
      flexBasis: '58.3333333333%',
      maxWidth: '58.3333333333%',
    },
    '.ec-grid__item--xl-8': {
      flexGrow: '0',
      flexBasis: '66.6666666667%',
      maxWidth: '66.6666666667%;',
    },
    '.ec-grid__item--xl-9': {
      flexGrow: '0',
      flexBasis: '75%',
      maxWidth: '75%',
    },
    '.ec-grid__item--xl-10': {
      flexGrow: '0',
      flexBasis: '83.3333333333%',
      maxWidth: '83.3333333333%',
    },
    '.ec-grid__item--xl-11': {
      flexGrow: '0',
      flexBasis: '91.6666666667%',
      maxWidth: '91.6666666667%',
    },
    '.ec-grid__item--xl-12': {
      flexGrow: '0',
      flexBasis: '100%',
      maxWidth: '100%',
    },
  },
  ecGridXl: css`
    & > .ec-grid__item {
      padding-block: calc(${toRem(24)} / 2);
      padding-inline: calc(${toRem(24)} / 2);
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-1 {
      flex-grow: 0;
      flex-basis: 8.3333333333%;
      max-width: 8.3333333333%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-2 {
      flex-grow: 0;
      flex-basis: 16.6666666667%;
      max-width: 16.6666666667%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-3 {
      flex-grow: 0;
      flex-basis: 25%;
      max-width: 25%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-4 {
      flex-grow: 0;
      flex-basis: 33.3333333333%;
      max-width: 33.3333333333%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-5 {
      flex-grow: 0;
      flex-basis: 41.6666666667%;
      max-width: 41.6666666667%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-6 {
      flex-grow: 0;
      flex-basis: 50%;
      max-width: 50%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-7 {
      flex-grow: 0;
      flex-basis: 58.3333333333%;
      max-width: 58.3333333333%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-8 {
      flex-grow: 0;
      flex-basis: 66.6666666667%;
      max-width: 66.6666666667%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-9 {
      flex-grow: 0;
      flex-basis: 75%;
      max-width: 75%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-10 {
      flex-grow: 0;
      flex-basis: 83.3333333333%;
      max-width: 83.3333333333%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-11 {
      flex-grow: 0;
      flex-basis: 91.6666666667%;
      max-width: 91.6666666667%;
    }
  `,
  ecGridXl: css`
    & > .ec-grid__item--xl-12 {
      flex-grow: 0;
      flex-basis: 100%;
      max-width: 100%;
    }
  `,
  [`@media screen and (min-width: ${toEm(1600)})`]: {
    '.ec-grid__item': {
      paddingBlock: `calc(${toRem(24)} / 2 )`,
      paddingInline: `calc(${toRem(24)} / 2 )`,
    },
    '.ec-grid__item--xxl-1': {
      flexGrow: '0',
      flexBasis: '8.3333333333%',
      maxWidth: '8.3333333333%',
    },
    '.ec-grid__item--xxl-2': {
      flexGrow: '0',
      flexBasis: '16.6666666667%',
      maxWidth: '16.6666666667%',
    },
    '.ec-grid__item--xxl-3': {
      flexGrow: '0',
      flexBasis: '25%',
      maxWidth: '25%',
    },
    '.ec-grid__item--xxl-4': {
      flexGrow: '0',
      flexBasis: '33.3333333333%',
      maxWidth: '33.3333333333%',
    },
    '.ec-grid__item--xxl-5': {
      flexGrow: '0',
      flexBasis: '41.6666666667%',
      maxWidth: '41.6666666667%',
    },
    '.ec-grid__item--xxl-6': {
      flexGrow: '0',
      flexBasis: '50%',
      maxWidth: '50%',
    },
    '.ec-grid__item--xxl-7': {
      flexGrow: '0',
      flexBasis: '58.3333333333%',
      maxWidth: '58.3333333333%',
    },
    '.ec-grid__item--xxl-8': {
      flexGrow: '0',
      flexBasis: '66.6666666667%',
      maxWidth: '66.6666666667%;',
    },
    '.ec-grid__item--xxl-9': {
      flexGrow: '0',
      flexBasis: '75%',
      maxWidth: '75%',
    },
    '.ec-grid__item--xxl-10': {
      flexGrow: '0',
      flexBasis: '83.3333333333%',
      maxWidth: '83.3333333333%',
    },
    '.ec-grid__item--xxl-11': {
      flexGrow: '0',
      flexBasis: '91.6666666667%',
      maxWidth: '91.6666666667%',
    },
    '.ec-grid__item--xxl-12': {
      flexGrow: '0',
      flexBasis: '100%',
      maxWidth: '100%',
    },
  },
  ecGridXxl: css`
    & > .ec-grid__item {
      padding-block: calc(${toRem(24)} / 2);
      padding-inline: calc(${toRem(24)} / 2);
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-1 {
      flex-grow: 0;
      flex-basis: 8.3333333333%;
      max-width: 8.3333333333%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-2 {
      flex-grow: 0;
      flex-basis: 16.6666666667%;
      max-width: 16.6666666667%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-3 {
      flex-grow: 0;
      flex-basis: 25%;
      max-width: 25%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-4 {
      flex-grow: 0;
      flex-basis: 33.3333333333%;
      max-width: 33.3333333333%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-5 {
      flex-grow: 0;
      flex-basis: 41.6666666667%;
      max-width: 41.6666666667%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-6 {
      flex-grow: 0;
      flex-basis: 50%;
      max-width: 50%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-7 {
      flex-grow: 0;
      flex-basis: 58.3333333333%;
      max-width: 58.3333333333%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-8 {
      flex-grow: 0;
      flex-basis: 66.6666666667%;
      max-width: 66.6666666667%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-9 {
      flex-grow: 0;
      flex-basis: 75%;
      max-width: 75%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-10 {
      flex-grow: 0;
      flex-basis: 83.3333333333%;
      max-width: 83.3333333333%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-11 {
      flex-grow: 0;
      flex-basis: 91.6666666667%;
      max-width: 91.6666666667%;
    }
  `,
  ecGridXxl: css`
    & > .ec-grid__item--xxl-12 {
      flex-grow: 0;
      flex-basis: 100%;
      max-width: 100%;
    }
  `,
  [`@media screen and (min-width: ${toEm(1920)})`]: {
    '.ec-grid__item': {
      paddingBlock: `calc(${toRem(24)} / 2 )`,
      paddingInline: `calc(${toRem(24)} / 2 )`,
    },
    '.ec-grid__item--xxxl-1': {
      flexGrow: '0',
      flexBasis: '8.3333333333%',
      maxWidth: '8.3333333333%',
    },
    '.ec-grid__item--xxxl-2': {
      flexGrow: '0',
      flexBasis: '16.6666666667%',
      maxWidth: '16.6666666667%',
    },
    '.ec-grid__item--xxxl-3': {
      flexGrow: '0',
      flexBasis: '25%',
      maxWidth: '25%',
    },
    '.ec-grid__item--xxxl-4': {
      flexGrow: '0',
      flexBasis: '33.3333333333%',
      maxWidth: '33.3333333333%',
    },
    '.ec-grid__item--xxxl-5': {
      flexGrow: '0',
      flexBasis: '41.6666666667%',
      maxWidth: '41.6666666667%',
    },
    '.ec-grid__item--xxxl-6': {
      flexGrow: '0',
      flexBasis: '50%',
      maxWidth: '50%',
    },
    '.ec-grid__item--xxxl-7': {
      flexGrow: '0',
      flexBasis: '58.3333333333%',
      maxWidth: '58.3333333333%',
    },
    '.ec-grid__item--xxxl-8': {
      flexGrow: '0',
      flexBasis: '66.6666666667%',
      maxWidth: '66.6666666667%;',
    },
    '.ec-grid__item--xxxl-9': {
      flexGrow: '0',
      flexBasis: '75%',
      maxWidth: '75%',
    },
    '.ec-grid__item--xxxl-10': {
      flexGrow: '0',
      flexBasis: '83.3333333333%',
      maxWidth: '83.3333333333%',
    },
    '.ec-grid__item--xxxl-11': {
      flexGrow: '0',
      flexBasis: '91.6666666667%',
      maxWidth: '91.6666666667%',
    },
    '.ec-grid__item--xxxl-12': {
      flexGrow: '0',
      flexBasis: '100%',
      maxWidth: '100%',
    },
  },
  ecGridXxxl: css`
    & > .ec-grid__item {
      padding-block: calc(${toRem(24)} / 2);
      padding-inline: calc(${toRem(24)} / 2);
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-1 {
      flex-grow: 0;
      flex-basis: 8.3333333333%;
      max-width: 8.3333333333%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-2 {
      flex-grow: 0;
      flex-basis: 16.6666666667%;
      max-width: 16.6666666667%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-3 {
      flex-grow: 0;
      flex-basis: 25%;
      max-width: 25%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-4 {
      flex-grow: 0;
      flex-basis: 33.3333333333%;
      max-width: 33.3333333333%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-5 {
      flex-grow: 0;
      flex-basis: 41.6666666667%;
      max-width: 41.6666666667%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-6 {
      flex-grow: 0;
      flex-basis: 50%;
      max-width: 50%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-7 {
      flex-grow: 0;
      flex-basis: 58.3333333333%;
      max-width: 58.3333333333%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-8 {
      flex-grow: 0;
      flex-basis: 66.6666666667%;
      max-width: 66.6666666667%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-9 {
      flex-grow: 0;
      flex-basis: 75%;
      max-width: 75%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-10 {
      flex-grow: 0;
      flex-basis: 83.3333333333%;
      max-width: 83.3333333333%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-11 {
      flex-grow: 0;
      flex-basis: 91.6666666667%;
      max-width: 91.6666666667%;
    }
  `,
  ecGridXxxl: css`
    & > .ec-grid__item--xxxl-12 {
      flex-grow: 0;
      flex-basis: 100%;
      max-width: 100%;
    }
  `,
};

export default styles;
