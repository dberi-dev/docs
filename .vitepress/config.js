import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Dberi',
  description: 'Caribbean Payment Platform - Make money move as fast as ideas',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Dberi Docs',

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    editLink: {
      pattern: 'https://github.com/dberi-dev/docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    },

    nav: [
      { text: 'Documentation', link: '/' },
      { text: 'API Reference', link: '/api/overview' }
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quickstart', link: '/quickstart' },
          { text: 'Authentication', link: '/authentication' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Accept Payments', link: '/guides/accept-payments' },
          { text: 'Payment Links', link: '/guides/payment-links' },
          { text: 'QR Code Payments', link: '/guides/qr-payments' },
          { text: 'Webhooks', link: '/guides/webhooks' },
          { text: 'Error Handling', link: '/guides/errors' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Overview', link: '/api/overview' },
          { text: 'Merchants', link: '/api/merchants' },
          { text: 'Products', link: '/api/products' },
          { text: 'Payments', link: '/api/payments' },
          { text: 'Payment Links', link: '/api/payment-links' },
          { text: 'Webhooks', link: '/api/webhooks' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dberi-dev/docs' }
    ],

    footer: {
      message: 'Built for the Caribbean, powered by innovation',
      copyright: 'Copyright © 2026 Dberi'
    }
  }
})
