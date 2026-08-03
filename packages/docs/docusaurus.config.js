// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Embedded Chat",
  tagline:
    "An easy-to-use, full-stack component (React.js + backend behaviors) for embedding Rocket.Chat into your web app.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://rocketchat.github.io/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.DOCS_BASE_URL || "/EmbeddedChat/docs/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "RocketChat", // Usually your GitHub org/user name.
  projectName: "EmbeddedChat", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Embedded Chat",
        logo: {
          alt: "My Site Logo",
          src: "img/EC-Logo.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorial",
          },
          { to: "/blog", label: "Blogs", position: "left" },
          {
            href: "https://github.com/RocketChat/EmbeddedChat",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Company",
            items: [
              {
                label: "About Rocket.Chat",
                href: "https://www.rocket.chat/about",
              },
              {
                label: "Careers",
                href: "https://www.rocket.chat/careers",
              },
              {
                label: "Contact",
                href: "https://www.rocket.chat/contact",
              },
            ],
          },
          {
            title: "Platform",
            items: [
              {
                label: "Embedded Chat",
                to: "/",
              },
              {
                label: "Rocket.Chat Server",
                href: "https://www.rocket.chat/docs",
              },
            ],
          },
          {
            title: "Resources",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "Community",
                href: "https://open.rocket.chat/",
              },
            ],
          },
          {
            title: "Social",
            items: [
              {
                label: "Twitter",
                href: "https://x.com/rocketchat",
              },
              {
                label: "GitHub",
                href: "https://github.com/RocketChat/EmbeddedChat",
              },
            ],
          },
        ],
        logo: {
          alt: "Rocket.Chat Logo",
          src: "img/rocketchat-logo-white-v2.png",
          href: "https://www.rocket.chat",
          width: 160,
        },
        copyright: `Copyright © ${new Date().getFullYear()} Rocket.Chat Technologies Corp.`,
      },
    colorMode: {
     defaultMode: 'light',
     disableSwitch: false,
     respectPrefersColorScheme: true, 
    },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
