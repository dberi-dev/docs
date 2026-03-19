# Quickstart

Start accepting payments with Dberi in under 5 minutes.

## Prerequisites

- A Dberi merchant account
- curl or Postman for testing API calls
- Basic understanding of REST APIs

## Step 1: Create Your Merchant Account

Register your business with Dberi:

```bash
curl -X POST https://api.dberi.com/v1/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Business Name",
    "slug": "yourbusiness",
    "category": "retail",
    "email": "hello@yourbusiness.com"
  }'
```

**Response:**
```json
{
  "id": "merchant-550e8400-e29b-41d4-a716-446655440000",
  "name": "Your Business Name",
  "slug": "yourbusiness",
  "category": "retail",
  "email": "hello@yourbusiness.com",
  "created_at": "2026-03-19T10:00:00Z"
}
```

::: tip Save Your Merchant ID
You'll use `merchant_id` for all payment requests. Save it somewhere safe!
:::

## Step 2: Create a Payment Session

When a customer wants to pay, create a payment session:

```bash
curl -X POST https://api.dberi.com/v1/payments \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id": "merchant-550e8400-e29b-41d4-a716-446655440000",
    "amount": 2500,
    "currency": "BSD",
    "payment_mode": "DYNAMIC_PAY",
    "description": "Order #1234"
  }'
```

**Response:**
```json
{
  "id": "payment-abc123",
  "merchant_id": "merchant-550e8400-e29b-41d4-a716-446655440000",
  "amount": 2500,
  "currency": "BSD",
  "status": "created",
  "hosted_url": "/checkout/payment-abc123",
  "qr_payload": "dberi://pay/payment-abc123",
  "created_at": "2026-03-19T10:05:00Z",
  "expires_at": "2026-03-20T10:05:00Z"
}
```

::: info
Amounts are in cents! $25.00 = 2500 cents
:::

## Step 3: Show the Checkout Page

Send your customer to the checkout page:

```
https://yourdomain.com/checkout/payment-abc123
```

Or display the QR code for mobile payments:

```
dberi://pay/payment-abc123
```

Your customer can now complete the payment!

## Step 4: Check Payment Status

Check if the payment was completed:

```bash
curl https://api.dberi.com/v1/payments/payment-abc123
```

**Response:**
```json
{
  "id": "payment-abc123",
  "merchant_id": "merchant-550e8400-e29b-41d4-a716-446655440000",
  "amount": 2500,
  "currency": "BSD",
  "status": "completed",
  "completed_at": "2026-03-19T10:06:30Z"
}
```

## Payment Link Shortcut

For invoices or simple checkouts, use payment links:

```bash
curl -X POST https://api.dberi.com/v1/payment-links \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_slug": "yourbusiness",
    "amount": 5000,
    "description": "Invoice #5678"
  }'
```

**Response:**
```json
{
  "id": "link-xyz789",
  "url": "https://dberi.com/pay/yourbusiness/link-xyz789",
  "qr_code": "https://dberi.com/qr/link-xyz789"
}
```

Send this link to your customer via email, SMS, or social media!

## Complete Integration Example

Here's a complete checkout flow:

```bash
# 1. Create merchant account
MERCHANT=$(curl -X POST https://api.dberi.com/v1/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coffee Shop",
    "slug": "coffeeshop",
    "category": "restaurant",
    "email": "hello@coffeeshop.bs"
  }' | jq -r '.id')

echo "Merchant ID: $MERCHANT"

# 2. Customer orders a coffee ($7.50)
PAYMENT=$(curl -X POST https://api.dberi.com/v1/payments \
  -H "Content-Type: application/json" \
  -d "{
    \"merchant_id\": \"$MERCHANT\",
    \"amount\": 750,
    \"currency\": \"BSD\",
    \"payment_mode\": \"DYNAMIC_PAY\",
    \"description\": \"Large Latte\"
  }" | jq -r '.id')

echo "Payment ID: $PAYMENT"
echo "Checkout URL: /checkout/$PAYMENT"

# 3. Check payment status
curl https://api.dberi.com/v1/payments/$PAYMENT
```

## Payment Modes

Choose the right payment mode for your use case:

| Mode | Use Case |
|------|----------|
| `DYNAMIC_PAY` | One-time checkout (default) |
| `STATIC_PAY` | Reusable QR code for your store |
| `ORDER_PAY` | Specific order with line items |
| `INVOICE_PAY` | Send invoice to customer |
| `REFERENCE_PAY` | Payment with custom reference |

## Verification Thresholds

Payments automatically require verification based on amount:

| Amount | Verification |
|--------|-------------|
| ≤ $2.00 | None - instant payment |
| $2.01 - $50.00 | PIN required |
| > $50.00 | Face ID / Biometric |

This is handled automatically by the checkout page!

## Next Steps

- **[Accept Payments](/guides/accept-payments)** - Integrate checkout into your website
- **[Payment Links](/guides/payment-links)** - Generate payment links for invoices
- **[QR Code Payments](/guides/qr-payments)** - Accept QR code payments in-store
- **[API Reference](/api/overview)** - Complete API documentation
- **[Webhooks](/guides/webhooks)** - Get notified when payments complete

## Need Help?

- Check the [API Reference](/api/overview) for complete endpoint documentation
- Contact support for integration assistance
- Email: support@dberi.io
