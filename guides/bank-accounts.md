# Bank Account Management

Learn how to add and manage bank accounts for receiving payouts from your merchant account.

## Overview

Bank accounts allow you to receive payouts from your merchant balance to your business bank account. You can add multiple bank accounts and set one as your default payout destination.

## Security

- Account numbers are **encrypted** at rest
- Only the **last 4 digits** are visible in API responses
- HTTPS required for all API requests
- Authentication required for all operations

## Add a Bank Account

Add a new bank account to your merchant profile:

```bash
POST /v1/merchants/{merchant_id}/bank-accounts
```

### Request Body

```json
{
  "bank_name": "Bank of the Bahamas",
  "account_holder_name": "Island Cafe Ltd",
  "account_number": "12345678901234",
  "routing_number": "123456789",
  "account_type": "business"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bank_name` | string | Yes | Name of your bank |
| `account_holder_name` | string | Yes | Name on the account (must match business name) |
| `account_number` | string | Yes | Full bank account number (encrypted after storage) |
| `routing_number` | string | No | Bank routing number (for US/Bahamian banks) |
| `swift_code` | string | No | SWIFT code (for international transfers) |
| `branch_code` | string | No | Branch code (for local banks) |
| `account_type` | string | No | Type: `checking`, `savings`, or `business` |
| `is_default` | boolean | No | Set as default payout account (default: `false`) |

### Response

```json
{
  "id": "ba_7d8f9a0b1c2d3e4f",
  "merchant_id": "merch_abc123",
  "bank_name": "Bank of the Bahamas",
  "account_holder_name": "Island Cafe Ltd",
  "account_number_last4": "1234",
  "routing_number": "123456789",
  "account_type": "business",
  "is_default": false,
  "is_verified": false,
  "is_active": true,
  "created_at": "2026-03-25T08:30:00Z"
}
```

## List Bank Accounts

Retrieve all bank accounts for your merchant account:

```bash
GET /v1/merchants/{merchant_id}/bank-accounts
```

### Response

```json
[
  {
    "id": "ba_7d8f9a0b1c2d3e4f",
    "merchant_id": "merch_abc123",
    "bank_name": "Bank of the Bahamas",
    "account_holder_name": "Island Cafe Ltd",
    "account_number_last4": "1234",
    "is_default": true,
    "is_verified": true,
    "is_active": true,
    "created_at": "2026-03-25T08:30:00Z"
  }
]
```

Accounts are returned in order:
1. Default account first
2. Then by creation date (newest first)

## Get Single Bank Account

Retrieve details of a specific bank account:

```bash
GET /v1/merchants/{merchant_id}/bank-accounts/{account_id}
```

## Set Default Bank Account

Set a bank account as your default payout destination:

```bash
PUT /v1/merchants/{merchant_id}/bank-accounts/{account_id}/set-default
```

When you set a new default:
- Previous default is automatically unset
- All future payouts use this account
- Existing pending payouts are not affected

### Response

```json
{
  "id": "ba_7d8f9a0b1c2d3e4f",
  "merchant_id": "merch_abc123",
  "bank_name": "Bank of the Bahamas",
  "account_holder_name": "Island Cafe Ltd",
  "account_number_last4": "1234",
  "is_default": true,
  "is_verified": true,
  "is_active": true
}
```

## Delete Bank Account

Deactivate a bank account (soft delete):

```bash
DELETE /v1/merchants/{merchant_id}/bank-accounts/{account_id}
```

### Response

```json
{
  "success": true,
  "message": "Bank account deleted successfully"
}
```

**Note**: Bank accounts are soft-deleted (marked as inactive) to maintain audit trails. You cannot delete your only active bank account.

## Best Practices

### Security
- ✅ Never log full account numbers
- ✅ Use HTTPS for all API calls
- ✅ Store API keys securely (never in client code)
- ✅ Validate account numbers before submission

### Operations
- ✅ Set one account as default for automatic payouts
- ✅ Verify account details before adding
- ✅ Keep multiple accounts for backup
- ✅ Update account info if bank details change

### Compliance
- ✅ Ensure account holder name matches business registration
- ✅ Verify account is authorized to receive business funds
- ✅ Keep bank account information up to date

## Account Verification

Bank accounts start as **unverified**. Verification methods:

1. **Micro-deposit** (Coming soon)
   - We send 2 small deposits to your account
   - You confirm the amounts
   - Account is verified

2. **Manual verification**
   - Contact support with bank statement
   - Team verifies and activates

3. **Instant verification** (Future)
   - Connect via Plaid or bank API
   - Instant verification

## Payout Schedule

Once verified, payouts are processed:
- **Daily**: If balance > $100
- **Weekly**: Every Friday for smaller balances
- **Manual**: Request anytime (minimum $25)

Payouts typically arrive in **2-3 business days** via ACH.

## Common Errors

### Invalid Account Number
```json
{
  "error": "bad_request",
  "message": "Invalid bank account format"
}
```
**Solution**: Ensure account number is at least 8 digits.

### Bank Account Not Found
```json
{
  "error": "not_found",
  "message": "Bank account not found"
}
```
**Solution**: Verify the account ID and merchant ID are correct.

## Need Help?

- View [Webhooks Guide](/guides/webhooks) for payout notifications
