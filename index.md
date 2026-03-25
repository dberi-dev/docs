# Introduction

Welcome to the Dberi Payment Platform API documentation

## Overview

The Dberi Payment Platform is a comprehensive payment solution built for Caribbean businesses, offering seamless integration for handling payments, managing merchant accounts, and processing transactions with built-in compliance and real-time analytics.

## Getting Started

Our REST API makes it simple to integrate Dberi:

```bash
# Create a payment session
curl -X POST https://api.dberi.com/v1/payments \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "currency": "BSD",
    "description": "Order #1234"
  }'
```

The API returns a checkout URL where your customer completes payment securely.

## What You Can Build

- **E-commerce Platforms** - Accept payments for online stores
- **Mobile Applications** - Process in-app payments
- **Marketplaces** - Handle payments between buyers and sellers
- **Subscription Services** - Manage recurring billing
- **QR Code Payments** - Generate payment QR codes for in-person transactions

## Getting Started

1. **Create a merchant account** via the API or contact sales
2. **Get your API keys** (test and live)
3. **Integrate the API** using our quickstart guide
4. **Test your integration** in test mode
5. **Go live** and start accepting payments

See the [Quickstart Guide](/quickstart) for step-by-step instructions.

## Core Features

- **Multiple Payment Modes** - DYNAMIC_PAY, STATIC_PAY, ORDER_PAY, INVOICE_PAY, REFERENCE_PAY
- **Automatic Verification** - Built-in PIN and biometric verification based on transaction amount
- **Instant Settlement** - Funds settle to merchant wallet in real-time
- **Webhook Notifications** - Real-time events for payment updates
- **Product Catalog Management** - Manage your menu items and products via API

## API Endpoints

- **[Merchants API](/api/merchants)** - Create and manage merchant accounts
- **[Products API](/api/products)** - Manage product catalogs and menu items
- **[Payments API](/api/payments)** - Create and process payments
- **[Payment Links API](/api/payment-links)** - Generate shareable payment links
- **[Webhooks API](/api/webhooks)** - Configure real-time event notifications

## Support

- **Documentation**: [docs.dberi.com](https://docs.dberi.com)
- **Email**: support@dberi.com
- **GitHub**: [github.com/dberi-dev](https://github.com/dberi-dev)
