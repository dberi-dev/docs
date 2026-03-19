# Payment Modes

Dberi supports multiple payment modes to fit different business use cases. Choose the right mode for your checkout flow.

## Available Payment Modes

### DYNAMIC_PAY (Recommended)

**Best for:** E-commerce checkouts, one-time purchases

Dynamic payments create a unique, single-use payment session for each transaction.

```bash
POST /v1/payments
{
  "merchant_id": "merchant-abc123",
  "amount": 2500,
  "currency": "BSD",
  "payment_mode": "DYNAMIC_PAY",
  "description": "Order #1234"
}
```

**Features:**
-  Unique payment ID for each transaction
-  Expires after 24 hours
-  Cannot be reused after completion
-  Ideal for order-specific payments

**Use cases:**
- Online store checkout
- Booking confirmations
- Service payments
- Subscription sign-ups

---

### STATIC_PAY

**Best for:** Physical stores, recurring locations

Static payments create a reusable QR code that accepts multiple payments to the same merchant.

```bash
POST /v1/payments
{
  "merchant_id": "merchant-abc123",
  "payment_mode": "STATIC_PAY",
  "description": "Coffee Shop Counter"
}
```

**Features:**
-  Single QR code for multiple transactions
-  No expiration (permanent)
-  Customer enters amount at checkout
-  Great for point-of-sale

**Use cases:**
- Restaurant table QR codes
- Retail counter payments
- Market stalls
- Tip jars

---

### ORDER_PAY

**Best for:** Shopping carts with line items

Order payments include detailed line items and order information.

```bash
POST /v1/payments
{
  "merchant_id": "merchant-abc123",
  "payment_mode": "ORDER_PAY",
  "order_id": "order-5678",
  "line_items": [
    {
      "name": "Blue T-Shirt",
      "quantity": 2,
      "price": 2000
    },
    {
      "name": "Shipping",
      "quantity": 1,
      "price": 500
    }
  ],
  "total": 4500
}
```

**Features:**
-  Detailed receipt with line items
-  Order tracking and history
-  Supports taxes and shipping
-  Customer sees itemized breakdown

**Use cases:**
- E-commerce shopping carts
- Food delivery orders
- Multi-item purchases
- Marketplace transactions

---

### INVOICE_PAY

**Best for:** B2B payments, billing

Invoice payments are sent to customers with payment terms and due dates.

```bash
POST /v1/payments
{
  "merchant_id": "merchant-abc123",
  "payment_mode": "INVOICE_PAY",
  "invoice_number": "INV-2026-001",
  "customer_email": "customer@company.bs",
  "amount": 50000,
  "due_date": "2026-04-01",
  "terms": "Net 30"
}
```

**Features:**
-  Email invoice to customer
-  Payment reminders
-  Due date tracking
-  Payment terms

**Use cases:**
- Freelancer invoices
- B2B billing
- Professional services
- Consulting fees

---

### REFERENCE_PAY

**Best for:** Payments with custom references

Reference payments allow you to attach custom metadata and tracking codes.

```bash
POST /v1/payments
{
  "merchant_id": "merchant-abc123",
  "payment_mode": "REFERENCE_PAY",
  "amount": 7500,
  "reference": "MEMBERSHIP-2026-JAN",
  "metadata": {
    "customer_id": "cust_12345",
    "membership_tier": "gold",
    "renewal": true
  }
}
```

**Features:**
-  Custom reference codes
-  Metadata for tracking
-  Reconciliation support
-  External system integration

**Use cases:**
- Membership renewals
- Donation tracking
- Event ticket sales
- Custom integrations

## Comparison Table

| Feature | DYNAMIC_PAY | STATIC_PAY | ORDER_PAY | INVOICE_PAY | REFERENCE_PAY |
|---------|-------------|------------|-----------|-------------|---------------|
| **Single Use** |  |  |  |  |  |
| **Reusable** |  |  |  |  |  |
| **Expiration** | 24h | Never | 24h | Due date | 24h |
| **Line Items** |  |  |  |  |  |
| **Email Invoice** |  |  |  |  |  |
| **Custom Amount** | Fixed | Customer enters | Fixed | Fixed | Fixed |
| **Metadata** | Basic | Basic | Full | Full | Full |

## Switching Payment Modes

You can use different payment modes for different scenarios in your business:

```javascript
// Checkout page
const checkout = await createPayment({
  mode: 'DYNAMIC_PAY',
  amount: 2500
})

// In-store QR code
const qrCode = await createPayment({
  mode: 'STATIC_PAY'
})

// Monthly invoice
const invoice = await createPayment({
  mode: 'INVOICE_PAY',
  customer_email: 'client@business.com',
  due_date: '2026-04-01'
})
```

## Best Practices

### 1. Choose the Right Mode

Match the payment mode to your business flow:
- Online checkout  `DYNAMIC_PAY`
- Physical store  `STATIC_PAY`
- Shopping cart  `ORDER_PAY`
- Client billing  `INVOICE_PAY`

### 2. Add Descriptions

Always include clear descriptions:

```bash
{
  "description": "Premium Membership - Annual",
  "payment_mode": "DYNAMIC_PAY"
}
```

### 3. Use Metadata

Track additional information:

```bash
{
  "metadata": {
    "user_id": "12345",
    "campaign": "summer_sale"
  }
}
```

### 4. Set Appropriate Expiration

For DYNAMIC_PAY and ORDER_PAY:
- Standard: 24 hours (default)
- Quick checkout: 30 minutes
- Invoices: Custom due date

## Next Steps

- [Understand Payment Flow ](/concepts/payment-flow)
- [Accept Payments Guide ](/guides/accept-payments)
- [API Reference ](/api/payments)
