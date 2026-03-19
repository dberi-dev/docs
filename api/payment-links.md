# Payment Links API

Generate shareable payment links for invoices and simple checkouts.

## The Payment Link Object

```json
{
  "id": "link-550e8400-e29b-41d4-a716-446655440000",
  "merchant_id": "merchant-abc123",
  "merchant_slug": "island-coffee",
  "amount": 5000,
  "currency": "BSD",
  "description": "Invoice #2026-001",
  "url": "https://dberi.com/pay/island-coffee/link-550e8400",
  "qr_code_url": "https://dberi.com/qr/link-550e8400",
  "is_active": true,
  "uses_count": 3,
  "max_uses": 10,
  "expires_at": "2026-04-01T00:00:00Z",
  "metadata": {
    "invoice_number": "2026-001",
    "customer_id": "cust-12345"
  },
  "created_at": "2026-03-19T10:00:00Z",
  "updated_at": "2026-03-19T10:00:00Z"
}
```

### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique payment link identifier |
| `merchant_id` | string | Merchant who owns the link |
| `merchant_slug` | string | Merchant URL slug |
| `amount` | integer | Amount in cents (or `null` for custom amount) |
| `currency` | string | Three-letter ISO currency code |
| `description` | string | Link description |
| `url` | string | Full payment link URL |
| `qr_code_url` | string | QR code image URL |
| `is_active` | boolean | Whether link accepts payments |
| `uses_count` | integer | Number of times used |
| `max_uses` | integer | Maximum uses allowed (`null` = unlimited) |
| `expires_at` | string | Expiration timestamp (`null` = never) |
| `metadata` | object | Custom key-value pairs |
| `created_at` | string | ISO 8601 timestamp |
| `updated_at` | string | ISO 8601 timestamp |

## Create a Payment Link

Creates a new shareable payment link.

```bash
POST /v1/payment-links
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `merchant_slug` | string | Yes* | Merchant slug |
| `amount` | integer | No | Amount in cents (`null` = customer enters amount) |
| `currency` | string | No | Default: `BSD` |
| `description` | string | No | Link description |
| `max_uses` | integer | No | Maximum uses (`null` = unlimited) |
| `expires_at` | string | No | Expiration date (ISO 8601) |
| `metadata` | object | No | Custom key-value pairs |

*In production, merchant is derived from your API key.

### Example Request (Fixed Amount)

```bash
curl -X POST https://api.dberi.com/v1/payment-links \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "description": "Monthly Website Maintenance - March 2026",
    "expires_at": "2026-04-01T00:00:00Z",
    "metadata": {
      "invoice_number": "INV-2026-003",
      "customer_email": "client@company.bs"
    }
  }'
```

### Example Request (Custom Amount)

```bash
curl -X POST https://api.dberi.com/v1/payment-links \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Donation",
    "metadata": {
      "campaign": "hurricane_relief_2026"
    }
  }'
```

### Example Response

```json
{
  "id": "link-abc123",
  "merchant_id": "merchant-your-id",
  "merchant_slug": "island-coffee",
  "amount": 5000,
  "currency": "BSD",
  "description": "Monthly Website Maintenance - March 2026",
  "url": "https://dberi.com/pay/island-coffee/link-abc123",
  "qr_code_url": "https://dberi.com/qr/link-abc123",
  "is_active": true,
  "uses_count": 0,
  "expires_at": "2026-04-01T00:00:00Z",
  "metadata": {
    "invoice_number": "INV-2026-003",
    "customer_email": "client@company.bs"
  },
  "created_at": "2026-03-19T10:00:00Z"
}
```

## Retrieve a Payment Link

Retrieves payment link details.

```bash
GET /v1/payment-links/:id
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Payment link ID |

### Example Request

```bash
curl https://api.dberi.com/v1/payment-links/link-abc123 \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "id": "link-abc123",
  "merchant_slug": "island-coffee",
  "amount": 5000,
  "description": "Monthly Website Maintenance - March 2026",
  "url": "https://dberi.com/pay/island-coffee/link-abc123",
  "is_active": true,
  "uses_count": 3,
  "created_at": "2026-03-19T10:00:00Z"
}
```

## List All Payment Links

Retrieves a list of payment links for your merchant account.

```bash
GET /v1/payment-links
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of results (default: 20, max: 100) |
| `offset` | integer | Pagination offset |
| `is_active` | boolean | Filter by active status |

### Example Request

```bash
curl "https://api.dberi.com/v1/payment-links?limit=10&is_active=true" \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "payment_links": [
    {
      "id": "link-abc123",
      "amount": 5000,
      "description": "Monthly Website Maintenance",
      "url": "https://dberi.com/pay/island-coffee/link-abc123",
      "uses_count": 3
    }
  ],
  "total": 8,
  "limit": 10,
  "offset": 0
}
```

## Update a Payment Link

Updates payment link details.

```bash
PATCH /v1/payment-links/:id
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `description` | string | Update description |
| `is_active` | boolean | Activate or deactivate link |
| `max_uses` | integer | Update max uses |
| `expires_at` | string | Update expiration date |
| `metadata` | object | Update metadata |

