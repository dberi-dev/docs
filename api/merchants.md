# Merchants API

Manage your merchant account and settings.

## The Merchant Object

```json
{
  "id": "merchant-550e8400-e29b-41d4-a716-446655440000",
  "name": "Your Business Name",
  "slug": "yourbusiness",
  "category": "retail",
  "email": "hello@yourbusiness.com",
  "phone": "+1-242-555-0123",
  "description": "A great business serving the Bahamas",
  "website": "https://yourbusiness.com",
  "logo_url": "https://yourbusiness.com/logo.png",
  "address": {
    "line1": "123 Bay Street",
    "line2": "Suite 100",
    "city": "Nassau",
    "state": "New Providence",
    "postal_code": "00000",
    "country": "BS"
  },
  "business_type": "company",
  "tax_id": "123456789",
  "is_active": true,
  "verification_status": "verified",
  "payout_schedule": "weekly",
  "created_at": "2026-01-15T10:00:00Z",
  "updated_at": "2026-03-19T14:30:00Z"
}
```

### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique merchant identifier |
| `name` | string | Business name |
| `slug` | string | URL-friendly identifier (unique) |
| `category` | string | Business category (see categories below) |
| `email` | string | Contact email |
| `phone` | string | Contact phone number |
| `description` | string | Business description |
| `website` | string | Business website URL |
| `logo_url` | string | URL to business logo |
| `address` | object | Business address |
| `business_type` | string | `individual` or `company` |
| `tax_id` | string | Tax identification number |
| `is_active` | boolean | Account active status |
| `verification_status` | string | `pending`, `verified`, or `rejected` |
| `payout_schedule` | string | `daily`, `weekly`, or `monthly` |
| `created_at` | string | ISO 8601 timestamp |
| `updated_at` | string | ISO 8601 timestamp |

### Business Categories

```
retail, restaurant, grocery, gas_station, pharmacy, hotel,
professional_services, healthcare, education, entertainment,
transportation, utilities, nonprofit, other
```

## Create a Merchant

Creates a new merchant account.

```bash
POST /v1/merchants
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Business name |
| `slug` | string | Yes | URL-friendly identifier (lowercase, alphanumeric, hyphens) |
| `category` | string | Yes | Business category |
| `email` | string | Yes | Contact email |
| `phone` | string | No | Contact phone |
| `description` | string | No | Business description |
| `website` | string | No | Business website |
| `address` | object | No | Business address |
| `business_type` | string | No | Default: `company` |
| `tax_id` | string | No | Tax ID (required for payouts) |

### Example Request

```bash
curl -X POST https://api.dberi.com/v1/merchants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Island Coffee Shop",
    "slug": "island-coffee",
    "category": "restaurant",
    "email": "hello@islandcoffee.bs",
    "phone": "+1-242-555-0100",
    "description": "Fresh Bahamian coffee and pastries",
    "website": "https://islandcoffee.bs",
    "address": {
      "line1": "456 Bay Street",
      "city": "Nassau",
      "state": "New Providence",
      "country": "BS"
    }
  }'
```

### Example Response

```json
{
  "id": "merchant-abc123",
  "name": "Island Coffee Shop",
  "slug": "island-coffee",
  "category": "restaurant",
  "email": "hello@islandcoffee.bs",
  "phone": "+1-242-555-0100",
  "description": "Fresh Bahamian coffee and pastries",
  "website": "https://islandcoffee.bs",
  "address": {
    "line1": "456 Bay Street",
    "city": "Nassau",
    "state": "New Providence",
    "country": "BS"
  },
  "business_type": "company",
  "is_active": true,
  "verification_status": "pending",
  "payout_schedule": "weekly",
  "created_at": "2026-03-19T10:00:00Z",
  "updated_at": "2026-03-19T10:00:00Z"
}
```

## Retrieve a Merchant

Retrieves merchant details.

```bash
GET /v1/merchants/:id
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Merchant ID |

### Example Request

