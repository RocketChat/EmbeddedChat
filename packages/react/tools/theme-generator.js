/* eslint-disable no-cond-assign */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Replace 'SampleTheme' with the name of your theme
const themeName = 'SampleTheme';

function parseCSS(cssString) {
  const schemes = {
    light: {},
    dark: {},
  };

  const cssPattern =
    /(--[\w-]+):\s*([\d.]+)\s+([\d.]+%)\s+([\d.]+%|[\d.]+rem);/g;
  const themePattern = /\.([\w-]+)\s*{([^}]*)}/g;

  const rootProperties = cssString.match(/:root\s*{([^}]*)}/)[1];
  let rootMatch;

  while ((rootMatch = cssPattern.exec(rootProperties)) !== null) {
    const [, prop, h, s, l] = rootMatch;
    const camelCaseProp = prop
      .substring(2)
      .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
    schemes.light[camelCaseProp] = `hsl(${h}, ${s}, ${l})`;
  }

  let themeMatch;
  while ((themeMatch = themePattern.exec(cssString)) !== null) {
    const [, theme, properties] = themeMatch;
    let propertyMatch;
    while ((propertyMatch = cssPattern.exec(properties)) !== null) {
      const [, prop, h, s, l] = propertyMatch;
      const camelCaseProp = prop
        .substring(2)
        .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
      schemes[theme][camelCaseProp] = `hsl(${h}, ${s}, ${l})`;
    }
  }

  return { schemes };
}

// Replace cssString with your exported ShadnCn Theme
const cssString = `



:root  {
  --background: 252.5 0% 100%;
  --foreground: 252.5 0% 10%;
  --card: 252.5 0% 100%;
  --card-foreground: 252.5 0% 15%;
  --popover: 252.5 0% 100%;
  --popover-foreground: 252.5 95% 10%;
  --primary: 252.5 94.7% 85.1%;
  --primary-foreground: 0 0% 0%;
  --secondary: 252.5 10% 90%;
  --secondary-foreground: 0 0% 0%;
  --muted: 214.5 10% 95%;
  --muted-foreground: 252.5 0% 40%;
  --accent: 214.5 10% 90%;
  --accent-foreground: 252.5 0% 15%;
  --destructive: 0 50% 50%;
  --destructive-foreground: 252.5 0% 100%;
  --border: 252.5 20% 82%;
  --input: 252.5 20% 50%;
  --ring: 252.5 94.7% 85.1%;
  --radius: 1rem;
}
.dark  {
  --background: 252.5 10% 10%;
  --foreground: 252.5 0% 100%;
  --card: 252.5 0% 10%;
  --card-foreground: 252.5 0% 100%;
  --popover: 252.5 10% 5%;
  --popover-foreground: 252.5 0% 100%;
  --primary: 252.5 94.7% 85.1%;
  --primary-foreground: 0 0% 0%;
  --secondary: 252.5 10% 20%;
  --secondary-foreground: 0 0% 100%;
  --muted: 214.5 10% 25%;
  --muted-foreground: 252.5 0% 65%;
  --accent: 214.5 10% 25%;
  --accent-foreground: 252.5 0% 95%;
  --destructive: 0 50% 50%;
  --destructive-foreground: 252.5 0% 100%;
  --border: 252.5 20% 50%;
  --input: 252.5 20% 50%;
  --ring: 252.5 94.7% 85.1%;
  --radius: 1rem;
}


`;

// Add hardcoded colors and other properties
const otherProps = {
  radius: '0.2rem',
  commonColors: {
    black: 'hsl(0, 0%, 0%)',
    white: 'hsl(0, 0%, 100%)',
  },
  light: {
    warning: 'hsl(38, 92%, 50%)',
    warningForeground: 'hsl(48, 96%, 89%)',
    success: 'hsl(91, 60.4%, 81.2%)',
    successForeground: 'hsl(90, 61.1%, 14.1%)',
    info: 'hsl(214, 76.4%, 50.2%)',
    infoForeground: 'hsl(214.3, 77.8%, 92.9%)',
  },
  dark: {
    warning: 'hsl(48, 96%, 89%)',
    warningForeground: 'hsl(38, 92%, 50%)',
    success: 'hsl(90, 61.1%, 14.1%)',
    successForeground: 'hsl(90, 60%, 90.2%)',
    info: 'hsl(214.3, 77.8%, 92.9%)',
    infoForeground: 'hsl(214.4, 75.8%, 19.4%)',
  },
  typography: {
    default: {
      fontFamily: "'Times New Roman', serif",
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
    h1: {
      fontSize: '2.625rem',
      fontWeight: 800,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 800,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  },
  shadows: [
    'none',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  ],
};

const themeObject = parseCSS(cssString);
themeObject.commonColors = otherProps.commonColors;
themeObject.schemes.light = {
  ...themeObject.schemes.light,
  ...otherProps.light,
};
themeObject.schemes.dark = {
  ...themeObject.schemes.dark,
  ...otherProps.dark,
};
themeObject.radius = otherProps.radius;
themeObject.typography = otherProps.typography;
themeObject.shadows = otherProps.shadows;
themeObject.zIndex = otherProps.zIndex;

const themeObjectString = `const ${themeName} = ${JSON.stringify(
  themeObject,
  null,
  4
)};
export default ${themeName};`;

const themePath = path.join(__dirname, `../src/theme/${themeName}.js`);

if (!fs.existsSync(themePath)) {
  console.log('Theme file created successfully.');
} else {
  console.log('Theme file already exists.');
}

fs.writeFileSync(themePath, themeObjectString);

execSync(`npx prettier --write '${themePath}'`);
console.log('Theme file formatted successfully.');
