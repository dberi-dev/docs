# QR Code Payments

Accept in-person payments with QR codes for physical stores, markets, and events.

## Overview

QR code payments allow customers to pay by scanning a code with their mobile phone. **Dberi automatically generates QR codes for you** - just create a payment and display the `qr_payload` image.

Perfect for:

- **Physical Stores** - Display QR codes at checkout
- **Restaurants** - Table-side QR codes for bills
- **Markets** - Vendor booth payments
- **Events** - Ticket gates and concessions
- **Service Providers** - Mobile payments on-site

## Quick Start

### 1. Create Static QR Code

For reusable checkout counter QR:

```bash
curl -X POST https://api.dberi.com/v1/payments \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_mode": "STATIC_PAY",
    "description": "Checkout Counter 1"
  }'
```

**Response:**

```json
{
  "id": "payment-static-abc123",
  "qr_payload": "dberi://pay/payment-static-abc123",
  "payment_mode": "STATIC_PAY"
}
```

### 2. Display QR Code

The API automatically generates a QR code for you. Just use the `qr_payload` from the response:

```html
<!-- Display the auto-generated QR code -->
<img
  src="{{ qr_payload }}"
  alt="Scan to pay"
  width="300"
/>
```

The `qr_payload` is a ready-to-use base64 PNG image (data URL) - no external service needed!

### 3. Customer Scans & Pays

1. Customer opens their mobile camera or Dberi app
2. Scans QR code (redirects to checkout page)
3. Reviews payment details
4. Confirms payment with verification (PIN/Face ID if required)
5. Payment complete!

**Note:** The QR code contains a link to your checkout page: `{BASE_URL}/checkout/{payment_id}`

## Payment Modes

### Static QR (Reusable)

**Best for:** Checkout counters, permanent locations

```javascript
// Create reusable QR code
const qr = await createPayment({
  payment_mode: 'STATIC_PAY',
  description: 'Coffee Shop - Register 1'
})

// Use forever - never expires
// Customer enters amount each time
```

**Features:**
- Never expires
- Reusable unlimited times
- Customer enters amount
- Perfect for retail counters

### Dynamic QR (One-Time)

**Best for:** Specific transactions, invoices

```javascript
// Create one-time QR for specific amount
const qr = await createPayment({
  payment_mode: 'DYNAMIC_PAY',
  amount: 2500,
  description: 'Table 5 - Lunch'
})

// Expires after 24 hours
// Amount pre-filled
// Single use
```

**Features:**
- 24-hour expiration
- Pre-filled amount
- Single use per session
- Perfect for bills and invoices

## Use Cases

### Restaurant Payments

```javascript
// Generate QR for a bill
async function generateBillQR(billAmount, tableNumber) {
  const payment = await createPayment({
    payment_mode: 'DYNAMIC_PAY',
    amount: billAmount,
    description: `Table ${tableNumber}`,
    metadata: {
      table: tableNumber
    }
  })

  // Display QR code on the bill
  return payment.qr_payload
}
```

### Market Vendor Booth

```javascript
// Permanent booth QR
const qr = await createPayment({
  payment_mode: 'STATIC_PAY',
  description: 'Island Crafts - Booth 42'
})

// Print and display at booth
// Customer scans and pays for items
// Works all day, every day
```

### Event Ticket Scanning

```javascript
// Generate ticket QR for each attendee
async function generateTicketQR(attendee) {
  const qr = await createPayment({
    payment_mode: 'DYNAMIC_PAY',
    amount: attendee.ticket_price,
    description: `${event.name} - ${attendee.ticket_type}`,
    metadata: {
      attendee_id: attendee.id,
      event_id: event.id,
      ticket_number: attendee.ticket_number
    }
  })

  // Email QR to attendee
  await sendTicketEmail(attendee.email, qr.qr_payload)
}
```

### Mobile Service Provider

```javascript
// On-site payment for service
async function collectPayment(service, amount) {
  const qr = await createPayment({
    payment_mode: 'DYNAMIC_PAY',
    amount,
    description: `${service.name} - ${service.location}`,
    metadata: {
      service_id: service.id,
      technician: service.technician,
      location: service.address
    }
  })

  // Show QR on mobile device
  displayQR(qr.qr_payload)

  // Wait for payment
  await waitForPayment(qr.id)

  console.log('Payment received!')
}
```

## Implementation Examples

### Point of Sale Terminal

```javascript
// POS system integration
class POSTerminal {
  async checkout(items, total) {
    // Create payment QR
    const qr = await createPayment({
      payment_mode: 'DYNAMIC_PAY',
      amount: total,
      description: `POS Sale - ${items.length} items`,
      metadata: {
        items: items.map(i => i.name),
        terminal_id: this.terminalId,
        cashier: this.cashierId
      }
    })

    // Display QR on terminal screen
    this.displayQR(qr.qr_payload)

    // Poll for payment
    const payment = await this.waitForPayment(qr.id)

    if (payment.status === 'completed') {
      this.printReceipt(payment)
      this.openCashDrawer()
      return { success: true }
    }
  }

  async waitForPayment(paymentId, timeout = 120000) {
    const start = Date.now()

    while (Date.now() - start < timeout) {
      const payment = await fetchPayment(paymentId)

      if (payment.status === 'completed') {
        return payment
      }

      if (payment.status === 'failed') {
        throw new Error('Payment failed')
      }

      await sleep(2000) // Check every 2 seconds
    }

    throw new Error('Payment timeout')
  }
}
```

### Retail Store Checkout

