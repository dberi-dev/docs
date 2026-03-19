# Webhook Integration

Receive real-time notifications when payments and other events occur in your Dberi account.

::: warning Coming Soon
Full webhook functionality is currently in development. This guide describes the planned webhook system.
:::

## Why Use Webhooks?

Instead of constantly polling the API to check payment status, webhooks push notifications to your server automatically when events occur.

### Without Webhooks (Polling)

```javascript
//  Inefficient - polls every 2 seconds
setInterval(async () => {
  const payment = await fetchPayment(paymentId)

  if (payment.status === 'completed') {
    fulfillOrder(payment)
  }
}, 2000)
```

### With Webhooks

```javascript
//  Efficient - notified instantly
app.post('/webhooks/dberi', (req, res) => {
  const event = req.body

  if (event.type === 'payment.completed') {
    fulfillOrder(event.data)
  }

  res.status(200).send('OK')
})
```

## Setup

### 1. Create Webhook Endpoint

Create an endpoint on your server to receive webhooks:

```javascript
const express = require('express')
const app = express()

app.post('/webhooks/dberi',
  express.raw({type: 'application/json'}),
  (req, res) => {
    const event = JSON.parse(req.body)

    // Process event
    handleWebhook(event)

    // Respond immediately
    res.status(200).send('OK')
  }
)

app.listen(3000)
```

### 2. Register Webhook URL

Register your webhook URL in the dashboard or API:

```bash
curl -X POST https://api.dberi.com/v1/webhooks \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourstore.com/webhooks/dberi",
    "events": [
      "payment.completed",
      "payment.failed",
      "refund.completed"
    ],
    "description": "Production webhook"
  }'
```

### 3. Verify Signatures

Always verify webhook signatures to ensure requests come from Dberi:

```javascript
const crypto = require('crypto')

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

app.post('/webhooks/dberi', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-dberi-signature']

  if (!verifySignature(req.body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature')
  }

  // Process webhook...
})
```

## Event Types

### Payment Events

```javascript
// Payment successfully completed
{
  "type": "payment.completed",
  "data": {
    "payment_id": "payment-abc123",
    "merchant_id": "merchant-your-id",
    "amount": 2500,
    "status": "completed",
    "customer_id": "cust-xyz789",
    "metadata": { "order_id": "1234" }
  }
}

// Payment failed
{
  "type": "payment.failed",
  "data": {
    "payment_id": "payment-abc123",
    "error_code": "INSUFFICIENT_BALANCE",
    "error_message": "Customer has insufficient funds"
  }
}

// Payment expired (24 hours)
{
  "type": "payment.expired",
  "data": {
    "payment_id": "payment-abc123"
  }
}
```

### Refund Events

```javascript
// Refund completed
{
  "type": "refund.completed",
  "data": {
    "refund_id": "refund-xyz789",
    "payment_id": "payment-abc123",
    "amount": 2500,
    "reason": "Customer requested cancellation"
  }
}
```

### Payout Events

```javascript
// Payout sent to bank
{
  "type": "payout.paid",
  "data": {
    "payout_id": "payout-abc123",
    "amount": 92000,
    "arrival_date": "2026-03-21"
  }
}
```

## Handling Events

### Complete Example

```javascript
const express = require('express')
const crypto = require('crypto')

const app = express()

app.post('/webhooks/dberi',
  express.raw({type: 'application/json'}),
  async (req, res) => {
    // 1. Verify signature
    const signature = req.headers['x-dberi-signature']
    const isValid = verifySignature(
      req.body,
      signature,
      process.env.WEBHOOK_SECRET
    )

    if (!isValid) {
      return res.status(401).send('Invalid signature')
    }

    // 2. Parse event
    const event = JSON.parse(req.body)

    // 3. Respond immediately
    res.status(200).send('OK')

    // 4. Process asynchronously
    processWebhookAsync(event)
  }
)

async function processWebhookAsync(event) {
  try {
    // Check if already processed
    const exists = await db.webhookEvents.findOne({ id: event.id })
    if (exists) {
      console.log('Webhook already processed')
      return
    }

    // Handle event type
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
        console.log(`Unhandled event: ${event.type}`)
    }

    // Mark as processed
    await db.webhookEvents.create({
      id: event.id,
      type: event.type,
      processed: true,
      processed_at: new Date()
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    // Log error for retry
    await logWebhookError(event, error)
  }
}

app.listen(3000)
```

