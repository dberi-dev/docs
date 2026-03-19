# How It Works

Dberi is a payment processing platform that enables Bahamian businesses to accept payments from customers. Here's how the system works behind the scenes.

## System Architecture

```
            
   Your       1    Dberi     2   Customer   
   Server                API               Checkout   
            
                                                   
                                                   
       43
         Webhook           Database            Payment
       Notification                          Completion
```

## Payment Flow

### 1. Payment Session Creation

Your server creates a payment session:

```bash
POST /v1/payments
{
  "merchant_id": "merchant-abc123",
  "amount": 2500,
  "currency": "BSD",
  "description": "Order #1234"
}
```

Dberi creates a secure payment session and returns:
- **Payment ID**: Unique identifier for this transaction
- **Checkout URL**: Where you send your customer
- **QR Code**: For mobile/in-person payments
- **Expiration**: 24-hour validity period

### 2. Customer Payment

The customer completes payment via:
- **Hosted Checkout Page**: Dberi-hosted secure payment form
- **QR Code Scan**: Mobile wallet payment
- **Payment Link**: Direct link sent via email/SMS

### 3. Payment Processing

When the customer submits payment:

1. **Verification Check**: Dberi determines required verification based on amount
   - ≤ $2.00: No verification (instant approval)
   - $2.01 - $50.00: PIN verification
   - > $50.00: Face ID / Biometric verification

2. **Balance Check**: Customer's wallet is verified for sufficient funds

3. **Transaction Creation**: Payment is recorded in the ledger with double-entry bookkeeping:
   - Debit customer wallet
   - Credit merchant wallet
   - Record fee to platform

4. **Status Update**: Payment status changes from `created`  `pending`  `completed`

### 4. Webhook Notification

Dberi sends a webhook to your server:

```json
{
  "event": "payment.completed",
  "payment_id": "payment-abc123",
  "merchant_id": "merchant-abc123",
  "amount": 2500,
  "status": "completed",
  "timestamp": "2026-03-19T10:30:00Z"
}
```

Your server:
1. Verifies the webhook signature
2. Updates order status in your database
3. Fulfills the order (ships product, grants access, etc.)

### 5. Settlement

Funds are settled to your merchant wallet:
- **Instant**: Funds available immediately in your Dberi wallet
- **Payout**: Automated daily/weekly payouts to your bank account
- **Fee Deduction**: Processing fees automatically deducted

## Wallet System

### Merchant Wallet

Every merchant has a wallet that:
- Receives customer payments instantly
- Holds funds until payout
- Tracks transaction history and fees
- Provides real-time balance

### Customer Wallet

Customers can:
- Top up wallet from credit/debit cards
- Make instant payments to merchants
- Transfer money to other users
- Withdraw to bank accounts

### Platform Wallet

The platform wallet:
- Collects processing fees
- Manages system funds
- Handles refunds and adjustments

## Ledger System

All transactions use double-entry bookkeeping:

```
Payment Example ($25.00 to merchant):

 Entry 1: Customer Wallet                   
   Type:    Debit                           
   Amount:  $25.00                          
   Balance: $100.00  $75.00                



 Entry 2: Merchant Wallet                   
   Type:    Credit                          
   Amount:  $24.25 (after $0.75 fee)        
   Balance: $500.00  $524.25               



 Entry 3: Platform Wallet                   
   Type:    Credit (Fee)                    
   Amount:  $0.75 (3% fee)                  
   Balance: $1000.00  $1000.75             

```

This ensures:
- Every transaction is balanced
- Audit trail for all funds
- Easy reconciliation
- Fraud detection

## Security Measures

### 1. Verification Thresholds

Payments require different levels of verification:
- Small amounts: Frictionless (fast checkout)
- Medium amounts: PIN protection
- Large amounts: Biometric security

### 2. Payment Expiration

Payment sessions expire after 24 hours to:
- Prevent stale payment links
- Reduce fraud risk
- Maintain accurate inventory

### 3. Idempotency

Duplicate payment prevention:
```bash
curl -X POST https://api.dberi.com/v1/payments \
  -H "Idempotency-Key: order-12345" \
  -d '{"amount": 2500}'
```

Same key = same response (no duplicate charge)

### 4. Webhook Signatures

All webhooks are cryptographically signed to verify authenticity.

## Payment States

| State | Description | Customer Action | Merchant Action |
|-------|-------------|-----------------|-----------------|
| `created` | Session created | Can start payment | Wait for customer |
| `pending` | Payment initiated | Completing verification | Wait for completion |
| `requires_action` | Needs verification | Enter PIN/Face ID | Wait for customer |
| `completed` | Payment successful | Done | Fulfill order |
| `failed` | Payment failed | Try again | Don't fulfill |
| `expired` | Session expired | Create new payment | Create new session |

## Transaction Types

### Payment
Customer pays merchant for goods/services.

### Refund
Merchant returns funds to customer.

### Top-up
Customer adds funds to wallet from card.

### Transfer
Customer sends money to another user (P2P).

### Withdrawal
User withdraws funds to bank account.

### Settlement
Platform pays out merchant earnings.

## Next Steps

- [Learn about Payment Modes ](/concepts/payment-modes)
- [Understand Payment Flow ](/concepts/payment-flow)
- [View Settlement Options ](/concepts/settlement)
