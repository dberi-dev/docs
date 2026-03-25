# Inventory Management

Automatically track product stock levels and prevent overselling with built-in inventory management.

## Overview

When customers place orders, the system automatically:
- ✅ Decreases stock quantities
- ✅ Prevents orders when stock is insufficient
- ✅ Updates inventory in real-time
- ✅ Provides stock visibility in your dashboard

## How It Works

### 1. Add Products with Stock Tracking

When creating products, include the `stock_quantity` field:

```bash
POST /v1/merchants/{merchant_id}/products
```

```json
{
  "name": "Coconut Water",
  "description": "Fresh local coconut water",
  "price": 500,
  "currency": "BSD",
  "stock_quantity": 100,
  "category": "beverages"
}
```

### 2. Orders Automatically Update Stock

When a customer orders:

**Before Order:**
```json
{
  "id": "prod_abc123",
  "name": "Coconut Water",
  "stock_quantity": 100
}
```

**Customer Orders 3 units**

**After Order:**
```json
{
  "id": "prod_abc123",
  "name": "Coconut Water",
  "stock_quantity": 97
}
```

### 3. Insufficient Stock Prevention

If stock is too low, orders are rejected:

```json
{
  "error": "bad_request",
  "message": "Product 'Coconut Water' has insufficient stock. Available: 2, Requested: 5"
}
```

## Product Stock Configuration

### Enable Stock Tracking

Set `stock_quantity` when creating or updating products:

```json
{
  "stock_quantity": 50
}
```

### Disable Stock Tracking

Omit `stock_quantity` or set to `null`:

```json
{
  "stock_quantity": null
}
```

**Use cases for no stock tracking:**
- Digital products
- Made-to-order items
- Services
- Unlimited inventory items

## Stock Management Operations

### View Current Stock

Get product details including current stock:

```bash
GET /v1/merchants/{merchant_id}/products/{product_id}
```

```json
{
  "id": "prod_abc123",
  "name": "Coconut Water",
  "price": 500,
  "stock_quantity": 97,
  "is_available": true
}
```

### Update Stock Manually

Restock or adjust inventory:

```bash
PUT /v1/merchants/{merchant_id}/products/{product_id}
```

```json
{
  "stock_quantity": 200
}
```

**Common scenarios:**
- Receiving new inventory
- Correcting stock counts
- Seasonal restocking
- Damaged/expired items removal

### Mark Product as Unavailable

Temporarily disable product without deleting:

```json
{
  "is_available": false
}
```

Product remains in catalog but cannot be ordered.

## Best Practices

### Inventory Planning

✅ **Set Low Stock Alerts**
```json
{
  "stock_quantity": 150,
  "low_stock_threshold": 20
}
```
(Webhook notifications coming soon)

✅ **Buffer Stock**
- Keep 10-20% buffer for safety
- Account for delivery delays

✅ **Regular Audits**
- Count physical inventory weekly
- Update system to match reality

### Stock Transitions

✅ **Seasonal Items**
```json
{
  "stock_quantity": 0,
  "is_available": false
}
```

✅ **Out of Stock**
```json
{
  "stock_quantity": 0,
  "is_available": false,
  "description": "Temporarily out of stock. Back soon!"
}
```

✅ **Pre-orders**
```json
{
  "stock_quantity": -10,
  "is_available": false,
  "name": "Coconut Water (Pre-order)"
}
```

### Error Prevention

✅ **Validate Before Orders**
- Check stock in real-time
- Handle race conditions
- Use transactions (automatic)

✅ **Monitor Low Stock**
- Set reorder points
- Track sales velocity
- Plan restocking schedules

## Stock Atomicity

The system uses **database transactions** to prevent race conditions:

### Scenario: 2 Customers Order Simultaneously

**Initial Stock:** 5 units

**Customer A orders 3 units** (at same time as B)
**Customer B orders 4 units** (at same time as A)

**Result:**
- ✅ Customer A: Order succeeds (stock → 2)
- ❌ Customer B: Order fails (insufficient stock)

One order will always succeed, one will fail. **No overselling.**

## Stock Reporting

### Current Stock Levels

```bash
GET /v1/merchants/{merchant_id}/products?sort=stock_quantity
```

### Low Stock Products

```bash
GET /v1/merchants/{merchant_id}/products?filter=low_stock
```

### Stock Movement History

```bash
GET /v1/merchants/{merchant_id}/analytics/inventory
```

Shows:
- Stock changes over time
- Sales velocity
- Restock dates
- Waste/damage tracking

## Webhooks for Stock Events

Subscribe to inventory events:

```json
{
  "events": ["inventory.low_stock", "inventory.out_of_stock"]
}
```

### Low Stock Alert

```json
{
  "event": "inventory.low_stock",
  "data": {
    "product_id": "prod_abc123",
    "product_name": "Coconut Water",
    "current_stock": 5,
    "threshold": 20
  }
}
```

### Out of Stock

```json
{
  "event": "inventory.out_of_stock",
  "data": {
    "product_id": "prod_abc123",
    "product_name": "Coconut Water",
    "last_sale": "2026-03-25T14:30:00Z"
  }
}
```

## Multi-Location Inventory

(Coming soon)

Track stock across multiple locations:

```json
{
  "product_id": "prod_abc123",
  "stock_by_location": {
    "store_1": 50,
    "store_2": 30,
    "warehouse": 200
  }
}
```

## FAQs

### Q: What happens if I don't set stock_quantity?

**A:** Product has **unlimited stock** and is always available (good for services or digital products).

### Q: Can I oversell?

**A:** No. The system uses database-level transactions to prevent overselling.

### Q: How do I handle refunds?

**A:** Stock is **not automatically restored** on refunds. Update manually if restocking.

### Q: Can I reserve stock?

**A:** Not yet. Stock is only decreased when payment completes. Coming in future update.

### Q: Do partial orders work?

**A:** No. If any item in the order has insufficient stock, the entire order fails.

## Need Help?

- [Products API Reference](/api/products)
- [Orders API Reference](/api/orders)
- [Webhooks Guide](/guides/webhooks)
