# Error Handling

Learn how to handle errors gracefully in your Dberi integration.

## Error Response Format

All Dberi API errors follow a consistent format:

```json
{
  "error": "Insufficient balance",
  "code": "INSUFFICIENT_BALANCE",
  "details": "Customer wallet balance is too low to complete this payment"
}
```

### Error Object

| Field | Type | Description |
|-------|------|-------------|
| `error` | string | Human-readable error message |
| `code` | string | Machine-readable error code |
| `details` | string | Additional context about the error |

## HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| `200` | Success | Request completed successfully |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Invalid or missing API key |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `422` | Unprocessable | Validation failed |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error (contact support) |
| `503` | Service Unavailable | Temporary outage |

## Common Error Codes

### Payment Errors

| Code | Description | Solution |
|------|-------------|----------|
| `PAYMENT_NOT_FOUND` | Payment ID doesn't exist | Verify payment ID is correct |
| `PAYMENT_EXPIRED` | Payment session expired (24h) | Create new payment session |
| `PAYMENT_ALREADY_COMPLETED` | Payment already processed | Check payment status before retrying |
| `PAYMENT_CANCELED` | Payment was canceled | Create new payment |
| `INSUFFICIENT_BALANCE` | Customer has insufficient funds | Ask customer to top up wallet |
| `INVALID_PIN` | Wrong PIN entered | Customer should retry with correct PIN |
| `PIN_ATTEMPTS_EXCEEDED` | Too many failed PIN attempts | Account temporarily locked |

### Merchant Errors

| Code | Description | Solution |
|------|-------------|----------|
| `MERCHANT_NOT_FOUND` | Merchant ID doesn't exist | Verify merchant ID |
| `INACTIVE_MERCHANT` | Merchant account deactivated | Contact support |
| `MERCHANT_NOT_VERIFIED` | Merchant not verified for payouts | Complete verification |
| `SLUG_TAKEN` | Merchant slug already in use | Choose different slug |

### Validation Errors

| Code | Description | Solution |
|------|-------------|----------|
| `INVALID_AMOUNT` | Amount must be positive integer | Use cents (2500 for $25.00) |
| `INVALID_CURRENCY` | Currency not supported | Use `BSD` |
| `INVALID_EMAIL` | Email format invalid | Check email format |
| `INVALID_PHONE` | Phone number invalid | Use E.164 format (+12425551234) |
| `MISSING_REQUIRED_FIELD` | Required field not provided | Include all required fields |

### Authentication Errors

| Code | Description | Solution |
|------|-------------|----------|
| `INVALID_API_KEY` | API key is invalid | Check API key in environment |
| `EXPIRED_API_KEY` | API key expired | Rotate to new key |
| `MISSING_API_KEY` | No API key provided | Include Authorization header |

### Rate Limiting

| Code | Description | Solution |
|------|-------------|----------|
| `RATE_LIMIT_EXCEEDED` | Too many requests | Implement exponential backoff |

## Handling Errors

### Basic Error Handling

```javascript
try {
  const response = await fetch('https://api.dberi.com/v1/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount: 2500 })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  const payment = await response.json()
  return payment

} catch (error) {
  console.error('Payment creation failed:', error.message)
  throw error
}
```

### Detailed Error Handling

```javascript
async function createPayment(data) {
  try {
    const response = await fetch('https://api.dberi.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      // Handle specific error codes
      switch (result.code) {
        case 'INSUFFICIENT_BALANCE':
          throw new InsufficientBalanceError(result.details)

        case 'PAYMENT_EXPIRED':
          throw new PaymentExpiredError(result.details)

        case 'MERCHANT_NOT_FOUND':
          throw new MerchantNotFoundError(result.details)

        case 'INVALID_AMOUNT':
          throw new ValidationError(result.details)

        default:
          throw new DberiError(result.error, result.code)
      }
    }

    return result

  } catch (error) {
    if (error instanceof DberiError) {
      // Handle Dberi-specific errors
      handleDberiError(error)
    } else if (error instanceof NetworkError) {
      // Handle network errors
      handleNetworkError(error)
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error)
    }

    throw error
  }
}
```

