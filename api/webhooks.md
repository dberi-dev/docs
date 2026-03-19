# Webhooks API

Receive real-time notifications when events happen in your Dberi account.

::: warning Coming Soon
Full webhook functionality is currently in development. You can poll payment status using the [Payments API](/api/payments) in the meantime.
:::

## Overview

Webhooks allow Dberi to push real-time notifications to your server when important events occur, such as:
- Payment completed
- Payment failed
- Refund processed
- Payout completed

Instead of polling the API constantly, webhooks push data to you automatically.

## How Webhooks Work

```
1. Event occurs (customer pays)
        
2. Dberi sends POST request to your webhook URL
        
3. Your server receives and processes the webhook
        
4. Your server responds with 200 OK
        
5. Dberi marks webhook as delivered
```

## The Webhook Event Object

```json
{
  "id": "evt_550e8400-e29b-41d4-a716-446655440000",
  "type": "payment.completed",
  "created": "2026-03-19T10:05:30Z",
  "data": {
    "payment_id": "payment-abc123",
    "merchant_id": "merchant-your-id",
    "amount": 2500,
    "currency": "BSD",
    "status": "completed",
    "customer_id": "cust-xyz789",
    "transaction_id": "txn-def456",
    "metadata": {
      "order_id": "1234"
    }
  }
}
```

### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique event identifier |
| `type` | string | Event type (see event types below) |
| `created` | string | ISO 8601 timestamp |
| `data` | object | Event-specific data payload |

## Event Types

### Payment Events

| Event Type | Description |
|------------|-------------|
| `payment.created` | New payment session created |
| `payment.completed` | Payment successfully completed |
| `payment.failed` | Payment failed |
| `payment.expired` | Payment session expired (24h) |
| `payment.canceled` | Payment canceled by customer |

### Refund Events

| Event Type | Description |
|------------|-------------|
| `refund.created` | Refund initiated |
| `refund.completed` | Refund successfully processed |
| `refund.failed` | Refund failed |

### Payout Events

| Event Type | Description |
|------------|-------------|
| `payout.created` | Payout scheduled |
| `payout.paid` | Payout successfully sent to bank |
| `payout.failed` | Payout failed |

### Payment Link Events

| Event Type | Description |
|------------|-------------|
| `payment_link.created` | New payment link created |
| `payment_link.payment.completed` | Payment made via link |
| `payment_link.deactivated` | Payment link deactivated |
| `payment_link.expired` | Payment link expired |

## Setting Up Webhooks

### 1. Create an Endpoint

Create an endpoint on your server to receive webhooks:

```javascript
// Express.js example
app.post('/webhooks/dberi', express.raw({type: 'application/json'}), (req, res) => {
  const event = req.body

  // Process webhook
  handleWebhook(event)

  // Respond with 200
  res.status(200).send('OK')
})
```

### 2. Register Webhook URL

Add your webhook URL in the dashboard or via API:

```bash
POST /v1/webhooks
{
  "url": "https://yourstore.com/webhooks/dberi",
  "events": ["payment.completed", "payment.failed"]
}
```

### 3. Verify Webhook Signature

Verify that webhooks come from Dberi:

```javascript
const crypto = require('crypto')

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')

  return signature === expectedSignature
}

app.post('/webhooks/dberi', (req, res) => {
  const signature = req.headers['x-dberi-signature']
  const isValid = verifyWebhookSignature(
    req.body,
    signature,
    process.env.WEBHOOK_SECRET
  )

  if (!isValid) {
    return res.status(401).send('Invalid signature')
  }

  // Process webhook...
})
```

## Handling Webhooks

### Best Practices

#### 1. Respond Quickly

Always respond with `200 OK` immediately, then process asynchronously:

```javascript
app.post('/webhooks/dberi', async (req, res) => {
  // Immediately respond
  res.status(200).send('OK')

  // Process asynchronously
  processWebhookAsync(req.body)
})
```

#### 2. Handle Idempotency

Webhooks may be sent multiple times. Store event IDs to prevent duplicate processing:

```javascript
async function handleWebhook(event) {
  // Check if already processed
  const exists = await db.webhookEvents.findOne({ id: event.id })
  if (exists) {
    console.log('Webhook already processed')
    return
  }

  // Process webhook
  await processEvent(event)

  // Mark as processed
  await db.webhookEvents.create({ id: event.id, processed: true })
}
```

#### 3. Handle All Event Types

```javascript
async function processEvent(event) {
  switch (event.type) {
    case 'payment.completed':
      await handlePaymentCompleted(event.data)
      break

    case 'payment.failed':
      await handlePaymentFailed(event.data)
      break

    case 'refund.completed':
      await handleRefundCompleted(event.data)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}
```

#### 4. Retry Failed Processing

If your processing fails, Dberi will retry:

```
Retry 1: Immediately
Retry 2: 5 minutes later
Retry 3: 30 minutes later
Retry 4: 2 hours later
Retry 5: 6 hours later
```

After 5 failed attempts, you'll receive an alert.

## Example: Payment Completed

