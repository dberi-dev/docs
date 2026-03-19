# Authentication

Dberi uses API keys to authenticate requests from your server. Your API keys carry many privileges, so be sure to keep them secure!

## API Keys

Every merchant receives two types of API keys:

| Type | Prefix | Usage |
|------|--------|-------|
| **Test Keys** | `sk_test_` | For development and testing |
| **Live Keys** | `sk_live_` | For production |

::: warning Keep Your Keys Secret
Never expose your secret API keys in client-side code, public repositories, or version control systems. Only use them server-side.
:::

## Getting Your API Keys

**Development:**
Currently, you use your `merchant_id` directly in API requests during development.

**Production:**
Upon merchant registration and approval, you'll receive your API keys via email and in your merchant dashboard.

## Making Authenticated Requests

Include your API key in the `Authorization` header of all requests:

```bash
curl https://api.dberi.com/v1/payments \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2500, "currency": "BSD"}'
```

## Development vs Production

### Development Mode

For local development and testing:

```bash
# Use merchant_id in the request body
curl -X POST https://api.dberi.com/v1/payments \
  -H "Content-Type: application/json" \
  -d '{
    "merchant_id": "merchant-550e8400",
    "amount": 2500,
    "currency": "BSD"
  }'
```

### Production Mode

For live transactions:

```bash
# Use API key in Authorization header
curl -X POST https://api.dberi.com/v1/payments \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "currency": "BSD"
  }'
```

The `merchant_id` is automatically derived from your API key in production.

## Authentication Errors

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 401 | `INVALID_API_KEY` | The API key provided is invalid |
| 401 | `EXPIRED_API_KEY` | The API key has expired |
| 401 | `MISSING_API_KEY` | No API key was provided |
| 403 | `INSUFFICIENT_PERMISSIONS` | API key lacks required permissions |

Example error response:

```json
{
  "error": "Invalid API key provided",
  "code": "INVALID_API_KEY",
  "details": "The API key is malformed or does not exist"
}
```

## Best Practices

### 1. Rotate Keys Regularly

Rotate your API keys every 90 days or immediately if compromised:

```bash
# Generate a new key via dashboard or API
POST /v1/merchants/:id/keys/rotate
```

### 2. Use Environment Variables

Store API keys in environment variables, never hardcode them:

```javascript
// Good
const apiKey = process.env.DBERI_API_KEY

// Bad
const apiKey = 'sk_live_abc123'
```

### 3. Separate Test and Live Keys

Always use test keys during development:

```bash
# .env.development
DBERI_API_KEY=sk_test_development_key

# .env.production
DBERI_API_KEY=sk_live_production_key
```

### 4. Monitor API Key Usage

Check your dashboard regularly for:
- Unusual request patterns
- Failed authentication attempts
- Requests from unexpected IP addresses

## IP Allowlisting (Coming Soon)

Restrict API key usage to specific IP addresses:

```json
{
  "allowed_ips": [
    "192.168.1.100",
    "10.0.0.50"
  ]
}
```

## Webhook Signing

Webhooks are signed with a separate signing secret to verify authenticity. See [Webhook Integration](/guides/webhooks) for details.

## Support

If you suspect your API key has been compromised:

1. Immediately rotate your keys in the dashboard
2. Contact support at security@dberi.io
3. Review recent transactions for unauthorized activity

[View API Reference ](/api/overview)
