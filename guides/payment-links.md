# Payment Links

Generate and share payment links for invoices, bills, and simple checkouts.

## Overview

Payment links are shareable URLs that customers can click to pay you. No coding required - perfect for:

- **Invoicing** - Send payment requests to clients
- **Social Media** - Share payment links on Instagram, Facebook
- **Email/SMS** - Send payment requests via email or text
- **No Website** - Accept payments without a website

## Quick Start

### Create a Payment Link

```bash
curl -X POST https://api.dberi.com/v1/payment-links \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "description": "Website Design - March 2026"
  }'
```

**Response:**

```json
{
  "id": "link-abc123",
  "url": "https://dberi.com/pay/yourbusiness/link-abc123",
  "qr_code_url": "https://dberi.com/qr/link-abc123",
  "amount": 5000,
  "description": "Website Design - March 2026"
}
```

### Share the Link

Send to your customer:

```
Hi John,

Here's the payment link for your website project:
https://dberi.com/pay/yourbusiness/link-abc123

Amount: $50.00 BSD
Description: Website Design - March 2026

Thanks!
```

## Use Cases

### 1. Invoicing Clients

```javascript
// Create invoice payment link
const link = await fetch('https://api.dberi.com/v1/payment-links', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 250000, // $2,500
    description: 'Website Development - Project Alpha',
    expires_at: '2026-04-30T23:59:59Z',
    max_uses: 1,
    metadata: {
      invoice_number: 'INV-2026-042',
      client_name: 'Acme Corp',
      project: 'alpha'
    }
  })
})

const { url, qr_code_url } = await link.json()

// Send invoice email
await sendEmail({
  to: 'client@acme.bs',
  subject: 'Invoice INV-2026-042',
  body: `
    Invoice: INV-2026-042
    Amount: $2,500.00 BSD
    Due: April 30, 2026

    Pay online: ${url}

    Or scan QR code:
    ${qr_code_url}
  `
})
```

### 2. Accepting Donations

```javascript
// Create donation link (custom amount)
const link = await createPaymentLink({
  amount: null, // Customer enters amount
  description: 'Support Hurricane Relief Fund',
  metadata: {
    campaign: 'hurricane_relief_2026',
    category: 'donation'
  }
})

// Share on social media
console.log(`Donate here: ${link.url}`)
```

### 3. Selling Products

```javascript
// Create product payment link
const link = await createPaymentLink({
  amount: 12500, // $125
  description: 'Handmade Straw Basket - Large',
  max_uses: 10, // Limited stock
  metadata: {
    product_id: 'basket-large-001',
    sku: 'BSK-L-001'
  }
})

// Post on Instagram
```

### 4. Event Tickets

```javascript
// Create event ticket link
const link = await createPaymentLink({
  amount: 7500, // $75
  description: 'Junkanoo Summer Festival 2026 - VIP Ticket',
  max_uses: 100, // Limited tickets
  expires_at: '2026-06-01T00:00:00Z',
  metadata: {
    event: 'junkanoo_2026',
    ticket_type: 'vip',
    venue: 'Bay Street'
  }
})
```

### 5. Subscription Payments

```javascript
// Monthly membership link
const link = await createPaymentLink({
  amount: 2500, // $25/month
  description: 'Gym Membership - Monthly',
  metadata: {
    subscription_type: 'monthly',
    membership_tier: 'basic'
  }
})

// Customer pays monthly using same link
```

## Fixed vs Custom Amount

### Fixed Amount

Customer pays exact amount:

```javascript
{
  amount: 5000, // Customer must pay $50
  description: 'Consultation Fee'
}
```

### Custom Amount

Customer enters their own amount:

```javascript
{
  amount: null, // Customer chooses amount
  description: 'Donation to Animal Shelter'
}
```

Perfect for:
- Donations
- Tips
- Pay-what-you-want pricing

## Expiration and Limits

### Set Expiration Date

Links expire after a date:

```javascript
{
  amount: 10000,
  description: 'Early Bird Event Ticket',
  expires_at: '2026-05-01T00:00:00Z' // Expires May 1
}
```

### Limit Number of Uses

Links expire after X payments:

```javascript
{
  amount: 15000,
  description: 'Limited Edition Print',
  max_uses: 50 // Only 50 people can buy
}
```

### Unlimited Reusable Links

```javascript
{
  amount: 500,
  description: 'Coffee - Large',
  // No expiration, no max_uses - reusable forever
}
```

## QR Codes

Every payment link includes a QR code.

### Display QR Code

```html
<img
  src="https://dberi.com/qr/link-abc123"
  alt="Scan to pay"
  width="300"
/>
```

### Use Cases

- Print on invoices
- Display at checkout counter
- Share on social media
- Email to customers

## Tracking Payments

### List Payments for a Link

```bash
GET /v1/payment-links/:link_id/payments
```

```javascript
const response = await fetch(
  `https://api.dberi.com/v1/payment-links/${linkId}/payments`,
  {
    headers: {
      'Authorization': 'Bearer sk_live_your_api_key'
    }
  }
)

