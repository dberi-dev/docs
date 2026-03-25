import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Dberi',
  description: 'Bahamian Payment Platform - Make money move as fast as ideas',

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
        text: 'Get Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Quickstart', link: '/quickstart' },
          { text: 'Authentication', link: '/authentication' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Overview', link: '/api/overview' },
          { text: 'Merchants', link: '/api/merchants' },
          { text: 'Payments', link: '/api/payments' },
          { text: 'Payment Links', link: '/api/payment-links' },
          { text: 'Webhooks', link: '/api/webhooks' }
        ]
      },
      {
        text: 'Integration Guides',
        items: [
          { text: 'Accept Payments', link: '/guides/accept-payments' },
          { text: 'Payment Links', link: '/guides/payment-links' },
          { text: 'QR Code Payments', link: '/guides/qr-payments' },
          { text: 'Webhook Integration', link: '/guides/webhooks' },
          { text: 'Error Handling', link: '/guides/errors' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dberi-dev/docs' }
    ],

    footer: {
      message: 'Built for the Bahamas, powered by innovation',
      copyright: 'Copyright © 2026 Dberi'
    }
  }
})