::: warning Limited Updates
You cannot change `amount` or `merchant_slug` after creation. Create a new link instead.
:::

### Example Request

```bash
curl -X PATCH https://api.dberi.com/v1/payment-links/link-abc123 \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Monthly Website Maintenance - Updated",
    "max_uses": 1
  }'
```

## Deactivate a Payment Link

Deactivates a payment link (stops accepting payments).

```bash
POST /v1/payment-links/:id/deactivate
```

### Example Request

```bash
curl -X POST https://api.dberi.com/v1/payment-links/link-abc123/deactivate \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "id": "link-abc123",
  "is_active": false,
  "deactivated_at": "2026-03-19T15:00:00Z"
}
```

## Delete a Payment Link

Permanently deletes a payment link.

```bash
DELETE /v1/payment-links/:id
```

::: danger Destructive Action
This action cannot be undone. Consider deactivating instead.
:::

### Example Request

```bash
curl -X DELETE https://api.dberi.com/v1/payment-links/link-abc123 \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "id": "link-abc123",
  "deleted": true
}
```

## Get Payment Link Payments

Retrieves all payments made through a payment link.

```bash
GET /v1/payment-links/:id/payments
```

### Example Request

```bash
curl https://api.dberi.com/v1/payment-links/link-abc123/payments \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "payments": [
    {
      "id": "payment-xyz789",
      "amount": 5000,
      "status": "completed",
      "customer_id": "cust-12345",
      "completed_at": "2026-03-19T12:30:00Z"
    }
  ],
  "total": 3
}
```

## Use Cases

### Invoicing

Send payment links to clients:

```javascript
const link = await createPaymentLink({
  amount: 50000,
  description: 'Web Development - Project Alpha',
  max_uses: 1,
  expires_at: '2026-04-15T00:00:00Z',
  metadata: {
    invoice_number: 'INV-2026-015',
    project: 'alpha',
    client: 'Acme Corp'
  }
})

// Send via email
await sendEmail({
  to: 'client@acme.bs',
  subject: 'Invoice INV-2026-015',
  body: `Please pay your invoice: ${link.url}`
})
```

### Donations

Accept donations with custom amounts:

```javascript
const link = await createPaymentLink({
  amount: null, // Customer enters amount
  description: 'Support Our Cause',
  metadata: {
    campaign: 'education_fund'
  }
})

// Share on social media or website
console.log(link.url)
console.log(link.qr_code_url)
```

### Event Tickets

Sell tickets with limited quantity:

```javascript
const link = await createPaymentLink({
  amount: 7500,
  description: 'Junkanoo Summer Festival 2026 - VIP Ticket',
  max_uses: 50, // Only 50 tickets
  expires_at: '2026-06-01T00:00:00Z',
  metadata: {
    event: 'junkanoo_2026',
    ticket_type: 'vip'
  }
})
```

### Subscriptions

Monthly recurring link:

```javascript
const link = await createPaymentLink({
  amount: 2500,
  description: 'Monthly Gym Membership',
  metadata: {
    subscription: 'gym_monthly',
    auto_renew: true
  }
})

// Customer pays monthly using same link
```

## QR Codes

Each payment link includes a QR code:

```html
<!-- Display QR code -->
<img src="${link.qr_code_url}" alt="Scan to pay" />

<!-- Or generate from payload -->
<img src="https://api.qr-code-generator.com/qr?text=${link.url}" />
```

## Expiration and Limits

### Automatic Deactivation

Links automatically deactivate when:
- Expiration date passes
- Max uses reached

### Check Status

```bash
GET /v1/payment-links/:id
```

Response includes:
- `is_active`: `false` if deactivated
- `uses_count`: Number of payments made
- `max_uses`: Limit (if any)

## Errors

| Code | Description |
|------|-------------|
| `LINK_NOT_FOUND` | Payment link ID doesn't exist |
| `LINK_INACTIVE` | Link is deactivated |
| `LINK_EXPIRED` | Link expiration date passed |
| `LINK_MAX_USES` | Link has reached maximum uses |
| `INVALID_AMOUNT` | Amount must be positive or null |

## Webhooks

Subscribe to payment link events:

```
payment_link.created
payment_link.payment.completed
payment_link.deactivated
payment_link.expired
```

See [Webhooks API](/api/webhooks) for details.

## Next Steps

- [Payment Links Guide ](/guides/payment-links)
- [QR Code Payments ](/guides/qr-payments)
- [Accept Payments ](/guides/accept-payments)