```javascript
// In-store checkout with QR
async function processCheckout(items, total) {
  // Create payment for this transaction
  const payment = await createPayment({
    payment_mode: 'DYNAMIC_PAY',
    amount: total,
    description: `Purchase - ${items.length} items`,
    metadata: {
      items: items.map(i => i.name)
    }
  })

  // Display QR on register screen
  displayQR(payment.qr_payload)

  // Wait for customer to scan and pay
  const result = await waitForPayment(payment.id)

  if (result.status === 'completed') {
    console.log('Payment successful!')
    return { success: true }
  }
}
```

### Service Providers

```javascript
// On-site service payment
async function collectServicePayment(serviceName, amount) {
  const payment = await createPayment({
    payment_mode: 'DYNAMIC_PAY',
    amount,
    description: serviceName,
    metadata: {
      service_type: serviceName
    }
  })

  // Show QR code to customer
  console.log('Show this QR code to customer:')
  console.log(payment.qr_payload)

  // Wait for payment
  await waitForPayment(payment.id)

  console.log('Payment received! Service complete.')
}
```

## Displaying QR Codes

### Using the Auto-Generated QR Code

Dberi automatically generates QR codes for every payment. The `qr_payload` field contains a ready-to-use base64 PNG image:

```javascript
// Create payment
const payment = await createPayment({
  payment_mode: 'STATIC_PAY',
  description: 'Checkout Counter 1'
})

// QR code is ready to use immediately
const qrImageSrc = payment.qr_payload
// Example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

// Display in HTML
document.getElementById('qr-image').src = qrImageSrc
```

### Print QR Code

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    @media print {
      .no-print { display: none; }
    }
    .qr-container {
      text-align: center;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="qr-container">
    <h2>Scan to Pay</h2>
    <!-- Use the qr_payload from the API response -->
    <img src="{{ payment.qr_payload }}" alt="QR Code" width="300" />
    <p>Island Coffee Shop</p>
    <p>Checkout Counter 1</p>
    <button class="no-print" onclick="window.print()">Print QR Code</button>
  </div>
</body>
</html>
```

### Display on Screen

```javascript
// Show QR on POS terminal screen
function displayQR(payment, amount) {
  const qrImage = document.getElementById('qr-display')
  // Use the auto-generated QR code from the API
  qrImage.src = payment.qr_payload

  document.getElementById('amount-display').textContent = formatCurrency(amount)
  document.getElementById('qr-container').style.display = 'block'
}
```

## Monitoring Payments

### Real-Time Payment Detection

```javascript
async function waitForPayment(paymentId, options = {}) {
  const {
    timeout = 120000, // 2 minutes
    pollInterval = 2000, // 2 seconds
    onUpdate = () => {}
  } = options

  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const payment = await fetchPayment(paymentId)

    onUpdate(payment)

    if (payment.status === 'completed') {
      return payment
    }

    if (payment.status === 'failed' || payment.status === 'canceled') {
      throw new Error(`Payment ${payment.status}`)
    }

    await sleep(pollInterval)
  }

  throw new Error('Payment timeout')
}

// Usage
await waitForPayment(paymentId, {
  timeout: 180000, // 3 minutes
  onUpdate: (payment) => {
    if (payment.status === 'pending') {
      console.log('Customer is paying...')
    }
  }
})
```

### Webhook Notifications

```javascript
// Receive instant notification when customer pays
app.post('/webhooks/dberi', (req, res) => {
  const event = req.body

  if (event.type === 'payment.completed') {
    const { payment_id, amount, metadata } = event.data

    // Notify POS terminal
    notifyTerminal(metadata.terminal_id, {
      status: 'completed',
      amount
    })

    // Print receipt
    printReceipt(payment_id)

    // Open cash drawer
    if (metadata.terminal_id) {
      openDrawer(metadata.terminal_id)
    }
  }

  res.status(200).send('OK')
})
```

## Best Practices

### 1. Test Before Printing

Always test QR codes before printing:

```javascript
// Generate test QR
const testQR = await createPayment({
  payment_mode: 'STATIC_PAY',
  description: 'TEST - Do Not Use'
})

// Scan with phone
// Verify it works
// Then generate production QR
```

### 2. Include Clear Instructions

```

                     
   [QR CODE HERE]    
                     
  Scan to Pay with   
   Dberi Mobile App  
                     
   Island Coffee     
   Counter 1         
                     

```

### 3. Use High-Quality Prints

- Print at 300 DPI or higher
- Laminate for durability
- Use high-contrast colors (black on white)
- Ensure adequate size (minimum 2" x 2")

### 4. Monitor Payment Times

```javascript
const startTime = Date.now()

const payment = await waitForPayment(paymentId)

const duration = Date.now() - startTime

console.log(`Payment took ${duration}ms`)

// Alert if taking too long
if (duration > 30000) {
  console.warn('Payment took over 30 seconds')
}
```

## Troubleshooting

### QR Code Won't Scan

1. Check image quality (needs high resolution)
2. Ensure good lighting
3. Verify QR payload is correct
4. Test with multiple devices

### Payment Not Detected

1. Check internet connection
2. Verify webhook endpoint is accessible
3. Ensure polling interval is reasonable
4. Check payment hasn't expired

### Customer Confusion

1. Add clear instructions near QR code
2. Train staff to assist
3. Offer alternative payment method (card reader)
4. Provide customer support contact

## Next Steps

- [Accept Payments ](/guides/accept-payments)
- [Payment Links ](/guides/payment-links)
- [Payments API ](/api/payments)
