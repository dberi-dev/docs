# Payments API

Create and manage customer payments.

## The Payment Object

```json
{
  "id": "payment-550e8400-e29b-41d4-a716-446655440000",
  "merchant_id": "merchant-abc123",
  "amount": 2500,
  "currency": "BSD",
  "status": "completed",
  "payment_mode": "DYNAMIC_PAY",
  "description": "Order #1234",
  "customer_id": "cust-xyz789",
  "transaction_id": "txn-def456",
  "hosted_url": "/checkout/payment-550e8400",
  "qr_payload": "dberi://pay/payment-550e8400",
  "success_url": "https://yourstore.com/success",
  "cancel_url": "https://yourstore.com/cart",
  "metadata": {
    "order_id": "1234",
    "customer_name": "John Smith"
  },
  "created_at": "2026-03-19T10:00:00Z",
  "updated_at": "2026-03-19T10:05:30Z",
  "completed_at": "2026-03-19T10:05:30Z",
  "expires_at": "2026-03-20T10:00:00Z"
}
```

### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique payment identifier |
| `merchant_id` | string | Merchant receiving payment |
| `amount` | integer | Amount in cents (2500 = $25.00) |
| `currency` | string | Three-letter ISO currency code (`BSD`) |
| `status` | string | Payment status (see statuses below) |
| `payment_mode` | string | Type of payment (see modes) |
| `description` | string | Human-readable description |
| `customer_id` | string | Customer who made payment |
| `transaction_id` | string | Associated transaction ID |
| `hosted_url` | string | Checkout page URL path |
| `qr_payload` | string | QR code data for mobile payments |
| `success_url` | string | Redirect URL after success |
| `cancel_url` | string | Redirect URL after cancellation |
| `metadata` | object | Custom key-value pairs |
| `created_at` | string | ISO 8601 timestamp |
| `updated_at` | string | ISO 8601 timestamp |
| `completed_at` | string | ISO 8601 timestamp (when completed) |
| `expires_at` | string | ISO 8601 timestamp (24h after creation) |

### Payment Statuses

| Status | Description |
|--------|-------------|
| `created` | Payment session created, awaiting customer |
| `pending` | Customer initiated payment, processing |
| `requires_action` | Additional verification needed (PIN/Face ID) |
| `processing` | Payment being processed |
| `completed` | Payment successful |
| `failed` | Payment failed |
| `expired` | Payment session expired (24h) |
| `canceled` | Payment canceled by customer |

### Payment Modes

| Mode | Description |
|------|-------------|
| `DYNAMIC_PAY` | One-time checkout (default) |
| `STATIC_PAY` | Reusable QR code for in-store |
| `ORDER_PAY` | Payment with line items |
| `INVOICE_PAY` | Invoiced payment with due date |
| `REFERENCE_PAY` | Payment with custom reference |

See [Payment Modes](/concepts/payment-modes) for detailed usage.

## Create a Payment

Creates a new payment session.

```bash
POST /v1/payments
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `merchant_id` | string | Yes* | Merchant ID (dev mode only) |
| `amount` | integer | Yes | Amount in cents |
| `currency` | string | No | Default: `BSD` |
| `payment_mode` | string | No | Default: `DYNAMIC_PAY` |
| `description` | string | No | Payment description |
| `success_url` | string | No | Redirect URL after success |
| `cancel_url` | string | No | Redirect URL after cancel |
| `metadata` | object | No | Custom key-value pairs (max 20 keys) |

*In production, `merchant_id` is derived from your API key.

### Example Request

```bash
curl -X POST https://api.dberi.com/v1/payments \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "currency": "BSD",
    "description": "Premium Membership - Annual",
    "payment_mode": "DYNAMIC_PAY",
    "success_url": "https://yourstore.com/success",
    "cancel_url": "https://yourstore.com/cart",
    "metadata": {
      "user_id": "12345",
      "plan": "premium_annual"
    }
  }'
```

### Example Response

```json
{
  "id": "payment-abc123",
  "merchant_id": "merchant-your-id",
  "amount": 2500,
  "currency": "BSD",
  "status": "created",
  "payment_mode": "DYNAMIC_PAY",
  "description": "Premium Membership - Annual",
  "hosted_url": "/checkout/payment-abc123",
  "qr_payload": "dberi://pay/payment-abc123",
  "success_url": "https://yourstore.com/success",
  "cancel_url": "https://yourstore.com/cart",
  "metadata": {
    "user_id": "12345",
    "plan": "premium_annual"
  },
  "created_at": "2026-03-19T10:00:00Z",
  "expires_at": "2026-03-20T10:00:00Z"
}
```

## Retrieve a Payment

Retrieves payment details and current status.

```bash
GET /v1/payments/:id
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Payment ID |

### Example Request