### Handle Payment Completed

```javascript
async function handlePaymentCompleted(data) {
  const { payment_id, metadata } = data
  const { order_id } = metadata

  console.log(`Payment completed: ${payment_id} for order ${order_id}`)

  // 1. Update order in database
  await db.orders.update(order_id, {
    status: 'paid',
    payment_id,
    paid_at: new Date()
  })

  // 2. Send confirmation email
  const order = await db.orders.findOne(order_id)
  await sendEmail({
    to: order.customer_email,
    subject: `Order #${order_id} Confirmed`,
    template: 'order_confirmation',
    data: {
      order_id,
      items: order.items,
      total: data.amount
    }
  })

  // 3. Create shipment
  if (order.requires_shipping) {
    await shippingService.createShipment(order)
  }

  // 4. Notify internal systems
  await notifyWarehouse(order_id)
  await updateInventory(order.items)
  await syncToAccountingSystem(payment_id)

  // 5. Analytics
  await trackConversion(order_id, data.amount)

  console.log(`Order ${order_id} fulfilled`)
}
```

### Handle Payment Failed

```javascript
async function handlePaymentFailed(data) {
  const { payment_id, error_code, metadata } = data
  const { order_id } = metadata

  console.log(`Payment failed: ${payment_id} - ${error_code}`)

  // 1. Update order status
  await db.orders.update(order_id, {
    status: 'payment_failed',
    error_code,
    failed_at: new Date()
  })

  // 2. Release inventory hold
  const order = await db.orders.findOne(order_id)
  await releaseInventory(order.items)

  // 3. Notify customer
  await sendEmail({
    to: order.customer_email,
    subject: 'Payment Failed',
    template: 'payment_failed',
    data: {
      order_id,
      error_code,
      retry_url: `https://yourstore.com/retry/${order_id}`
    }
  })

  // 4. Analytics
  await trackFailedPayment(order_id, error_code)
}
```

### Handle Refund Completed

```javascript
async function handleRefundCompleted(data) {
  const { refund_id, payment_id, amount, reason } = data

  console.log(`Refund completed: ${refund_id}`)

  // Find order
  const order = await db.orders.findOne({ payment_id })

  // Update order status
  await db.orders.update(order.id, {
    status: 'refunded',
    refund_id,
    refund_amount: amount,
    refund_reason: reason,
    refunded_at: new Date()
  })

  // Notify customer
  await sendEmail({
    to: order.customer_email,
    subject: 'Refund Processed',
    template: 'refund_confirmation',
    data: {
      order_id: order.id,
      amount,
      reason
    }
  })

  // Update accounting
  await syncRefundToAccountingSystem(refund_id)
}
```

## Testing Webhooks

### Local Testing with ngrok

```bash
# Start your server
node server.js

# In another terminal, start ngrok
ngrok http 3000

# Use ngrok URL as webhook endpoint
# https://abc123.ngrok-free.app/webhooks/dberi
```

### Send Test Webhooks

```bash
# Send test payment.completed webhook
curl -X POST https://api.dberi.com/v1/webhooks/test \
  -H "Authorization: Bearer sk_test_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_id": "webhook-abc123",
    "event_type": "payment.completed"
  }'
```

### Test Locally

```javascript
// test-webhook.js
const fetch = require('node-fetch')
const crypto = require('crypto')