```json
POST https://yourstore.com/webhooks/dberi
{
  "id": "evt_abc123",
  "type": "payment.completed",
  "created": "2026-03-19T10:05:30Z",
  "data": {
    "payment_id": "payment-xyz789",
    "merchant_id": "merchant-your-id",
    "amount": 2500,
    "currency": "BSD",
    "status": "completed",
    "customer_id": "cust-12345",
    "transaction_id": "txn-def456",
    "metadata": {
      "order_id": "1234",
      "user_id": "67890"
    },
    "completed_at": "2026-03-19T10:05:30Z"
  }
}
```

### Handle Payment Completed

```javascript
async function handlePaymentCompleted(data) {
  const { payment_id, metadata } = data
  const { order_id } = metadata

  // 1. Update order status
  await db.orders.update(
    { id: order_id },
    { status: 'paid', payment_id }
  )

  // 2. Send confirmation email
  await sendEmail({
    to: customer.email,
    subject: 'Payment Confirmed',
    template: 'payment_confirmed',
    data: { order_id, amount: data.amount }
  })

  // 3. Start fulfillment
  await fulfillmentService.process(order_id)

  console.log(`Order ${order_id} paid successfully`)
}
```

## Example: Payment Failed

```json
POST https://yourstore.com/webhooks/dberi
{
  "id": "evt_def456",
  "type": "payment.failed",
  "created": "2026-03-19T10:10:00Z",
  "data": {
    "payment_id": "payment-xyz789",
    "merchant_id": "merchant-your-id",
    "amount": 2500,
    "status": "failed",
    "error_code": "INSUFFICIENT_BALANCE",
    "error_message": "Customer has insufficient funds",
    "metadata": {
      "order_id": "1234"
    },
    "failed_at": "2026-03-19T10:10:00Z"
  }
}
```

### Handle Payment Failed

```javascript
async function handlePaymentFailed(data) {
  const { payment_id, error_code, metadata } = data
  const { order_id } = metadata

  // 1. Update order status
  await db.orders.update(
    { id: order_id },
    { status: 'payment_failed', error: error_code }
  )

  // 2. Notify customer
  await sendEmail({
    to: customer.email,
    subject: 'Payment Failed',
    template: 'payment_failed',
    data: { order_id, error_code }
  })

  // 3. Release inventory hold
  await inventory.release(order_id)

  console.log(`Payment failed for order ${order_id}: ${error_code}`)
}
```

## Testing Webhooks

### Local Testing with ngrok

Use ngrok to test webhooks locally:

```bash
# Start ngrok
ngrok http 3000

# Use ngrok URL as webhook endpoint
https://abc123.ngrok.io/webhooks/dberi
```

### Test Events

Send test webhooks from the dashboard:

```bash
POST /v1/webhooks/test
{
  "webhook_id": "webhook-abc123",
  "event_type": "payment.completed"
}
```

## Managing Webhooks

### List Webhooks

```bash
GET /v1/webhooks
```

### Create Webhook

```bash
POST /v1/webhooks
{
  "url": "https://yourstore.com/webhooks/dberi",
  "events": ["payment.completed", "payment.failed"],
  "description": "Production webhook"
}
```

### Update Webhook

```bash
PATCH /v1/webhooks/:id
{
  "events": ["payment.completed", "refund.completed"]
}
```

### Delete Webhook

```bash
DELETE /v1/webhooks/:id
```

## Webhook Logs

View webhook delivery logs in your dashboard:

```
Event: payment.completed
Webhook: webhook-abc123
Status: 200 OK
Attempts: 1
Delivered: 2026-03-19 10:05:31
```

Failed deliveries show:
- HTTP status code
- Error message
- Retry schedule

## Security

### Verify Signatures

**Always** verify webhook signatures:

```javascript
const signature = req.headers['x-dberi-signature']
const timestamp = req.headers['x-dberi-timestamp']

// Prevent replay attacks
if (Date.now() - timestamp > 300000) { // 5 minutes
  return res.status(400).send('Webhook too old')
}

// Verify signature
const isValid = verifySignature(req.body, signature, secret)
if (!isValid) {
  return res.status(401).send('Invalid signature')
}
```

### Webhook Secrets

Each webhook has a unique signing secret:

```
whsec_abc123def456...
```

Store securely in environment variables.

## Troubleshooting

### Webhook Not Received

1. Check webhook is registered
2. Verify URL is publicly accessible
3. Check firewall/security groups
4. Review webhook logs in dashboard

### Signature Verification Failed

1. Ensure using raw request body
2. Verify correct webhook secret
3. Check signature header name
4. Test with known-good signature

### Duplicate Webhooks

Handle with idempotency (store event IDs).

## Rate Limits

- No rate limits on incoming webhooks
- Failed webhooks retry with backoff
- Maximum 5 retry attempts

## Support

Need help with webhooks?

- [Webhook Integration Guide](/guides/webhooks)
- Dashboard: Live chat
- Email: support@dberi.com

## Next Steps

- [Webhook Integration Guide ](/guides/webhooks)
- [Accept Payments ](/guides/accept-payments)
- [Error Handling ](/guides/errors)
