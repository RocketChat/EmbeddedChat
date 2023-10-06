const gridStyles = {
".ec-grid": {
  display: "flex",
  flexFlow: "row wrap",
  marginBlock: "calc( to-rem(16) / -2 )",
  marginInline: "calc( to-rem(16) / -2 )",
},
".ec-grid__wrapper": {
  overflow: "hidden",
},
".ec-grid--xs > .ec-grid": {
  marginBlock: "calc( to-rem(16) / -2 )",
  marginInline: "calc( to-rem(16) / -2 )",
},
"@media screen and (min-width: to-em(600))": {
  ".ec-grid": {
    marginBlock: "calc( to-rem(16) / -2 )",
    marginInline: "calc( to-rem(16) / -2 )",
  },
},
".ec-grid--sm > .ec-grid": {
  marginBlock: "calc( to-rem(16) / -2 )",
  marginInline: "calc( to-rem(16) / -2 )",
},
"@media screen and (min-width: to-em(768))": {
  ".ec-grid": {
    marginBlock: "calc( to-rem(24) / -2 )",
    marginInline: "calc( to-rem(24) / -2 )",
  },
},
".ec-grid--md > .ec-grid": {
  marginBlock: "calc( to-rem(24) / -2 )",
  marginInline: "calc( to-rem(24) / -2 )",
},
"@media screen and (min-width: to-em(1024))": {
  ".ec-grid": {
    marginBlock: "calc( to-rem(24) / -2 )",
    marginInline: "calc( to-rem(24) / -2 )",
  },
},
".ec-grid--lg > .ec-grid": {
  marginBlock: "calc( to-rem(24) / -2 )",
  marginInline: "calc( to-rem(24) / -2 )",
},
"@media screen and (min-width: to-em(1280))": {
  ".ec-grid": {
    marginBlock: "calc( to-rem(24) / -2 )",
    marginInline: "calc( to-rem(24) / -2 )",
  },
},
".ec-grid--xl > .ec-grid": {
  marginBlock: "calc( to-rem(24) / -2 )",
  marginInline: "calc( to-rem(24) / -2 )",
},
"@media screen and (min-width: to-em(1600))": {
  ".ec-grid": {
    marginBlock: "calc( to-rem(24) / -2 )",
    marginInline: "calc( to-rem(24) / -2 )",
  },
},
".ec-grid--xxl > .ec-grid": {
  marginBlock: "calc( to-rem(24) / -2 )",
  marginInline: "calc( to-rem(24) / -2 )",
},
"@media screen and (min-width: to-em(1920))": {
  ".ec-grid": {
    marginBlock: "calc( to-rem(24) / -2 )",
    marginInline: "calc( to-rem(24) / -2 )",
  },
},
".ec-grid--xxxl > .ec-grid": {
  marginBlock: "calc( to-rem(24) / -2 )",
  marginInline: "calc( to-rem(24) / -2 )",
},

".ec-grid__item": {
  flex: "1 1 0",
  paddingBlock: "calc( to-rem(16) / 2 )",
  paddingInline: "calc( to-rem(16) / 2 )",
},
".ec-grid__item--xs-1": {
  flexGrow: "0",
  flexBasis: "25%",
  maxWidth: "25%",
},
".ec-grid__item--xs-2": {
  flexGrow: "0",
  flexBasis: "50%",
  maxWidth: "50%",
},
".ec-grid__item--xs-3": {
  flexGrow: "0",
  flexBasis: "75%",
  maxWidth: "75%",
},
".ec-grid__item--xs-4": {
  flexGrow: "0",
  flexBasis: "100%",
  maxWidth: "100%",
},
".ec-grid--xs > .ec-grid__item": {
  paddingBlock: "calc( to-rem(16) / 2 )",
  paddingInline: "calc( to-rem(16) / 2 )",
},
".ec-grid--xs > .ec-grid__item--xs-1": {
  flexGrow: "0",
  flexBasis: "25%",
  maxWidth: "25%",
},
".ec-grid--xs > .ec-grid__item--xs-2": {
  flexGrow: "0",
  flexBasis: "50%",
  maxWidth: "50%",
},
".ec-grid--xs > .ec-grid__item--xs-3": {
  flexGrow: "0",
  flexBasis: "75%",
  maxWidth: "75%",
},
".ec-grid--xs > .ec-grid__item--xs-4": {
  flexGrow: "0",
  flexBasis: "100%",
  maxWidth: "100%",
},
"@media screen and (min-width: to-em(600))": {
  ".ec-grid__item": {
    paddingBlock: "calc( to-rem(16) / 2 )",
    paddingInline: "calc( to-rem(16) / 2 )",
  },
  ".ec-grid__item--sm-1": {
    flexGrow: "0",
    flexBasis: "12.5%",
    maxWidth: "12.5%",
  },
  ".ec-grid__item--sm-2": {
    flexGrow: "0",
    flexBasis: "25%",
    maxWidth: "25%",
  },
  ".ec-grid__item--sm-3": {
    flexGrow: "0",
    flexBasis: "37.5%",
    maxWidth: "37.5%",
  },
  ".ec-grid__item--sm-4": {
    flexGrow: "0",
    flexBasis: "50%",
    maxWidth: "50%",
  },
  ".ec-grid__item--sm-5": {
    flexGrow: "0",
    flexBasis: "62.5%",
    maxWidth: "62.5%",
  },
  ".ec-grid__item--sm-6": {
    flexGrow: "0",
    flexBasis: "75%",
    maxWidth: "75%",
  },
  ".ec-grid__item--sm-7": {
    flexGrow: "0",
    flexBasis: "87.5%",
    maxWidth: "87.5%",
  },
  ".ec-grid__item--sm-8": {
    flexGrow: "0",
    flexBasis: "100%",
    maxWidth: "100%",
  },
},
".ec-grid--sm > .ec-grid__item": {
  paddingBlock: "calc( to-rem(16) / 2 )",
  paddingInline: "calc( to-rem(16) / 2 )",
},
".ec-grid--sm > .ec-grid__item--sm-1": {
  flexGrow: "0",
  flexBasis: "12.5%",
  maxWidth: "12.5%",
},
".ec-grid--sm > .ec-grid__item--sm-2": {
  flexGrow: "0",
  flexBasis: "25%",
  maxWidth: "25%",
},
".ec-grid--sm > .ec-grid__item--sm-3": {
  flexGrow: "0",
  flexBasis: "37.5%",
  maxWidth: "37.5%",
},
".ec-grid--sm > .ec-grid__item--sm-4": {
  flexGrow: "0",
  flexBasis: "50%",
  maxWidth: "50%",
},
".ec-grid--sm > .ec-grid__item--sm-5": {
  flexGrow: "0",
  flexBasis: "62.5%",
  maxWidth: "62.5%",
},
".ec-grid--sm > .ec-grid__item--sm-6": {
  flexGrow: "0",
  flexBasis: "75%",
  maxWidth: "75%",
},
".ec-grid--sm > .ec-grid__item--sm-7": {
  flexGrow: "0",
  flexBasis: "87.5%",
  maxWidth: "87.5%",
},
".ec-grid--sm > .ec-grid__item--sm-8": {
  flexGrow: "0",
  flexBasis: "100%",
  maxWidth: "100%",
},
"@media screen and (min-width: to-em(768))": {
  ".ec-grid__item": {
    paddingBlock: "calc( to-rem(24) / 2 )",
    paddingInline: "calc( to-rem(24) / 2 )",
  },
  ".ec-grid__item--md-1": {
    flexGrow: "0",
    flexBasis: "12.5%",
    maxWidth: "12.5%",
  },
  ".ec-grid__item--md-2": {
    flexGrow: "0",
    flexBasis: "25%",
    maxWidth: "25%",
  },
  ".ec-grid__item--md-3": {
    flexGrow: "0",
    flexBasis: "37.5%",
    maxWidth: "37.5%",
  },
  ".ec-grid__item--md-4": {
    flexGrow: "0",
    flexBasis: "50%",
    maxWidth: "50%",
  },
  ".ec-grid__item--md-5": {
    flexGrow: "0",
    flexBasis: "62.5%",
    maxWidth: "62.5%",
  },
  ".ec-grid__item--md-6": {
    flexGrow: "0",
    flexBasis: "75%",
    maxWidth: "75%",
  },
  ".ec-grid__item--md-7": {
    flexGrow: "0",
    flexBasis: "87.5%",
    maxWidth: "87.5%",
  },
  ".ec-grid__item--md-8": {
    flexGrow: "0",
    flexBasis: "100%",
    maxWidth: "100%",
  },
},
".ec-grid--md > .ec-grid__item": {
  paddingBlock: "calc( to-rem(24) / 2 )",
  paddingInline: "calc( to-rem(24) / 2 )",
},
".ec-grid--md > .ec-grid__item--md-1": {
  flexGrow: "0",
  flexBasis: "12.5%",
  maxWidth: "12.5%",
},
".ec-grid--md > .ec-grid__item--md-2": {
  flexGrow: "0",
  flexBasis: "25%",
  maxWidth: "25%",
},
".ec-grid--md > .ec-grid__item--md-3": {
  flexGrow: "0",
  flexBasis: "37.5%",
  maxWidth: "37.5%",
},
".ec-grid--md > .ec-grid__item--md-4": {
  flexGrow: "0",
  flexBasis: "50%",
  maxWidth: "50%",
},
".ec-grid--md > .ec-grid__item--md-5": {
  flexGrow: "0",
  flexBasis: "62.5%",
  maxWidth: "62.5%",
},
".ec-grid--md > .ec-grid__item--md-6": {
  flexGrow: "0",
  flexBasis: "75%",
  maxWidth: "75%",
},
".ec-grid--md > .ec-grid__item--md-7": {
  flexGrow: "0",
  flexBasis: "87.5%",
  maxWidth: "87.5%",
},
".ec-grid--md > .ec-grid__item--md-8": {
  flexGrow: "0",
  flexBasis: "100%",
  maxWidth: "100%",
},
"@media screen and (min-width: to-em(1024))": {
  ".ec-grid__item": {
    paddingBlock: "calc( to-rem(24) / 2 )",
    paddingInline: "calc( to-rem(24) / 2 )",
  },
  ".ec-grid__item--lg-1": {
    flexGrow: "0",
    flexBasis: "8.3333333333%",
    maxWidth: "8.3333333333%",
  },
  ".ec-grid__item--lg-2": {
    flexGrow: "0",
    flexBasis: "16.6666666667%",
    maxWidth: "16.6666666667%",
  },
  ".ec-grid__item--lg-3": {
    flexGrow: "0",
    flexBasis: "25%",
    maxWidth: "25%",
  },
  ".ec-grid__item--lg-4": {
    flexGrow: "0",
    flexBasis: "33.3333333333%",
    maxWidth: "33.3333333333%",
  },
  ".ec-grid__item--lg-5": {
    flexGrow: "0",
    flexBasis: "41.6666666667%",
    maxWidth: "41.6666666667%",
  },
  ".ec-grid__item--lg-6": {
    flexGrow: "0",
    flexBasis: "50%",
    maxWidth: "50%",
  },
  ".ec-grid__item--lg-7": {
    flexGrow: "0",
    flexBasis: "58.3333333333%",
    maxWidth: "58.3333333333%",
  },
  ".ec-grid__item--lg-8": {
    flexGrow: "0",
    flexBasis: "66.6666666667%",
    maxWidth: "66.6666666667%",
  },
  ".ec-grid__item--lg-9": {
    flexGrow: "0",
    flexBasis: "75%",
    maxWidth: "75%",
  },
  ".ec-grid__item--lg-10": {
    flexGrow: "0",
    flexBasis: "83.3333333333%",
    maxWidth: "83.3333333333%",
  },
  ".ec-grid__item--lg-11": {
    flexGrow: "0",
    flexBasis: "91.6666666667%",
    maxWidth: "91.6666666667%",
  },
  ".ec-grid__item--lg-12": {
    flexGrow: "0",
    flexBasis: "100%",
    maxWidth: "100%",
  },
},
".ec-grid--lg > .ec-grid__item": {
  paddingBlock: "calc( to-rem(24) / 2 )",
  paddingInline: "calc( to-rem(24) / 2 )",
},
".ec-grid--lg > .ec-grid__item--lg-1": {
  flexGrow: "0",
  flexBasis: "8.3333333333%",
  maxWidth: "8.3333333333%",
},
".ec-grid--lg > .ec-grid__item--lg-2": {
  flexGrow: "0",
  flexBasis: "16.6666666667%",
  maxWidth: "16.6666666667%",
},
".ec-grid--lg > .ec-grid__item--lg-3": {
  flexGrow: "0",
  flexBasis: "25%",
  maxWidth: "25%",
},
".ec-grid--lg > .ec-grid__item--lg-4": {
  flexGrow: "0",
  flexBasis: "33.3333333333%",
  maxWidth: "33.3333333333%",
},
".ec-grid--lg > .ec-grid__item--lg-5": {
  flexGrow: "0",
  flexBasis: "41.6666666667%",
  maxWidth: "41.6666666667%",
},
".ec-grid--lg > .ec-grid__item--lg-6": {
  flexGrow: "0",
  flexBasis: "50%",
  maxWidth: "50%",
},
".ec-grid--lg > .ec-grid__item--lg-7": {
  flexGrow: "0",
  flexBasis: "58.3333333333%",
  maxWidth: "58.3333333333%",
},
".ec-grid--lg > .ec-grid__item--lg-8": {
  flexGrow: "0",
  flexBasis: "66.6666666667%",
  maxWidth: "66.6666666667%",
},
".ec-grid--lg > .ec-grid__item--lg-9": {
  flexGrow: "0",
  flexBasis: "75%",
  maxWidth: "75%",
},
".ec-grid--lg > .ec-grid__item--lg-10": {
  flexGrow: "0",
  flexBasis: "83.3333333333%",
  maxWidth: "83.3333333333%",
},
".ec-grid--lg > .ec-grid__item--lg-11": {
  flexGrow: "0",
  flexBasis: "91.6666666667%",
  maxWidth: "91.6666666667%",
},
".ec-grid--lg > .ec-grid__item--lg-12": {
  flexGrow: "0",
  flexBasis: "100%",
  maxWidth: "100%",
},
"@media screen and (min-width: to-em(1280))": {
  ".ec-grid__item": {
    paddingBlock: "calc( to-rem(24) / 2 )",
    paddingInline: "calc( to-rem(24) / 2 )",
  },
  ".ec-grid__item--xl-1": {
    flexGrow: "0",
    flexBasis: "8.3333333333%",
    maxWidth: "8.3333333333%",
  },
  ".ec-grid__item--xl-2": {
    flexGrow: "0",
    flexBasis: "16.6666666667%",
    maxWidth: "16.6666666667%",
  },
  ".ec-grid__item--xl-3": {
    flexGrow: "0",
    flexBasis: "25%",
    maxWidth: "25%",
  },
  ".ec-grid__item--xl-4": {
    flexGrow: "0",
    flexBasis: "33.3333333333%",
    maxWidth: "33.3333333333%",
  },
  ".ec-grid__item--xl-5": {
    flexGrow: "0",
    flexBasis: "41.6666666667%",
    maxWidth: "41.6666666667%",
  },
  ".ec-grid__item--xl-6": {
    flexGrow: "0",
    flexBasis: "50%",
    maxWidth: "50%",
  },
  ".ec-grid__item--xl-7": {
    flexGrow: "0",
    flexBasis: "58.3333333333%",
    maxWidth: "58.3333333333%",
  },
  ".ec-grid__item--xl-8": {
    flexGrow: "0",
    flexBasis: "66.6666666667%",
    maxWidth: "66.6666666667%",
  },
  ".ec-grid__item--xl-9": {
    flexGrow: "0",
    flexBasis: "75%",
    maxWidth: "75%",
  },
  ".ec-grid__item--xl-10": {
    flexGrow: "0",
    flexBasis: "83.3333333333%",
    maxWidth: "83.3333333333%",
  },
  ".ec-grid__item--xl-11": {
    flexGrow: "0",
    flexBasis: "91.6666666667%",
    maxWidth: "91.6666666667%",
  },
  ".ec-grid__item--xl-12": {
    flexGrow: "0",
    flexBasis: "100%",
    maxWidth: "100%",
  },
},
".ec-grid--xl > .ec-grid__item": {
  paddingBlock: "calc( to-rem(24) / 2 )",
  paddingInline: "calc( to-rem(24) / 2 )",
},
".ec-grid--xl > .ec-grid__item--xl-1": {
  flexGrow: "0",
  flexBasis: "8.3333333333%",
  maxWidth: "8.3333333333%",
},
".ec-grid--xl > .ec-grid__item--xl-2": {
  flexGrow: "0",
  flexBasis: "16.6666666667%",
  maxWidth: "16.6666666667%",
},
".ec-grid--xl > .ec-grid__item--xl-3": {
  flexGrow: "0",
  flexBasis: "25%",
  maxWidth: "25%",
},
".ec-grid--xl > .ec-grid__item--xl-4": {
  flexGrow: "0",
  flexBasis: "33.3333333333%",
  maxWidth: "33.3333333333%",
},
".ec-grid--xl > .ec-grid__item--xl-5": {
  flexGrow: "0",
  flexBasis: "41.6666666667%",
  maxWidth: "41.6666666667%",
},
".ec-grid--xl > .ec-grid__item--xl-6": {
  flexGrow: "0",
  flexBasis: "50%",
  maxWidth: "50%",
},
".ec-grid--xl > .ec-grid__item--xl-7": {
  flexGrow: "0",
  flexBasis: "58.3333333333%",
  maxWidth: "58.3333333333%",
},
".ec-grid--xl > .ec-grid__item--xl-8": {
  flexGrow: "0",
  flexBasis: "66.6666666667%",
  maxWidth: "66.6666666667%",
},
".ec-grid--xl > .ec-grid__item--xl-9": {
  flexGrow: "0",
  flexBasis: "75%",
  maxWidth: "75%",
},
".ec-grid--xl > .ec-grid__item--xl-10": {
  flexGrow: "0",
  flexBasis: "83.3333333333%",
  maxWidth: "83.3333333333%",
},
".ec-grid--xl > .ec-grid__item--xl-11": {
  flexGrow: "0",
  flexBasis: "91.6666666667%",
  maxWidth: "91.6666666667%",
},
".ec-grid--xl > .ec-grid__item--xl-12": {
  flexGrow: "0",
  flexBasis: "100%",
  maxWidth: "100%",
},
"@media screen and (min-width: to-em(1600))": {
  ".ec-grid__item": {
    paddingBlock: "calc( to-rem(24) / 2 )",
    paddingInline: "calc( to-rem(24) / 2 )",
  },
  ".ec-grid__item--xxl-1": {
    flexGrow: "0",
    flexBasis: "8.3333333333%",
    maxWidth: "8.3333333333%",
  },
  ".ec-grid__item--xxl-2": {
    flexGrow: "0",
    flexBasis: "16.6666666667%",
    maxWidth: "16.6666666667%",
  },
  ".ec-grid__item--xxl-3": {
    flexGrow: "0",
    flexBasis: "25%",
    maxWidth: "25%",
  },
  ".ec-grid__item--xxl-4": {
    flexGrow: "0",
    flexBasis: "33.3333333333%",
    maxWidth: "33.3333333333%",
  },
  ".ec-grid__item--xxl-5": {
    flexGrow: "0",
    flexBasis: "41.6666666667%",
    maxWidth: "41.6666666667%",
  },
  ".ec-grid__item--xxl-6": {
    flexGrow: "0",
    flexBasis: "50%",
    maxWidth: "50%",
  },
  ".ec-grid__item--xxl-7": {
    flexGrow: "0",
    flexBasis: "58.3333333333%",
    maxWidth: "58.3333333333%",
  },
  ".ec-grid__item--xxl-8": {
    flexGrow: "0",
    flexBasis: "66.6666666667%",
    maxWidth: "66.6666666667%",
  },
  ".ec-grid__item--xxl-9": {
    flexGrow: "0",
    flexBasis: "75%",
    maxWidth: "75%",
  },
  ".ec-grid__item--xxl-10": {
    flexGrow: "0",
    flexBasis: "83.3333333333%",
    maxWidth: "83.3333333333%",
  },
  ".ec-grid__item--xxl-11": {
    flexGrow: "0",
    flexBasis: "91.6666666667%",
    maxWidth: "91.6666666667%",
  },
  ".ec-grid__item--xxl-12": {
    flexGrow: "0",
    flexBasis: "100%",
    maxWidth: "100%",
  },
},
".ec-grid--xxl > .ec-grid__item": {
  paddingBlock: "calc( to-rem(24) / 2 )",
  paddingInline: "calc( to-rem(24) / 2 )",
},
".ec-grid--xxl > .ec-grid__item--xxl-1": {
  flexGrow: "0",
  flexBasis: "8.3333333333%",
  maxWidth: "8.3333333333%",
},
".ec-grid--xxl > .ec-grid__item--xxl-2": {
  flexGrow: "0",
  flexBasis: "16.6666666667%",
  maxWidth: "16.6666666667%",
},
".ec-grid--xxl > .ec-grid__item--xxl-3": {
  flexGrow: "0",
  flexBasis: "25%",
  maxWidth: "25%",
},
".ec-grid--xxl > .ec-grid__item--xxl-4": {
  flexGrow: "0",
  flexBasis: "33.3333333333%",
  maxWidth: "33.3333333333%",
},
".ec-grid--xxl > .ec-grid__item--xxl-5": {
  flexGrow: "0",
  flexBasis: "41.6666666667%",
  maxWidth: "41.6666666667%",
},
".ec-grid--xxl > .ec-grid__item--xxl-6": {
  flexGrow: "0",
  flexBasis: "50%",
  maxWidth: "50%",
},
".ec-grid--xxl > .ec-grid__item--xxl-7": {
  flexGrow: "0",
  flexBasis: "58.3333333333%",
  maxWidth: "58.3333333333%",
},
".ec-grid--xxl > .ec-grid__item--xxl-8": {
  flexGrow: "0",
  flexBasis: "66.6666666667%",
  maxWidth: "66.6666666667%",
},
".ec-grid--xxl > .ec-grid__item--xxl-9": {
  flexGrow: "0",
  flexBasis: "75%",
  maxWidth: "75%",
},
".ec-grid--xxl > .ec-grid__item--xxl-10": {
  flexGrow: "0",
  flexBasis: "83.3333333333%",
  maxWidth: "83.3333333333%",
},
".ec-grid--xxl > .ec-grid__item--xxl-11": {
  flexGrow: "0",
  flexBasis: "91.6666666667%",
  maxWidth: "91.6666666667%",
},
".ec-grid--xxl > .ec-grid__item--xxl-12": {
  flexGrow: "0",
  flexBasis: "100%",
  maxWidth: "100%",
},
"@media screen and (min-width: to-em(1920))": {
  ".ec-grid__item": {
    paddingBlock: "calc( to-rem(24) / 2 )",
    paddingInline: "calc( to-rem(24) / 2 )",
  },
  ".ec-grid__item--xxxl-1": {
    flexGrow: "0",
    flexBasis: "8.3333333333%",
    maxWidth: "8.3333333333%",
  },
  ".ec-grid__item--xxxl-2": {
    flexGrow: "0",
    flexBasis: "16.6666666667%",
    maxWidth: "16.6666666667%",
  },
  ".ec-grid__item--xxxl-3": {
    flexGrow: "0",
    flexBasis: "25%",
    maxWidth: "25%",
  },
  ".ec-grid__item--xxxl-4": {
    flexGrow: "0",
    flexBasis: "33.3333333333%",
    maxWidth: "33.3333333333%",
  },
  ".ec-grid__item--xxxl-5": {
    flexGrow: "0",
    flexBasis: "41.6666666667%",
    maxWidth: "41.6666666667%",
  },
  ".ec-grid__item--xxxl-6": {
    flexGrow: "0",
    flexBasis: "50%",
    maxWidth: "50%",
  },
  ".ec-grid__item--xxxl-7": {
    flexGrow: "0",
    flexBasis: "58.3333333333%",
    maxWidth: "8.3333333333%",
  },
  ".ec-grid__item--xxxl-8": {
    flexGrow: "0",
    flexBasis: "66.6666666667%",
    maxWidth: "66.6666666667%",
  },
  ".ec-grid__item--xxxl-9": {
    flexGrow: "0",
    flexBasis: "75%",
    maxWidth: "75%",
  },
  ".ec-grid__item--xxxl-10": {
    flexGrow: "0",
    flexBasis: "83.3333333333%",
    maxWidth: "83.3333333333%",
  },
  ".ec-grid__item--xxxl-11": {
    flexGrow: "0",
    flexBasis: "91.6666666667%",
    maxWidth: "91.6666666667%",
  },
  ".ec-grid__item--xxxl-12": {
    flexGrow: "0",
    flexBasis: "100%",
    maxWidth: "100%",
  },
},
".ec-grid--xxxl > .ec-grid__item": {
  paddingBlock: "calc( to-rem(24) / 2 )",
  paddingInline: "calc( to-rem(24) / 2 )",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-1": {
  flexGrow: "0",
  flexBasis: "8.3333333333%",
  maxWidth: "8.3333333333%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-2": {
  flexGrow: "0",
  flexBasis: "16.6666666667%",
  maxWidth: "16.6666666667%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-3": {
  flexGrow: "0",
  flexBasis: "25%",
  maxWidth: "25%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-4": {
  flexGrow: "0",
  flexBasis: "33.3333333333%",
  maxWidth: "33.3333333333%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-5": {
  flexGrow: "0",
  flexBasis: "41.6666666667%",
  maxWidth: "41.6666666667%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-6": {
  flexGrow: "0",
  flexBasis: "50%",
  maxWidth: "50%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-7": {
  flexGrow: "0",
  flexBasis: "58.3333333333%",
  maxWidth: "58.3333333333%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-8": {
  flexGrow: "0",
  flexBasis: "66.6666666667%",
  maxWidth: "66.6666666667%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-9": {
  flexGrow: "0",
  flexBasis: "75%",
  maxWidth: "75%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-10": {
  flexGrow: "0",
  flexBasis: "83.3333333333%",
  maxWidth: "83.3333333333%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-11": {
  flexGrow: "0",
  flexBasis: "91.6666666667%",
  maxWidth: "91.6666666667%",
},
".ec-grid--xxxl > .ec-grid__item--xxxl-12": {
  flexGrow: "0",
  flexBasis: "100%",
  maxWidth: "100%",
},

}

export default gridStyles;