const { payments } = await response.json()

// Show who paid
payments.forEach(payment => {
  console.log(`${payment.customer_id} paid $${payment.amount / 100}`)
})
```

### Check Link Usage

```javascript
const link = await fetchPaymentLink(linkId)

console.log(`Uses: ${link.uses_count} / ${link.max_uses || '∞'}`)

if (link.uses_count >= link.max_uses) {
  console.log('Link sold out!')
}
```

## Webhooks

Subscribe to payment link events:

```javascript
// webhook handler
app.post('/webhooks/dberi', (req, res) => {
  const event = req.body

  if (event.type === 'payment_link.payment.completed') {
    const { payment_id, link_id, metadata } = event.data

    // Record payment
    await recordPayment({
      payment_id,
      invoice: metadata.invoice_number,
      client: metadata.client_name
    })

    // Send receipt
    await sendReceipt(payment_id)

    // Update accounting system
    await syncToQuickBooks(payment_id)
  }

  res.status(200).send('OK')
})
```

## Managing Links

### List All Links

```bash
GET /v1/payment-links
```

```javascript
const links = await fetch('https://api.dberi.com/v1/payment-links', {
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key'
  }
})

// Show active links
links.forEach(link => {
  console.log(`${link.description}: ${link.url}`)
})
```

### Update Link

```bash
PATCH /v1/payment-links/:id
```

```javascript
await fetch(`https://api.dberi.com/v1/payment-links/${linkId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: 'Updated Description',
    max_uses: 5 // Reduce limit
  })
})
```

### Deactivate Link

Stop accepting payments:

```javascript
await fetch(`https://api.dberi.com/v1/payment-links/${linkId}/deactivate`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_live_your_api_key'
  }
})
```

## Integration Examples

### Email Invoice

```javascript
async function sendInvoice(clientEmail, amount, invoiceNumber) {
  // Create payment link
  const link = await createPaymentLink({
    amount,
    description: `Invoice ${invoiceNumber}`,
    max_uses: 1,
    expires_at: getDueDate(30), // 30 days
    metadata: {
      invoice_number: invoiceNumber,
      client_email: clientEmail
    }
  })

  // Send email
  await sendEmail({
    to: clientEmail,
    subject: `Invoice ${invoiceNumber}`,
    html: `
      <h2>Invoice ${invoiceNumber}</h2>
      <p>Amount Due: $${amount / 100} BSD</p>
      <p>Due Date: ${link.expires_at}</p>
      <a href="${link.url}">Pay Now</a>
      <p>Or scan this QR code:</p>
      <img src="${link.qr_code_url}" />
    `
  })

  return link
}
```

### Social Media Product Sale

```javascript
async function createProductLink(product) {
  const link = await createPaymentLink({
    amount: product.price,
    description: product.name,
    max_uses: product.stock,
    metadata: {
      product_id: product.id,
      sku: product.sku
    }
  })

  // Post to Instagram bio
  // Post to Facebook
  // Tweet the link

  return link.url
}
```

### Event Registration

```javascript
async function createEventLink(event) {
  const link = await createPaymentLink({
    amount: event.ticket_price,
    description: `${event.name} - ${event.ticket_type}`,
    max_uses: event.capacity,
    expires_at: event.registration_deadline,
    metadata: {
      event_id: event.id,
      event_date: event.date
    }
  })

  // Monitor registrations
  setInterval(async () => {
    const linkData = await fetchPaymentLink(link.id)

    console.log(`Tickets sold: ${linkData.uses_count} / ${event.capacity}`)

    if (linkData.uses_count >= event.capacity) {
      console.log('Event sold out!')
      await notifyEventFull()
    }
  }, 60000) // Check every minute

  return link
}
```

## Best Practices

### 1. Use Descriptive Names

```javascript
//  Good
description: 'Website Development - Project Alpha - March 2026'

//  Bad
description: 'Payment'
```

### 2. Set Appropriate Expiration

```javascript
// Invoice - 30 days
expires_at: addDays(30)

// Event - Registration deadline
expires_at: '2026-06-01T00:00:00Z'

// Product - While supplies last
max_uses: stock_quantity
```

### 3. Use Metadata

Track important information:

```javascript
metadata: {
  invoice_number: 'INV-2026-042',
  client_id: '12345',
  project_code: 'ALPHA',
  payment_terms: 'Net 30'
}
```

### 4. Monitor Usage

Check periodically:

```javascript
const link = await fetchPaymentLink(linkId)

if (link.expires_at && new Date(link.expires_at) < new Date()) {
  console.log('Link expired - create new one')
  await sendNewInvoice()
}

if (link.uses_count === link.max_uses) {
  console.log('Sold out!')
  await notifySoldOut()
}
```

## Next Steps

- [Accept Payments ](/guides/accept-payments)
- [QR Code Payments ](/guides/qr-payments)
- [Payment Links API ](/api/payment-links)