async function testWebhook() {
  const payload = {
    id: 'evt_test123',
    type: 'payment.completed',
    created: new Date().toISOString(),
    data: {
      payment_id: 'payment-test123',
      merchant_id: 'merchant-test',
      amount: 2500,
      status: 'completed',
      metadata: {
        order_id: '1234'
      }
    }
  }

  const secret = process.env.WEBHOOK_SECRET
  const signature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')

  const response = await fetch('https://api.dberi.com/webhooks/dberi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Dberi-Signature': signature
    },
    body: JSON.stringify(payload)
  })

  console.log('Status:', response.status)
  console.log('Response:', await response.text())
}

testWebhook()
```

## Best Practices

### 1. Respond Quickly

Always respond with `200 OK` immediately:

```javascript
app.post('/webhooks/dberi', (req, res) => {
  // Respond immediately
  res.status(200).send('OK')

  // Process asynchronously
  processWebhookAsync(req.body)
})
```

### 2. Handle Idempotency

Store event IDs to prevent duplicate processing:

```javascript
async function processWebhook(event) {
  // Check if already processed
  const exists = await db.webhookEvents.findOne({ id: event.id })
  if (exists) {
    return // Already processed
  }

  // Process event
  await handleEvent(event)

  // Mark as processed
  await db.webhookEvents.create({ id: event.id })
}
```

### 3. Retry Failed Processing

If processing fails, Dberi will retry:

```
Attempt 1: Immediate
Attempt 2: 5 minutes later
Attempt 3: 30 minutes later
Attempt 4: 2 hours later
Attempt 5: 6 hours later
```

Ensure your endpoint can handle retries gracefully.

### 4. Verify Signatures

**Always** verify signatures:

```javascript
const signature = req.headers['x-dberi-signature']
const timestamp = req.headers['x-dberi-timestamp']

// Prevent replay attacks
if (Date.now() - parseInt(timestamp) > 300000) {
  return res.status(400).send('Webhook too old')
}

// Verify signature
if (!verifySignature(req.body, signature, secret)) {
  return res.status(401).send('Invalid signature')
}
```

### 5. Log Everything

```javascript
async function processWebhook(event) {
  console.log('Webhook received:', {
    id: event.id,
    type: event.type,
    timestamp: new Date()
  })

  try {
    await handleEvent(event)
    console.log('Webhook processed successfully')
  } catch (error) {
    console.error('Webhook processing failed:', error)
    await logError(event, error)
  }
}
```

## Monitoring

### View Webhook Logs

Check webhook delivery status in your dashboard:

```
Event ID: evt_abc123
Type: payment.completed
Status: 200 OK
Delivered: 2026-03-19 10:05:31
Duration: 145ms
```

### Failed Webhooks

View failed webhooks:

```
Event ID: evt_def456
Type: payment.completed
Status: 500 Internal Server Error
Last Attempt: 2026-03-19 10:05:31
Next Retry: 2026-03-19 10:10:31
Attempts: 2/5
```

## Security

### Use HTTPS

**Always** use HTTPS endpoints in production:

```
 https://yourstore.com/webhooks/dberi
 http://yourstore.com/webhooks/dberi
```

### Verify Signatures

Never skip signature verification:

```javascript
//  Good
if (!verifySignature(payload, signature, secret)) {
  return res.status(401).send('Invalid signature')
}

//  Bad
// if (process.env.NODE_ENV !== 'production') {
//   Skip verification in development - NEVER DO THIS
// }
```

### Rotate Secrets

Rotate webhook secrets every 90 days:

```bash
POST /v1/webhooks/:id/rotate-secret
```

## Troubleshooting

### Webhook Not Received

1. Check webhook is registered in dashboard
2. Verify URL is publicly accessible
3. Check firewall/security group settings
4. Test with ngrok locally

### Signature Verification Failed

1. Ensure using raw request body (not parsed)
2. Verify correct webhook secret
3. Check header name is exact: `x-dberi-signature`
4. Test with known-good signature

### Duplicate Webhooks

Handle with idempotency (store event IDs)

## Next Steps

- [Accept Payments ](/guides/accept-payments)
- [Error Handling ](/guides/errors)
- [Webhooks API ](/api/webhooks)
