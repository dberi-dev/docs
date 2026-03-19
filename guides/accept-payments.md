# Accept Payments

Learn how to integrate Dberi checkout into your website or application.

## Overview

Dberi provides a hosted checkout page where customers complete payments securely. Your integration involves:

1. Creating a payment session on your server
2. Redirecting customers to Dberi checkout
3. Receiving webhook notifications
4. Fulfilling the order

## Integration Steps

### Step 1: Create Merchant Account

First, create your merchant account:

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

Save your `merchant_id` for future requests.

### Step 2: Install Dependencies

Choose your server-side language:

::: code-group

```bash [Node.js]
npm install node-fetch
```

```bash [Python]
pip install requests
```

```bash [PHP]
composer require guzzlehttp/guzzle
```

```bash [Ruby]
gem install httparty
```

:::

### Step 3: Create Payment Session

When a customer clicks "Checkout", create a payment session:

::: code-group

```javascript [Node.js]
// server.js
const fetch = require('node-fetch')

app.post('/checkout', async (req, res) => {
  const { amount, orderId } = req.body

  try {
    const response = await fetch('https://api.dberi.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DBERI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency: 'BSD',
        description: `Order #${orderId}`,
        payment_mode: 'DYNAMIC_PAY',
        success_url: 'https://yourstore.com/success',
        cancel_url: 'https://yourstore.com/cart',
        metadata: {
          order_id: orderId
        }
      })
    })

    const payment = await response.json()

    // Return checkout URL to frontend
    res.json({
      checkoutUrl: `https://dberi.com${payment.hosted_url}`
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' })
  }
})
```

```python [Python]
# server.py
import requests
import os

@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    amount = data['amount']
    order_id = data['orderId']

    response = requests.post('https://api.dberi.com/v1/payments',
        headers={
            'Authorization': f"Bearer {os.environ['DBERI_API_KEY']}",
            'Content-Type': 'application/json'
        },
        json={
            'amount': amount,
            'currency': 'BSD',
            'description': f'Order #{order_id}',
            'payment_mode': 'DYNAMIC_PAY',
            'success_url': 'https://yourstore.com/success',
            'cancel_url': 'https://yourstore.com/cart',
            'metadata': {
                'order_id': order_id
            }
        }
    )

    payment = response.json()

    return jsonify({
        'checkoutUrl': f"https://dberi.com{payment['hosted_url']}"
    })
```

```php [PHP]
// checkout.php
<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;

$client = new Client();

$amount = $_POST['amount'];
$orderId = $_POST['orderId'];

$response = $client->post('https://api.dberi.com/v1/payments', [
    'headers' => [
        'Authorization' => 'Bearer ' . getenv('DBERI_API_KEY'),
        'Content-Type' => 'application/json'
    ],
    'json' => [
        'amount' => $amount,
        'currency' => 'BSD',
        'description' => "Order #$orderId",
        'payment_mode' => 'DYNAMIC_PAY',
        'success_url' => 'https://yourstore.com/success',
        'cancel_url' => 'https://yourstore.com/cart',
        'metadata' => [
            'order_id' => $orderId
        ]
    ]
]);

$payment = json_decode($response->getBody(), true);

echo json_encode([
    'checkoutUrl' => "https://dberi.com" . $payment['hosted_url']
]);
```

:::

### Step 4: Redirect to Checkout

In your frontend, redirect the customer:

```javascript
// frontend.js
async function handleCheckout() {
  const response = await fetch('/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 2500,
      orderId: '1234'
    })
  })

  const { checkoutUrl } = await response.json()

  // Redirect to Dberi checkout
  window.location.href = checkoutUrl
}
```

### Step 5: Handle Webhooks

Set up a webhook endpoint to receive payment notifications:

```javascript
// webhooks.js
const crypto = require('crypto')

app.post('/webhooks/dberi', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-dberi-signature']
  const payload = req.body

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex')

  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature')
  }

  const event = JSON.parse(payload)

  // Handle event
  if (event.type === 'payment.completed') {
    const { payment_id, metadata } = event.data
    const { order_id } = metadata

    // Update order status
    updateOrder(order_id, {
      status: 'paid',
      payment_id
    })

    // Send confirmation email
    sendOrderConfirmation(order_id)

    // Start fulfillment
    fulfillOrder(order_id)
  }

  res.status(200).send('OK')
})
```

### Step 6: Handle Success Page

Create a success page for customers:

```javascript
// success.html
<!DOCTYPE html>
<html>
<head>
  <title>Payment Successful</title>
</head>
<body>
  <h1>Thank you for your purchase!</h1>
  <p>Your order has been confirmed.</p>
  <p>Order ID: <span id="orderId"></span></p>

  <script>
    // Get payment ID from URL
    const params = new URLSearchParams(window.location.search)
    const paymentId = params.get('payment_id')

    // Fetch payment details
    fetch(`/api/payment/${paymentId}`)
      .then(res => res.json())
      .then(payment => {
        document.getElementById('orderId').textContent = payment.metadata.order_id
      })
  </script>
