# Getting Started with Dberi

Welcome to Dberi! This guide will help you start accepting payments in the Bahamas.

## What is Dberi?

Dberi is a payment platform built for Bahamian businesses. Accept payments from customers using:
- Credit and debit cards
- Mobile wallets
- QR code payments

## For Merchants (Non-Technical)

### Step 1: Sign Up

Contact us to create your merchant account:
- **Email**: sales@dberi.com
- **Phone**: +1-242-XXX-XXXX

We'll help you get verified and set up.

### Step 2: Get Your Hardware

We provide everything you need:
- **Dberi POS Terminal** - Accept payments in-store
- **QR Code Stands** - Let customers scan to pay
- **Training** - We'll show you how to use everything

### Step 3: Add Your Products

Log into your merchant dashboard to:
1. Add your menu items or products
2. Set prices
3. Upload photos
4. Organize by category

### Step 4: Start Accepting Payments

That's it! You're ready to accept payments:
- **In-Person**: Use your POS terminal or QR codes
- **Online**: Send payment links to customers
- **On-the-Go**: Accept payments anywhere

## For Developers (Technical)

If you're building a custom integration, you'll need:

### 1. Create Merchant Account via API

```bash
curl -X POST https://api.dberi.com/v1/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Business",
    "slug": "yourbusiness",
    "category": "retail",
    "email": "hello@yourbusiness.com"
  }'
```

### 2. Get API Keys

Your merchant account includes:
- **Test Key** (`sk_test_...`) - For development
- **Live Key** (`sk_live_...`) - For production

### 3. Integrate Payments

Choose your integration method:
- [Accept Payments API](/guides/accept-payments) - Full API integration
- [Payment Links](/guides/payment-links) - No-code payment links
- [QR Code Payments](/guides/qr-payments) - Custom QR implementation
- [Webhooks](/guides/webhooks) - Real-time payment notifications

## Payment Fees

Dberi charges a simple, transparent fee:
- **2% per transaction** (for transactions over $20)
- **$20 minimum** transaction amount

Funds settle to your merchant wallet instantly after payment.

## Getting Help

### Documentation
- [Merchants API](/api/merchants) - Manage your account
- [Products API](/api/products) - Manage your catalog
- [Payments API](/api/payments) - Accept payments

### Support
- **Email**: support@dberi.com
- **Developer Docs**: docs.dberi.com
- **API Status**: status.dberi.com (coming soon)

## Next Steps

### For Merchants
1. Contact sales to get your POS hardware
2. Set up your product catalog
3. Start accepting payments

### For Developers
1. [Accept Payments Guide](/guides/accept-payments)
2. [Products API](/api/products)
3. [Webhook Integration](/guides/webhooks)

---

**Ready to start?** Contact sales@dberi.com to get your Dberi POS system or API credentials.