### Custom Error Classes

```javascript
class DberiError extends Error {
  constructor(message, code, details) {
    super(message)
    this.name = 'DberiError'
    this.code = code
    this.details = details
  }
}

class InsufficientBalanceError extends DberiError {
  constructor(details) {
    super('Customer has insufficient balance', 'INSUFFICIENT_BALANCE', details)
    this.name = 'InsufficientBalanceError'
  }
}

class PaymentExpiredError extends DberiError {
  constructor(details) {
    super('Payment session expired', 'PAYMENT_EXPIRED', details)
    this.name = 'PaymentExpiredError'
  }
}

class ValidationError extends DberiError {
  constructor(details) {
    super('Validation failed', 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

// Usage
try {
  await createPayment({ amount: 2500 })
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    // Show customer top-up option
    showTopUpPrompt()
  } else if (error instanceof PaymentExpiredError) {
    // Create new payment
    await retryPayment()
  } else if (error instanceof ValidationError) {
    // Show validation error to user
    showValidationError(error.details)
  }
}
```

## User-Friendly Error Messages

### Convert Technical Errors

```javascript
function getUserMessage(error) {
  const messages = {
    'INSUFFICIENT_BALANCE': 'You don\'t have enough funds. Please top up your wallet.',
    'PAYMENT_EXPIRED': 'This payment link has expired. Please request a new one.',
    'INVALID_PIN': 'Incorrect PIN. Please try again.',
    'PIN_ATTEMPTS_EXCEEDED': 'Too many failed attempts. Please try again in 30 minutes.',
    'MERCHANT_NOT_FOUND': 'Store not found. Please contact support.',
    'PAYMENT_ALREADY_COMPLETED': 'This payment has already been processed.'
  }

  return messages[error.code] || 'Something went wrong. Please try again.'
}

// Usage
try {
  await processPayment()
} catch (error) {
  const userMessage = getUserMessage(error)
  showErrorToUser(userMessage)
}
```

### Show Error in UI

```javascript
function showError(error) {
  const errorDiv = document.getElementById('error-message')

  errorDiv.innerHTML = `
    <div class="alert alert-danger">
      <strong>Payment Failed</strong>
      <p>${getUserMessage(error)}</p>
      ${getRecoveryAction(error)}
    </div>
  `
}

function getRecoveryAction(error) {
  switch (error.code) {
    case 'INSUFFICIENT_BALANCE':
      return '<button onclick="topUp()">Top Up Wallet</button>'

    case 'PAYMENT_EXPIRED':
      return '<button onclick="retryCheckout()">Try Again</button>'

    case 'INVALID_PIN':
      return '<button onclick="resetPin()">Reset PIN</button>'

    default:
      return '<button onclick="contactSupport()">Contact Support</button>'
  }
}
```

## Retry Logic

### Exponential Backoff

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  let lastError

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on validation errors
      if (error.code === 'INVALID_AMOUNT' ||
          error.code === 'MERCHANT_NOT_FOUND') {
        throw error
      }

      // Don't retry on final attempt
      if (i === maxRetries - 1) {
        throw error
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000
      console.log(`Retry ${i + 1}/${maxRetries} in ${delay}ms...`)
      await sleep(delay)
    }
  }

  throw lastError
}