</body>
</html>
```

## Complete Example

Here's a complete integration with Express.js:

```javascript
// app.js
const express = require('express')
const fetch = require('node-fetch')
const crypto = require('crypto')

const app = express()
app.use(express.json())

const DBERI_API_KEY = process.env.DBERI_API_KEY
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

// Create payment session
app.post('/api/checkout', async (req, res) => {
  const { items, total } = req.body

  // Save order to database
  const order = await db.orders.create({
    items,
    total,
    status: 'pending'
  })

  // Create Dberi payment
  const response = await fetch('https://api.dberi.com/v1/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DBERI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: total,
      currency: 'BSD',
      description: `Order #${order.id}`,
      success_url: `https://yourstore.com/success?order=${order.id}`,
      cancel_url: 'https://yourstore.com/cart',
      metadata: {
        order_id: order.id.toString()
      }
    })
  })

  const payment = await response.json()

  // Save payment ID
  await db.orders.update(order.id, {
    payment_id: payment.id
  })

  res.json({
    checkoutUrl: `https://dberi.com${payment.hosted_url}`
  })
})

// Handle webhooks
app.post('/webhooks/dberi', express.raw({type: 'application/json'}), async (req, res) => {
  const signature = req.headers['x-dberi-signature']

  // Verify signature
  const expectedSig = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex')

  if (signature !== expectedSig) {
    return res.status(401).send('Invalid signature')
  }

  const event = JSON.parse(req.body)

  // Respond immediately
  res.status(200).send('OK')

  // Process asynchronously
  if (event.type === 'payment.completed') {
    const { metadata } = event.data
    const orderId = parseInt(metadata.order_id)

    // Update order
    await db.orders.update(orderId, {
      status: 'paid',
      paid_at: new Date()
    })

    // Send email
    const order = await db.orders.findOne(orderId)
    await sendEmail({
      to: order.customer_email,
      subject: 'Order Confirmed',
      template: 'order_confirmed',
      data: { order }
    })

    // Fulfill order
    await fulfillmentService.process(orderId)
  }
})

app.listen(3000)
```

## Testing

### Local Testing

1. Use ngrok for webhook testing:

```bash
ngrok http 3000
```

2. Set webhook URL to ngrok URL:

```
https://abc123.ngrok.io/webhooks/dberi
```

3. Test payment flow:

```bash
# Create test payment
curl -X POST https://api.dberi.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"items": ["item1"], "total": 2500}'

# Visit checkout URL
# Complete payment
# Check webhook received
```

## Security Best Practices

### 1. Never Expose API Keys

```javascript
//  Good - Server-side only
const DBERI_API_KEY = process.env.DBERI_API_KEY

//  Bad - Client-side exposure
<script>
  const apiKey = 'sk_live_abc123' // NEVER DO THIS
</script>
```

### 2. Verify Webhook Signatures

Always verify webhooks come from Dberi:

```javascript
function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return signature === hash
}
```

### 3. Use HTTPS

Ensure all endpoints use HTTPS in production.

### 4. Validate Payment Status

Before fulfilling orders, verify payment is completed:

```javascript
async function fulfillOrder(orderId) {
  const order = await db.orders.findOne(orderId)

  // Verify payment with Dberi
  const response = await fetch(`https://api.dberi.com/v1/payments/${order.payment_id}`, {
    headers: { 'Authorization': `Bearer ${DBERI_API_KEY}` }
  })

  const payment = await response.json()

  if (payment.status !== 'completed') {
    throw new Error('Payment not completed')
  }

  // Fulfill order...
}
```

## Handling Edge Cases

### Payment Abandoned

If customer leaves checkout:

```javascript
// Poll for status
async function checkPaymentStatus(paymentId) {
  const response = await fetch(`https://api.dberi.com/v1/payments/${paymentId}`)
  const payment = await response.json()

  if (payment.status === 'created') {
    // Still pending - send reminder email
    await sendReminderEmail(payment)
  }
}
```

### Payment Expired

Payments expire after 24 hours:

```javascript
if (payment.status === 'expired') {
  // Create new payment session
  const newPayment = await createPayment(order)
  await sendNewCheckoutLink(order.customer_email, newPayment.hosted_url)
}
```

### Webhook Failure

If webhooks fail, poll payment status:

```javascript
async function pollPayment(paymentId) {
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const payment = await fetchPayment(paymentId)

    if (payment.status === 'completed') {
      await handlePaymentCompleted(payment)
      break
    }

    await sleep(5000) // Wait 5 seconds
    attempts++
  }
}
```

## Customization

### Custom Success URL

Include order details in success URL:

```javascript
{
  success_url: `https://yourstore.com/success?order=${orderId}&amount=${amount}`,
  cancel_url: `https://yourstore.com/cart?restore=${orderId}`
}
```

### Custom Metadata

Track additional information:

```javascript
{
  metadata: {
    order_id: '1234',
    customer_id: '5678',
    campaign: 'summer_sale',
    affiliate: 'ref_abc'
  }
}
```

## Next Steps

- [Payment Links Guide ](/guides/payment-links)
- [Webhook Integration ](/guides/webhooks)
- [Error Handling ](/guides/errors)
- [API Reference ](/api/payments)
