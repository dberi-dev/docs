# Settlement

Learn how and when you receive payouts from customer payments.

## How Settlement Works

When customers pay you through Dberi, funds flow through three stages:

```
Customer Payment
       
Merchant Wallet (Instant)
       
Bank Account (Scheduled Payout)
```

## Settlement Timeline

### Instant Availability

Funds are available in your Dberi wallet **immediately** after a successful payment:

```
Customer pays: 10:30 AM
Merchant wallet credited: 10:30 AM 
```

You can:
- View balance in dashboard
- Use funds for refunds
- Track transaction history
- Transfer to other merchants

### Bank Payouts

Funds are transferred to your bank account on a schedule:

| Payout Schedule | Transfer Time | Example |
|----------------|---------------|---------|
| **Daily** | Next business day | Payment Mon 2PM  Payout Tue 9AM |
| **Weekly** | Every Friday | Payments Mon-Sun  Payout Fri 9AM |
| **Monthly** | 1st of month | Payments in March  Payout Apr 1st |
| **On-Demand** | Instant (fee applies) | Request anytime  Arrives in 30min |

::: tip Default Schedule
New merchants default to **weekly payouts**. You can change this in your dashboard.
:::

## Payout Calculation

### Net Amount

Your payout is calculated as:

```
Gross Payments:        $1,000.00
- Processing Fees:     -   $30.00 (3%)
- Refunds:             -   $50.00
- Chargebacks:         -    $0.00

Net Payout:            $  920.00
```

### Fee Structure

| Transaction Type | Fee |
|-----------------|-----|
| **Card Payments** | 3% + $0.30 |
| **Wallet Payments** | 2.5% |
| **International** | 3.5% + $0.50 |
| **Refunds** | Fee refunded |

**Example:**

```
Payment amount:     $25.00
Processing fee:     $ 0.75 (3%)
+ Fixed fee:        $ 0.30

You receive:        $23.95
```

## Payout Methods

### Bank Transfer (ACH)

**Free** | 1-3 business days

```json
{
  "account_holder": "Your Business Name",
  "routing_number": "123456789",
  "account_number": "987654321",
  "account_type": "checking"
}
```

### Instant Payout

**1% fee** | 30 minutes

Request immediate payout to your debit card:

```bash
POST /v1/payouts
{
  "amount": 50000,
  "method": "instant",
  "destination": "card_abc123"
}
```

::: warning Instant Payout Limits
- Minimum: $10.00
- Maximum: $10,000 per payout
- Daily limit: $50,000
:::

## Payout Statuses

| Status | Description | Action |
|--------|-------------|--------|
| `pending` | Scheduled for payout | Wait for processing |
| `in_transit` | Sent to bank | Arriving 1-3 days |
| `paid` | Successfully transferred | Check bank account |
| `failed` | Bank rejected | Update bank details |
| `returned` | Funds returned | Contact support |

## Managing Settlements

### View Upcoming Payouts

Check your dashboard or API:

```bash
GET /v1/payouts/upcoming
```

**Response:**

```json
{
  "next_payout": {
    "date": "2026-03-21",
    "amount": 92000,
    "currency": "BSD",
    "transactions_count": 47
  },
  "available_now": 15000,
  "pending": 5000
}
```

### View Payout History

```bash
GET /v1/payouts
```

**Response:**

```json
{
  "payouts": [
    {
      "id": "payout-abc123",
      "amount": 92000,
      "status": "paid",
      "arrival_date": "2026-03-20",
      "method": "ach",
      "destination": "ba_...4242"
    }
  ]
}
```

### Change Payout Schedule

```bash
PATCH /v1/merchants/:id
{
  "payout_schedule": "daily"
}
```

## Reserve and Holds

### Rolling Reserve

Dberi may hold a percentage of funds as protection against refunds and chargebacks:

```
Standard Reserve: 5% for 7 days
High-Risk Reserve: 10% for 14 days
```

**Example:**

```
Payment received:    $100.00
Instant available:   $ 95.00
Reserved (5%):       $  5.00
Released in 7 days:  $  5.00
```