// Usage
const payment = await retryWithBackoff(() =>
  createPayment({ amount: 2500 })
)
```

### Retry Specific Errors

```javascript
async function createPaymentWithRetry(data, options = {}) {
  const { maxRetries = 3, retryDelay = 1000 } = options

  let attempts = 0

  while (attempts < maxRetries) {
    try {
      return await createPayment(data)

    } catch (error) {
      attempts++

      // Retry on network errors and 5xx errors
      const shouldRetry = (
        error.code === 'NETWORK_ERROR' ||
        error.code === 'SERVER_ERROR' ||
        (error.statusCode >= 500 && error.statusCode < 600)
      )

      if (!shouldRetry || attempts >= maxRetries) {
        throw error
      }

      console.log(`Retrying... (${attempts}/${maxRetries})`)
      await sleep(retryDelay * attempts)
    }
  }
}
```

## Idempotency

### Prevent Duplicate Payments

Use idempotency keys to safely retry:

```javascript
async function createPaymentSafely(data) {
  // Generate idempotency key from order ID
  const idempotencyKey = `order-${data.order_id}-${Date.now()}`

  try {
    const response = await fetch('https://api.dberi.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(data)
    })

    return await response.json()

  } catch (error) {
    // Safe to retry with same idempotency key
    // Will return original response if already created
    return await retryWithSameKey(data, idempotencyKey)
  }
}
```

## Logging Errors

### Log to Console

```javascript
function logError(error, context = {}) {
  console.error('Dberi API Error', {
    timestamp: new Date().toISOString(),
    code: error.code,
    message: error.message,
    details: error.details,
    context,
    stack: error.stack
  })
}

// Usage
try {
  await createPayment(data)
} catch (error) {
  logError(error, {
    order_id: data.order_id,
    customer_id: data.customer_id,
    amount: data.amount
  })
  throw error
}
```

### Log to External Service

```javascript
const Sentry = require('@sentry/node')

function reportError(error, context = {}) {
  Sentry.captureException(error, {
    tags: {
      api: 'dberi',
      code: error.code
    },
    extra: {
      details: error.details,
      ...context
    }
  })
}

// Usage
try {
  await createPayment(data)
} catch (error) {
  reportError(error, {
    order_id: data.order_id,
    payment_amount: data.amount
  })
  throw error
}
```

## Testing Error Scenarios

### Trigger Test Errors

Use specific amounts to trigger test errors:

```javascript
// Test insufficient balance
await createPayment({ amount: 1 }) // Triggers INSUFFICIENT_BALANCE

// Test invalid amount
await createPayment({ amount: -100 }) // Triggers INVALID_AMOUNT

// Test missing field
await createPayment({}) // Triggers MISSING_REQUIRED_FIELD
```

### Mock Error Responses

```javascript
// test/payment.test.js
describe('Payment error handling', () => {
  it('handles insufficient balance error', async () => {
    // Mock API response
    fetchMock.post('https://api.dberi.com/v1/payments', {
      status: 422,
      body: {
        error: 'Insufficient balance',
        code: 'INSUFFICIENT_BALANCE',
        details: 'Customer wallet balance is too low'
      }
    })

    // Test error handling
    try {
      await createPayment({ amount: 2500 })
      fail('Should have thrown error')
    } catch (error) {
      expect(error.code).toBe('INSUFFICIENT_BALANCE')
      expect(getUserMessage(error)).toContain('top up')
    }
  })
})
```

## Best Practices

### 1. Always Handle Errors

```javascript
//  Good
try {
  const payment = await createPayment(data)
  return payment
} catch (error) {
  handleError(error)
  throw error
}

//  Bad
const payment = await createPayment(data) // No error handling
```

### 2. Show User-Friendly Messages

```javascript
//  Good
"You don't have enough funds. Please top up your wallet."

//  Bad
"Error: INSUFFICIENT_BALANCE - Customer wallet balance too low to complete transaction"
```

### 3. Log All Errors

```javascript
//  Good
catch (error) {
  console.error('Payment failed:', {
    code: error.code,
    order_id: orderId,
    timestamp: new Date()
  })
  throw error
}

//  Bad
catch (error) {
  // Silent failure - no logging
}
```

### 4. Provide Recovery Actions

```javascript
//  Good
if (error.code === 'INSUFFICIENT_BALANCE') {
  showTopUpButton()
} else if (error.code === 'PAYMENT_EXPIRED') {
  showRetryButton()
}

//  Bad
alert('Error: ' + error.message) // No recovery option
```

## Next Steps

- [Accept Payments ](/guides/accept-payments)
- [Webhook Integration ](/guides/webhooks)
- [API Reference ](/api/overview)