```bash
curl https://api.dberi.com/v1/merchants/merchant-abc123 \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "id": "merchant-abc123",
  "name": "Island Coffee Shop",
  "slug": "island-coffee",
  "category": "restaurant",
  "email": "hello@islandcoffee.bs",
  "verification_status": "verified",
  "created_at": "2026-03-19T10:00:00Z"
}
```

## Update a Merchant

Updates merchant information.

```bash
PATCH /v1/merchants/:id
```

### Parameters

All parameters from creation are available, all optional.

### Example Request

```bash
curl -X PATCH https://api.dberi.com/v1/merchants/merchant-abc123 \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Award-winning Bahamian coffee and pastries",
    "payout_schedule": "daily"
  }'
```

### Example Response

```json
{
  "id": "merchant-abc123",
  "name": "Island Coffee Shop",
  "description": "Award-winning Bahamian coffee and pastries",
  "payout_schedule": "daily",
  "updated_at": "2026-03-19T15:30:00Z"
}
```

## List All Merchants

Retrieves a list of all merchants (admin only).

```bash
GET /v1/merchants
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of results (default: 20, max: 100) |
| `offset` | integer | Pagination offset |
| `category` | string | Filter by category |
| `verification_status` | string | Filter by verification status |

### Example Request

```bash
curl "https://api.dberi.com/v1/merchants?limit=10&category=restaurant" \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "merchants": [
    {
      "id": "merchant-abc123",
      "name": "Island Coffee Shop",
      "slug": "island-coffee",
      "category": "restaurant"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

## Delete a Merchant

Deactivates a merchant account.

```bash
DELETE /v1/merchants/:id
```

::: warning Destructive Action
This deactivates the account but preserves transaction history. Contact support to permanently delete.
:::

### Example Request

```bash
curl -X DELETE https://api.dberi.com/v1/merchants/merchant-abc123 \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "id": "merchant-abc123",
  "is_active": false,
  "deleted_at": "2026-03-19T16:00:00Z"
}
```

## Get Merchant Balance

Retrieves current wallet balance.

```bash
GET /v1/merchants/:id/balance
```

### Example Request

```bash
curl https://api.dberi.com/v1/merchants/merchant-abc123/balance \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "available": 92000,
  "pending": 15000,
  "reserved": 5000,
  "total": 112000,
  "currency": "BSD"
}
```

**Amounts in cents:**
- Available: $920.00
- Pending: $150.00
- Reserved: $50.00
- Total: $1,120.00

## Verification

New merchants must complete verification to receive payouts.

### Verification Requirements

| Business Type | Requirements |
|--------------|--------------|
| **Individual** | • Government ID<br>• Proof of address<br>• Tax ID |
| **Company** | • Business registration<br>• Tax ID (EIN)<br>• Business address<br>• Owner ID |

### Verification Status

| Status | Description |
|--------|-------------|
| `pending` | Verification not started or in review |
| `verified` | Account verified, can receive payouts |
| `rejected` | Verification failed (see rejection reason) |

### Submit Verification Documents

```bash
POST /v1/merchants/:id/verification
```

```bash
curl -X POST https://api.dberi.com/v1/merchants/merchant-abc123/verification \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -F "government_id=@passport.pdf" \
  -F "proof_of_address=@utility_bill.pdf" \
  -F "business_registration=@registration.pdf"
```

## Errors

| Code | Description |
|------|-------------|
| `MERCHANT_NOT_FOUND` | Merchant ID doesn't exist |
| `SLUG_TAKEN` | Slug already in use |
| `INVALID_CATEGORY` | Invalid business category |
| `VERIFICATION_REQUIRED` | Action requires verified account |
| `INACTIVE_MERCHANT` | Merchant account is deactivated |

## Webhooks

Subscribe to merchant events:

```
merchant.created
merchant.updated
merchant.verified
merchant.deactivated
```

See [Webhooks API](/api/webhooks) for details.

## Next Steps

- [Create Payments ](/api/payments)
- [View Settlement Info ](/concepts/settlement)
- [Verification Guide ](/guides/verification)
