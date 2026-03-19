import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Dberi',
  description: 'Bahamian Payment Platform - Make money move as fast as ideas',

  themeConfig: {
    logo: '/logo.svg',

    search: {
      provider: 'local'
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
        text: 'Core Concepts',
        items: [
          { text: 'How It Works', link: '/concepts/how-it-works' },
          { text: 'Payment Modes', link: '/concepts/payment-modes' },
          { text: 'Payment Flow', link: '/concepts/payment-flow' },
          { text: 'Settlement', link: '/concepts/settlement' }
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
      { icon: 'github', link: 'https://github.com/yourusername/dberi' }
    ],

    footer: {
      message: 'Built for the Bahamas, powered by innovation',
      copyright: 'Copyright © 2026 Dberi'
    }
  }
})
