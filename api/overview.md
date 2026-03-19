# API Overview

Welcome to the Dberi API documentation. This guide will help you integrate payment processing into your business.

## Base URL

```
Production: https://api.dberi.com
Development: https://api.dberi.com
```

## Authentication

Currently, merchant authentication uses your Merchant ID for all payment requests. In production, you'll receive API keys upon registration.

```bash
# Example with merchant_id
curl -X POST https://api.dberi.com/v1/payments \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id": "your-merchant-id",
    "amount": 2500
  }'
```

::: warning Production Authentication
In production, use API keys in the Authorization header:
```
Authorization: Bearer sk_live_your_api_key
```
:::

## Request Format

All requests must include:
```http
Content-Type: application/json
```

## Response Format

All responses are returned in JSON format:

```json
{
  "id": "payment-550e8400",
  "status": "completed",
  "amount": 2500,
  "currency": "BSD"
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes and error messages:

```json
{
  "error": "Insufficient balance",
  "code": "INSUFFICIENT_BALANCE",
  "details": "Customer wallet balance is too low"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid credentials |
| 404 | Not Found - Resource doesn't exist |
| 422 | Unprocessable - Validation failed |
| 500 | Internal Server Error |

### Common Error Codes

| Code | Description |
|------|-------------|
| `PAYMENT_EXPIRED` | Payment session has expired (24h limit) |
| `PAYMENT_ALREADY_COMPLETED` | Payment was already processed |
| `INSUFFICIENT_BALANCE` | Customer has insufficient funds |
| `INVALID_PIN` | Customer entered wrong PIN |
| `MERCHANT_NOT_FOUND` | Merchant ID doesn't exist |

## Amounts

All monetary amounts are in **cents** (smallest currency unit):

| Display | API Value |
|---------|-----------|
| $1.00 BSD | 100 |
| $10.50 BSD | 1050 |
| $100.00 BSD | 10000 |

## Payment Statuses

| Status | Description |
|--------|-------------|
| `created` | Payment session created, awaiting customer action |
| `pending` | Customer initiated payment, processing |
| `requires_action` | Additional verification needed (PIN/Face ID) |
| `completed` | Payment successful |
| `failed` | Payment failed |

## Payment Flow

1. **Create Payment Session** - Your server creates a payment
2. **Customer Pays** - Customer completes payment via checkout/QR
3. **Webhook Notification** - You receive payment confirmation
4. **Fulfill Order** - You deliver the product/service

## Verification Thresholds

Payments automatically require customer verification based on amount:

| Amount | Verification Required |
|--------|----------------------|
| ≤ $2.00 (200 cents) | None - instant payment |
| $2.01 - $50.00 (201-5000 cents) | PIN (4-6 digits) |
| > $50.00 (5001+ cents) | Face ID / Biometric |

This is handled automatically by the Dberi checkout page!

## Rate Limiting

**Current:** No rate limiting enforced

**Production limits:**
- 100 requests per minute per merchant
- 10,000 requests per hour per merchant
- Burst allowance: 200 requests

## Available Resources

### Merchants
Create and manage your merchant account.

```bash
POST /v1/merchants        # Create merchant
GET  /v1/merchants/:id    # Get merchant info
```

[View Merchants API ](/api/merchants)

### Payments
Process customer payments.

```bash
POST /v1/payments           # Create payment session
GET  /v1/payments/:id       # Get payment status
POST /v1/payments/:id/confirm  # Confirm payment (for testing)
```

[View Payments API ](/api/payments)

### Payment Links
Generate shareable payment links.

```bash
POST /v1/payment-links                    # Create payment link
GET  /v1/pay/:merchant_slug/:link_id      # Access payment link
```

[View Payment Links API ](/api/payment-links)

### Webhooks (Coming Soon)
Receive real-time notifications for:
- Payment completed
- Payment failed
- Refund processed

[View Webhooks API ](/api/webhooks)

## Quick Start Example

Here's a complete payment flow:

```bash
# 1. Create merchant (one-time setup)
curl -X POST https://api.dberi.com/v1/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Store",
    "slug": "mystore",
    "category": "retail",
    "email": "hello@mystore.com"
  }'

# Response: {"id": "merchant-abc123", ...}

# 2. Create payment session
curl -X POST https://api.dberi.com/v1/payments \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id": "merchant-abc123",
    "amount": 2500,
    "currency": "BSD",
    "payment_mode": "DYNAMIC_PAY",
    "description": "Order #1234"
  }'

# Response: {
#   "id": "payment-xyz789",
#   "hosted_url": "/checkout/payment-xyz789",
#   "qr_payload": "dberi://pay/payment-xyz789"
# }

# 3. Send customer to checkout
# Redirect to: https://yourdomain.com/checkout/payment-xyz789

# 4. Check payment status
curl https://api.dberi.com/v1/payments/payment-xyz789

# Response: {"status": "completed", ...}
```

## Idempotency

To prevent duplicate payments, include an idempotency key:

```bash
curl -X POST https://api.dberi.com/v1/payments \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-order-id-123" \
  -d '{ ... }'
```

Same idempotency key = same response (no duplicate charge).

## Testing

Use these test amounts for different scenarios:

| Amount | Result |
|--------|--------|
| 100 (any value) | Success |
| ... | ... |

## Webhooks (Coming Soon)

Receive real-time notifications when payments are completed:

```json
{
  "event": "payment.completed",
  "payment_id": "payment-xyz789",
  "merchant_id": "merchant-abc123",
  "amount": 2500,
  "timestamp": "2026-03-19T10:00:00Z"
}
```

## SDKs (Coming Soon)

Official SDKs for:
- JavaScript/TypeScript - `npm install @dberi/node`
- Python - `pip install dberi`
- PHP - `composer require dberi/dberi-php`
- Ruby - `gem install dberi`

## Support

Need help integrating?
-  [Quickstart Guide](/quickstart)
-  [Integration Guides](/guides/accept-payments)
-  Email: support@dberi.io
