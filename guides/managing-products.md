# Managing Your Products

Learn how to add and manage your product catalog for QR code ordering and checkout.

## Overview

Your product catalog is your menu or inventory. Customers see your products when they:
- Scan QR codes at your business
- Browse your online store
- Use your mobile ordering app

## Adding Products (Merchant Dashboard)

### Via Dashboard

1. **Log in** to your merchant dashboard
2. **Go to Products** section
3. **Click "Add Product"**
4. **Fill in details:**
   - Product name (e.g., "Conch Fritters")
   - Description
   - Price
   - Category (appetizers, entrees, drinks, etc.)
   - Upload photo (optional)

5. **Save** and your product is live!

## Adding Products (Via API)

For developers integrating product management:

```bash
POST /v1/merchants/:merchant_id/products
```

### Example: Add Menu Item

```bash
curl -X POST https://api.dberi.com/v1/merchants/merchant-abc123/products \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grilled Mahi Mahi",
    "description": "Fresh local mahi mahi with rice and vegetables",
    "price": 2800,
    "category": "entrees",
    "image_url": "https://yourrestaurant.com/images/mahi.jpg"
  }'
```

## Organizing Products

### Use Categories

Group products to make browsing easier:

**For Restaurants:**
- appetizers
- entrees
- sides
- desserts
- drinks

**For Retail:**
- clothing
- accessories
- home-goods
- electronics

**For Services:**
- haircuts
- spa-treatments
- repairs

### Add Photos

Products with photos sell better:
- Use square images (800x800px minimum)
- Show the actual product
- Good lighting is key
- Compress images for fast loading

### Write Descriptions

Help customers choose:
```
Good: "Fresh local mahi mahi grilled to perfection, served with coconut rice and seasonal vegetables"

Okay: "Fish with rice"
```

## Managing Availability

### Mark Items Unavailable

When you run out of something:

**Via Dashboard:**
1. Find the product
2. Toggle "Available" switch to OFF
3. Product stays in catalog but can't be ordered

**Via API:**
```bash
curl -X PATCH https://api.dberi.com/v1/merchants/merchant-abc123/products/product-xyz \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "is_available": false
  }'
```

### Remove Products

To hide products completely:

**Via Dashboard:**
1. Find the product
2. Click "Delete"
3. Product is archived (can be restored later)

**Via API:**
```bash
curl -X DELETE https://api.dberi.com/v1/merchants/merchant-abc123/products/product-xyz \
  -H "Authorization: Bearer sk_live_your_api_key"
```

## Updating Products

### Change Prices

Update prices anytime:

**Via Dashboard:**
1. Click on product
2. Edit price field
3. Save

**Via API:**
```bash
curl -X PATCH https://api.dberi.com/v1/merchants/merchant-abc123/products/product-xyz \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 3200
  }'
```

### Update Details

Change name, description, category, or photo anytime.

## Stock Management (Optional)

Track inventory for limited items:

```bash
curl -X POST https://api.dberi.com/v1/merchants/merchant-abc123/products \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Limited Edition T-Shirt",
    "price": 2500,
    "stock_quantity": 50
  }'
```

When stock reaches 0, the product becomes unavailable automatically.

## Best Practices

### 1. Keep It Updated

- Remove items you no longer serve
- Update prices regularly
- Mark seasonal items unavailable when out of season

### 2. Use Clear Names

```
Good: "Bahama Mama (16oz)"
Bad: "Drink #3"
```

### 3. Accurate Prices

- Prices in cents (2500 = $25.00)
- Include all costs (no hidden fees for customers)
- Update for specials or promotions

### 4. Good Photos

- Natural lighting
- Clean presentation
- Show what customer will get
- Consistent style across all products

### 5. Helpful Descriptions

Include:
- What's in it
- How it's prepared
- Size/quantity
- Dietary info (gluten-free, vegan, etc.)
- Spice level for food

## Common Use Cases

### Restaurant Menu

```javascript
// Organize by meal type
categories: [
  "breakfast",
  "lunch",
  "dinner",
  "drinks",
  "desserts"
]

// Include dietary tags
metadata: {
  "dietary": ["gluten-free", "vegetarian"],
  "spice_level": "mild",
  "calories": 450
}
```

### Retail Store

```javascript
// Track inventory
{
  "name": "Blue T-Shirt (M)",
  "sku": "SHIRT-BLUE-M",
  "stock_quantity": 12,
  "category": "clothing"
}
```

### Service Business

```javascript
// Duration and requirements
{
  "name": "Men's Haircut",
  "price": 2500,
  "metadata": {
    "duration": "30 minutes",
    "stylist_required": true
  }
}
```

## Need Help?

- **Full API Docs**: [Products API](/api/products)
- **Support**: support@dberi.com
- **Dashboard Help**: Click "?" icon in merchant portal

---

**Ready to add products?** Log into your merchant dashboard or use the Products API.
