# Payment Flow

Understanding the complete payment flow helps you build a seamless checkout experience for your customers.

## Overview

```
            
   Create       Customer     Payment      Fulfill   
   Payment          Checkout        Completed          Order    
            
     Your              Customer           Dberi              Your
     Server            Browser            System             Server
```

## Step-by-Step Flow

### Step 1: Create Payment Session

When a customer clicks "Checkout" on your website:

```javascript
// Your server
const payment = await fetch('https://api.dberi.com/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 2500,
    currency: 'BSD',
    description: 'Order #1234',
    payment_mode: 'DYNAMIC_PAY',
    success_url: 'https://yourstore.com/success',
    cancel_url: 'https://yourstore.com/cart'
  })
})

const data = await payment.json()
// {
//   "id": "payment-abc123",
//   "hosted_url": "/checkout/payment-abc123",
//   "qr_payload": "dberi://pay/payment-abc123",
//   "status": "created",
//   "expires_at": "2026-03-20T10:00:00Z"
// }
```

### Step 2: Redirect Customer

Send the customer to Dberi's hosted checkout:

```javascript
// Redirect to checkout
window.location.href = `https://dberi.com${data.hosted_url}`
```

Or display QR code for mobile payments:

```html
<img src="https://api.qr-code-generator.com/qr?text=${data.qr_payload}" />
<p>Scan with Dberi mobile app</p>
```

### Step 3: Customer Checkout

The customer lands on Dberi's secure checkout page and sees:
- Payment amount ($25.00 BSD)
- Merchant name and description
- Payment options:
  - Pay with Dberi wallet balance
  - Scan QR code from mobile app
  - Enter payment credentials

### Step 4: Payment Verification

Based on the payment amount, Dberi automatically requires verification:

#### Small Payments (≤ $2.00)

```
 Instant approval
 No verification needed
 Fast checkout experience
```

Customer clicks "Pay Now"  Payment completes immediately

#### Medium Payments ($2.01 - $50.00)

```
 PIN verification required
```

Customer:
1. Clicks "Pay Now"
2. Enters 4-6 digit PIN
3. Payment completes after PIN verification

#### Large Payments (> $50.00)

```
 Biometric verification required
```

Customer:
1. Clicks "Pay Now"
2. Prompted for Face ID / Fingerprint
3. Payment completes after biometric verification

### Step 5: Payment Processing

Once verified, Dberi:

1. **Checks Balance**
   ```
   Customer balance: $100.00
   Payment amount:   $25.00
    Sufficient funds
   ```

2. **Creates Transaction**
   ```
   Transaction ID: txn-xyz789
   From: Customer wallet
   To: Merchant wallet
   Amount: $25.00
   Fee: $0.75 (3%)
   ```

3. **Updates Ledger**
   ```
   Debit:  Customer wallet -$25.00
   Credit: Merchant wallet +$24.25
   Credit: Platform wallet +$0.75
   ```

4. **Updates Status**
   ```
   created  pending  completed
   ```

### Step 6: Webhook Notification

Dberi sends a webhook to your server:

```json
POST https://yourstore.com/webhooks/dberi
{
  "event": "payment.completed",
  "payment_id": "payment-abc123",
  "merchant_id": "merchant-your-id",
  "amount": 2500,
  "currency": "BSD",
  "status": "completed",
  "transaction_id": "txn-xyz789",
  "customer_id": "cust-12345",
  "created_at": "2026-03-19T10:15:00Z",
  "completed_at": "2026-03-19T10:15:30Z"
}
```

### Step 7: Verify Webhook

Your server verifies the webhook is authentic:

```javascript
const crypto = require('crypto')

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')

  return signature === expectedSignature
}

