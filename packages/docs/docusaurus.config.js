// @ts-check
const { themes } = require('prism-react-renderer')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Casual UI - React',
  tagline: 'A ui components lib that supports for React17+',
  url: 'https://react.casual-ui.site',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'logo.png',
  organizationName: 'Blackman99',
  projectName: 'casual-ui-react',
  githubHost: 'github.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-6X1YBPZXL2',
        },
        docs: {
          sidebarCollapsed: false,
          routeBasePath: '/',
          sidebarPath: require.resolve('./config/sidebars.js'),
          editUrl:
            'https://github.com/Casual-UI/react/edit/main/packages/docs',
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/styles/doc.scss'),
            require.resolve('@casual-ui/styles/src/index.scss'),
          ],
        },
      }),
    ],
  ],
  plugins: ['@docusaurus/theme-live-codeblock', 'docusaurus-plugin-sass', './plugins/casual-components-doc'],
  themes: [],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Casual UI - React',
        logo: {
          alt: 'Casual UI Logo',
          src: 'logo.png',
          srcDark: 'logo.png',
        },
        items: [
          {
            position: 'right',
            label: 'Guide',
            type: 'dropdown',
            items: [
              {
                label: 'Install',
                to: '/guide/install',
              },
              {
                to: 'guide/theme-customize',
                label: 'Theme customization',
              },
              {
                to: 'guide/dark-mode',
                label: 'Dark mode',
              },
              {
                to: 'guide/i18n',
                label: 'I18n',
              },
            ],
          },
          {
            position: 'right',
            label: 'Features',
            type: 'dropdown',
            items: [
              {
                label: 'CSS Utils',
                to: '/style/global-util/',
              },
              {
                label: 'Components',
                to: '/components/basic/button',
              },
              {
                label: 'Hooks API',
                to: '/hooks/',
              },
            ],
          },
          {
            position: 'right',
            label: 'More',
            type: 'dropdown',
            items: [
              {
                label: 'Casual UI - Vue',
                to: 'https://vue.casual-ui.site/',
              },
              {
                label: 'Casual UI - Svelte',
                to: 'https://svelte.casual-ui.site/',
              },
            ],
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            'href': 'https://github.com/Casual-UI/react',
            'position': 'right',
            'className': 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Guide',
            items: [
              {
                label: 'Install',
                to: '/guide/install',
              },
            ],
          },
          {
            title: 'Components',
          },
          {
            title: 'More',
            items: [
              {
                label: 'Github',
                href: 'https://github.com/Blackman99/casual-ui.git',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Casual UI.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
      },
      liveCodeBlock: {
        playgroundPosition: 'top',
      },
      showLastUpdateTime: true,
      algolia: {
        apiKey: 'e4cde0eff4725059b13ad81010ace04b',
        appId: '79D0K7AVBK',
        indexName: 'casual-ui',
        contextualSearch: false,
      },
      docs: {
        sidebar: { autoCollapseCategories: false },
      },
    }),
}

module.exports = config