```bash
curl https://api.dberi.com/v1/payments/payment-abc123 \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "id": "payment-abc123",
  "merchant_id": "merchant-your-id",
  "amount": 2500,
  "currency": "BSD",
  "status": "completed",
  "payment_mode": "DYNAMIC_PAY",
  "description": "Premium Membership - Annual",
  "customer_id": "cust-xyz789",
  "transaction_id": "txn-def456",
  "created_at": "2026-03-19T10:00:00Z",
  "completed_at": "2026-03-19T10:05:30Z"
}
```

## List All Payments

Retrieves a list of payments for your merchant account.

```bash
GET /v1/payments
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of results (default: 20, max: 100) |
| `offset` | integer | Pagination offset |
| `status` | string | Filter by status |
| `start_date` | string | Filter by created_at (ISO 8601) |
| `end_date` | string | Filter by created_at (ISO 8601) |

### Example Request

```bash
curl "https://api.dberi.com/v1/payments?limit=10&status=completed" \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "payments": [
    {
      "id": "payment-abc123",
      "amount": 2500,
      "status": "completed",
      "created_at": "2026-03-19T10:00:00Z"
    }
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}
```

## Update a Payment

Updates payment metadata (limited fields).

```bash
PATCH /v1/payments/:id
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `description` | string | Update description |
| `metadata` | object | Update metadata |

::: warning Limited Updates
You cannot change `amount`, `merchant_id`, or `status` after creation.
:::

### Example Request

```bash
curl -X PATCH https://api.dberi.com/v1/payments/payment-abc123 \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "internal_note": "Customer upgraded from basic plan"
    }
  }'
```

## Cancel a Payment

Cancels a pending payment session.

```bash
POST /v1/payments/:id/cancel
```

::: warning Cannot Cancel
You can only cancel payments with status `created` or `pending`. Completed payments require a refund.
:::

### Example Request

```bash
curl -X POST https://api.dberi.com/v1/payments/payment-abc123/cancel \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "id": "payment-abc123",
  "status": "canceled",
  "canceled_at": "2026-03-19T10:30:00Z"
}
```

## Confirm Payment (Testing Only)

Simulates a successful payment for testing.

```bash
POST /v1/payments/:id/confirm
```

::: danger Testing Only
This endpoint only works in development mode. Use webhooks to detect real payments in production.
:::

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_phone` | string | No | Customer phone (creates test customer) |

### Example Request

```bash
curl -X POST https://api.dberi.com/v1/payments/payment-abc123/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "customer_phone": "+12425551234"
  }'
```

### Example Response

```json
{
  "id": "payment-abc123",
  "status": "completed",
  "customer_id": "cust-test123",
  "transaction_id": "txn-test456",
  "completed_at": "2026-03-19T10:35:00Z"
}
```

## Refund a Payment

Issues a full or partial refund.

```bash
POST /v1/payments/:id/refund
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | integer | No | Refund amount in cents (default: full refund) |
| `reason` | string | No | Refund reason |

### Example Request

```bash
curl -X POST https://api.dberi.com/v1/payments/payment-abc123/refund \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "reason": "Customer requested cancellation"
  }'
```

### Example Response

```json
{
  "id": "refund-xyz789",
  "payment_id": "payment-abc123",
  "amount": 2500,
  "reason": "Customer requested cancellation",
  "status": "succeeded",
  "created_at": "2026-03-19T11:00:00Z"
}
```

## Verification Requirements

Payments automatically require verification based on amount:

| Amount | Verification |
|--------|--------------|
| ≤ $2.00 (200 cents) | None - instant approval |
| $2.01 - $50.00 (201-5000 cents) | PIN (4-6 digits) |
| > $50.00 (5001+ cents) | Face ID / Biometric |

This is handled automatically by the Dberi checkout page.

## Idempotency

Prevent duplicate payments by including an idempotency key:

```bash
curl -X POST https://api.dberi.com/v1/payments \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-12345" \
  -d '{"amount": 2500}'
```

Same key = same response (no duplicate charge).

## Expiration

Payment sessions expire after **24 hours** by default. After expiration:
- Checkout page shows "Payment Expired"
- Status becomes `expired`
- Customer must create new payment

## Errors

| Code | Description |
|------|-------------|
| `PAYMENT_NOT_FOUND` | Payment ID doesn't exist |
| `PAYMENT_EXPIRED` | Payment session has expired |
| `PAYMENT_ALREADY_COMPLETED` | Payment was already processed |
| `PAYMENT_CANCELED` | Payment was canceled |
| `INSUFFICIENT_BALANCE` | Customer has insufficient funds |
| `INVALID_PIN` | Customer entered wrong PIN |
| `MERCHANT_NOT_FOUND` | Merchant ID doesn't exist |
| `INVALID_AMOUNT` | Amount must be positive integer |

## Webhooks

Subscribe to payment events:

```
payment.created
payment.completed
payment.failed
payment.refunded
payment.canceled
```

See [Webhooks API](/api/webhooks) for details.

## Next Steps

- [Accept Payments Guide ](/guides/accept-payments)
- [Payment Flow ](/concepts/payment-flow)
- [Webhook Integration ](/guides/webhooks)