app.post('/webhooks/dberi', (req, res) => {
  const signature = req.headers['x-dberi-signature']
  const isValid = verifyWebhook(req.body, signature, process.env.WEBHOOK_SECRET)

  if (!isValid) {
    return res.status(401).send('Invalid signature')
  }

  const { event, payment_id } = req.body

  if (event === 'payment.completed') {
    // Update order status in your database
    await updateOrderStatus(payment_id, 'paid')

    // Send confirmation email to customer
    await sendOrderConfirmation(payment_id)

    // Start fulfillment process
    await fulfillOrder(payment_id)
  }

  res.status(200).send('OK')
})
```

### Step 8: Redirect Customer

After payment completes, Dberi redirects the customer back to your site:

```
https://yourstore.com/success?payment_id=payment-abc123
```

Your success page:
1. Retrieves payment details
2. Displays order confirmation
3. Shows receipt
4. Provides next steps

## Alternative Flows

### QR Code Payment (In-Person)

For in-store or mobile payments:

```
1. Merchant displays QR code
2. Customer scans with Dberi app
3. Customer confirms payment in app
4. Payment completes
5. Merchant receives notification
```

### Payment Link (Email/SMS)

For invoices or remote payments:

```
1. Merchant creates payment link
2. Merchant sends link to customer
3. Customer clicks link
4. Customer completes payment
5. Both receive confirmation
```

## Payment Status Timeline

```
created
  
    Customer lands on checkout
  
pending
  
    Customer enters verification
  
requires_action
  
    Customer completes PIN/Face ID
  
processing
  
    Dberi verifies and processes
  
completed / failed
```

### Status Transitions

| From | To | Trigger |
|------|----|----|
| `created` | `pending` | Customer initiates payment |
| `pending` | `requires_action` | Verification needed |
| `requires_action` | `processing` | Verification provided |
| `processing` | `completed` | Payment successful |
| `processing` | `failed` | Insufficient funds / Invalid PIN |
| `created` | `expired` | 24 hours passed |

## Error Handling

### Insufficient Balance

```json
{
  "error": "Insufficient balance",
  "code": "INSUFFICIENT_BALANCE",
  "details": "Customer wallet balance is too low"
}
```

**Recovery:**
- Customer can top up wallet
- Customer can use different payment method
- Customer returns to cart

### Invalid PIN

```json
{
  "error": "Invalid PIN",
  "code": "INVALID_PIN",
  "details": "PIN verification failed"
}
```

**Recovery:**
- Customer can retry (3 attempts)
- Account temporarily locked after 3 failures
- Customer can reset PIN

### Payment Expired

```json
{
  "error": "Payment expired",
  "code": "PAYMENT_EXPIRED",
  "details": "Payment session has expired"
}
```

**Recovery:**
- Create new payment session
- Customer returns to checkout

## Best Practices

### 1. Poll for Status Updates

If webhooks fail, poll the payment status:

```javascript
async function waitForPayment(paymentId) {
  for (let i = 0; i < 60; i++) {
    const response = await fetch(`https://api.dberi.com/v1/payments/${paymentId}`)
    const payment = await response.json()

    if (payment.status === 'completed') {
      return payment
    }

    if (payment.status === 'failed') {
      throw new Error('Payment failed')
    }

    await sleep(2000) // Wait 2 seconds
  }

  throw new Error('Payment timeout')
}
```

### 2. Handle Webhooks Idempotently

Webhooks may be sent multiple times:

```javascript
app.post('/webhooks/dberi', async (req, res) => {
  const { payment_id } = req.body

  // Check if already processed
  const processed = await isWebhookProcessed(payment_id)
  if (processed) {
    return res.status(200).send('Already processed')
  }

  // Process webhook
  await processWebhook(req.body)

  // Mark as processed
  await markWebhookProcessed(payment_id)

  res.status(200).send('OK')
})
```

### 3. Show Payment Status

Keep customers informed:

```javascript
// Show loading state
showLoader('Processing payment...')

// Poll for updates
const payment = await waitForPayment(paymentId)

// Show success
showSuccess('Payment completed!')
```

### 4. Handle Failures Gracefully

Provide clear error messages and recovery options:

```javascript
try {
  const payment = await processPayment()
} catch (error) {
  if (error.code === 'INSUFFICIENT_BALANCE') {
    showMessage('Insufficient funds. Please top up your wallet.')
    showTopUpButton()
  } else {
    showMessage('Payment failed. Please try again.')
    showRetryButton()
  }
}
```

## Next Steps

- [Learn about Settlement ](/concepts/settlement)
- [Accept Payments Guide ](/guides/accept-payments)
- [Webhook Integration ](/guides/webhooks)
