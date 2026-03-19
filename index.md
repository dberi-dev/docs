# Introduction

Dberi is a payment processing platform built for the Bahamas, enabling businesses to accept payments from customers through credit cards, debit cards, and mobile wallets.

## What is Dberi?

Dberi provides payment infrastructure for Bahamian businesses - think of it like Stripe or Square, but built specifically for BSD transactions and the Bahamian market. When your customers check out on your website or app, they can pay using Dberi.

### For Businesses

Integrate Dberi into your platform to accept payments from customers:

- **E-commerce websites** - Add Dberi as a payment option at checkout
- **Mobile apps** - Let users pay with Dberi in your app
- **Marketplaces** - Enable payments between buyers and sellers
- **Subscription services** - Accept recurring payments

### For Developers

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

## Key Features

### Built for the Bahamas

Native BSD support with local payment methods and instant settlement for Bahamian businesses.

### Accept All Payment Types

Credit cards, debit cards, mobile wallets, and QR code payments - all in one integration.

### Simple Integration

Add checkout to your website or app in minutes with our REST API and hosted checkout pages.

### Secure & Compliant

PCI-compliant card storage, fraud detection, and secure payment processing built-in.

### Instant Settlement

Get paid faster with real-time settlement to your merchant wallet and automated payouts to your bank account.

### Complete Analytics

Track sales, refunds, and customer payments with detailed transaction reports.

## How It Works

When you integrate Dberi, you're adding us as a payment method - just like how Uber lets customers pay with Visa, Apple Pay, or other options. Your customers can choose Dberi at checkout.

### Integration Flow

1. **Your server creates a payment session** via our API
2. **Customer completes payment** on our secure checkout page
3. **We notify your server** when payment succeeds
4. **You fulfill the order** - ship products, grant access, etc.
5. **Funds settle** to your merchant wallet instantly

```javascript
// Example: Add Dberi at checkout
const payment = await fetch('https://api.dberi.com/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 2500, // $25.00 in cents
    currency: 'BSD',
    description: 'Premium Subscription'
  })
})

const { hosted_url } = await payment.json()

// Redirect customer to Dberi checkout
window.location.href = `https://dberi.com${hosted_url}`
```

## Getting Started

### 1. Create Merchant Account

Sign up for a Dberi merchant account to get your API credentials:

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

After registration, you'll receive:
- **Test API key** (`sk_test_...`) for development
- **Live API key** (`sk_live_...`) for production

### 3. Integrate Checkout

Follow our [Quickstart Guide](/quickstart) to integrate Dberi checkout into your platform in under 10 minutes.

### 4. Go Live

Complete merchant verification, test your integration, then start accepting real payments.

## Payment Modes

Choose the integration style that fits your use case:

| Mode | Best For |
|------|----------|
| **DYNAMIC_PAY** | Standard checkout - one payment per session |
| **STATIC_PAY** | Reusable QR codes (for Dberi's own terminals) |
| **ORDER_PAY** | Shopping carts with line items |
| **INVOICE_PAY** | B2B invoicing with due dates |
| **REFERENCE_PAY** | Payments with custom tracking codes |

See [Payment Modes](/concepts/payment-modes) for detailed usage.

## Verification & Security

Payments automatically require verification based on amount:

| Amount | Verification Required |
|--------|----------------------|
| ≤ $2.00 | None - instant approval |
| $2.01 - $50.00 | PIN (4-6 digits) |
| > $50.00 | Face ID / Biometric |

This is handled automatically by our checkout page - no extra work needed.

## Use Cases

### E-commerce Checkout

Add Dberi as a payment option alongside credit cards:

```javascript
// Show payment methods at checkout
<PaymentMethods>
  <CreditCard />
  <ApplePay />
  <Dberi /> {/*  Add Dberi here */}
</PaymentMethods>
```

### Mobile App Payments

Let users pay with Dberi in your mobile app:

```swift
// iOS example
let payment = try await Dberi.createPayment(
  amount: 2500,
  description: "Premium Upgrade"
)

// Show Dberi checkout
present(DberiCheckoutViewController(payment: payment))
```

### Subscription Billing

Accept recurring payments for memberships:

```javascript
// Create monthly subscription payment
const subscription = await createPayment({
  amount: 999, // $9.99/month
  description: "Monthly Membership",
  metadata: {
    subscription_id: "sub_12345",
    billing_cycle: "monthly"
  }
})
```

### Payment Links

Generate shareable payment links for invoices:

```javascript
const link = await fetch('https://api.dberi.com/v1/payment-links', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 50000,
    description: "Website Development Invoice"
  })
})

const { url } = await link.json()

// Send link to client via email
sendEmail(clientEmail, url)
```

## Next Steps

Ready to integrate Dberi?

- **[Quickstart Guide](/quickstart)** - Integrate checkout in 10 minutes
- **[API Reference](/api/overview)** - Complete API documentation
- **[Accept Payments Guide](/guides/accept-payments)** - Step-by-step integration
- **[Authentication](/authentication)** - API keys and security

## Support

Need help integrating?

- **Documentation**: [docs.dberi.com](https://docs.dberi.com)
- **Email**: support@dberi.com
- **API Status**: status.dberi.com (coming soon)

Start accepting payments today with Dberi - the payment platform built for the Bahamas.