### Payment Holds

Individual payments may be held for review:

| Reason | Hold Duration |
|--------|--------------|
| High amount | 24 hours |
| Unusual activity | 1-3 days |
| Fraud review | Up to 7 days |
| Chargeback risk | 30 days |

## Balances

### Available Balance

Funds you can withdraw immediately:

```
Available: $920.00
```

### Pending Balance

Funds being processed or held:

```
Pending: $150.00
  - Reserve: $50.00 (releases Mar 25)
  - Processing: $100.00 (releases Mar 21)
```

### Total Balance

Sum of available and pending:

```
Total: $1,070.00
```

## Reconciliation

### Daily Reports

Receive daily settlement reports via email or API:

```json
{
  "report_date": "2026-03-19",
  "gross_volume": 105000,
  "refunds": 5000,
  "fees": 3150,
  "net_amount": 96850,
  "payout_date": "2026-03-21"
}
```

### Transaction Export

Export transactions for accounting:

```bash
GET /v1/transactions/export?start_date=2026-03-01&end_date=2026-03-31
```

Returns CSV with:
- Transaction ID
- Date/Time
- Amount
- Fee
- Net
- Status
- Customer ID

## Tax Reporting

### 1099-K Forms

If you process over $600 in a year, Dberi will issue a 1099-K form for tax reporting.

**Requirements:**
- Provide Tax ID (EIN or SSN)
- Verify business address
- Confirm business type

### Sales Tax

Dberi does not collect or remit sales tax. You're responsible for:
- Collecting appropriate taxes
- Filing tax returns
- Remitting to tax authorities

## Refunds and Chargebacks

### Refunds

Refunds are deducted from your next payout:

```
Upcoming payout:     $1,000.00
Refunds this period: -  $50.00

Net payout:          $  950.00
```

Processing fees are refunded to you when you issue a refund.

### Chargebacks

If a customer disputes a payment:

1. **Notification**: We alert you via email and webhook
2. **Evidence**: You have 7 days to submit evidence
3. **Hold**: Disputed amount is held from payouts
4. **Resolution**: Funds released or permanently held
5. **Fee**: $15 chargeback fee if you lose

## Negative Balance

If refunds/chargebacks exceed your available balance:

```
Available balance:    $100.00
Refund requested:     $150.00

Negative balance:    -$ 50.00
```

**Resolution:**
- Negative balance deducted from future payments
- Bank account automatically debited
- Grace period: 7 days before account restriction

## International Settlements

### Multi-Currency

Accept payments in multiple currencies:

```
Customer pays:   $100 USD
Converted to:    $100 BSD (1:1 peg)
You receive:     $97 BSD (after fees)
```

### Currency Conversion

For non-BSD currencies:

```
Customer pays:   €50 EUR
Exchange rate:   1.05 BSD/EUR
Gross amount:    $52.50 BSD
Fees (3.5%):     $ 1.84
You receive:     $50.66 BSD
```

## Best Practices

### 1. Monitor Your Balance

Check your balance regularly to ensure healthy cash flow:

```bash
# Daily balance check
curl https://api.dberi.com/v1/balance \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### 2. Plan for Reserves

Account for the rolling reserve in your cash flow projections:

```
Expected deposits: $10,000/week
5% reserve:        $   500/week
Net available:     $ 9,500/week
```

### 3. Reconcile Daily

Match Dberi payouts with your bank statements:

```
Dberi payout date:    Mar 20
Dberi payout amount:  $920.00
Bank deposit date:    Mar 21
Bank deposit amount:  $920.00 
```

### 4. Set Up Alerts

Configure balance alerts:

```
Alert when balance < $100
Alert for failed payouts
Alert for large refunds
```

## Support

Need help with settlements?

- Email: settlements@dberi.com
- Dashboard: Live chat support
- Phone: +1-242-XXX-XXXX (Mon-Fri 9AM-5PM)

## Next Steps

- [View API Reference ](/api/overview)
- [Accept Payments ](/guides/accept-payments)
- [Handle Refunds ](/guides/errors)
