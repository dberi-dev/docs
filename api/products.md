# Products API

Manage your product catalog and menu items for QR code ordering.

## The Product Object

```json
{
  "id": "product-550e8400-e29b-41d4-a716-446655440000",
  "merchant_id": "merchant-abc123",
  "name": "Grilled Mahi Mahi",
  "description": "Fresh local mahi mahi grilled to perfection",
  "price": 2800,
  "currency": "BSD",
  "category": "entrees",
  "image_url": "https://yourbusiness.com/images/mahi.jpg",
  "sku": "FOOD-001",
  "stock_quantity": null,
  "is_available": true,
  "is_active": true,
  "metadata": {
    "spice_level": "mild",
    "dietary": ["gluten-free"]
  },
  "created_at": "2026-03-19T10:00:00Z",
  "updated_at": "2026-03-19T10:00:00Z"
}
```

### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique product identifier |
| `merchant_id` | string | Merchant who owns this product |
| `name` | string | Product name |
| `description` | string | Product description (optional) |
| `price` | integer | Price in cents (2800 = $28.00) |
| `currency` | string | Currency code (default: `BSD`) |
| `category` | string | Product category (e.g., "entrees", "drinks", "appetizers") |
| `image_url` | string | URL to product image |
| `sku` | string | Stock keeping unit / product code |
| `stock_quantity` | integer | Available stock (null = unlimited) |
| `is_available` | boolean | Whether customers can order this item |
| `is_active` | boolean | Whether product is active in catalog |
| `metadata` | object | Custom key-value pairs for product options |
| `created_at` | string | ISO 8601 timestamp |
| `updated_at` | string | ISO 8601 timestamp |

## Create a Product

Add a new item to your catalog.

```bash
POST /v1/merchants/:id/products
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Product name (1-255 characters) |
| `description` | string | No | Product description |
| `price` | integer | Yes | Price in cents (must be ≥ 0) |
| `currency` | string | No | Default: `BSD` |
| `category` | string | No | Product category |
| `image_url` | string | No | URL to product image |
| `sku` | string | No | Product SKU |
| `stock_quantity` | integer | No | Available stock (null = unlimited) |
| `is_available` | boolean | No | Default: `true` |
| `metadata` | object | No | Custom product options |

### Example Request

```bash
curl -X POST https://api.dberi.com/v1/merchants/merchant-abc123/products \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Conch Fritters",
    "description": "Crispy fried conch fritters with spicy mayo",
    "price": 1200,
    "category": "appetizers",
    "image_url": "https://yourrestaurant.com/images/conch-fritters.jpg",
    "sku": "APP-001",
    "is_available": true,
    "metadata": {
      "serves": "2-3 people",
      "spice_level": "medium"
    }
  }'
```

### Example Response

```json
{
  "id": "product-xyz789",
  "merchant_id": "merchant-abc123",
  "name": "Conch Fritters",
  "description": "Crispy fried conch fritters with spicy mayo",
  "price": 1200,
  "currency": "BSD",
  "category": "appetizers",
  "image_url": "https://yourrestaurant.com/images/conch-fritters.jpg",
  "sku": "APP-001",
  "stock_quantity": null,
  "is_available": true,
  "is_active": true,
  "metadata": {
    "serves": "2-3 people",
    "spice_level": "medium"
  },
  "created_at": "2026-03-25T10:00:00Z",
  "updated_at": "2026-03-25T10:00:00Z"
}
```

## List All Products

Get all products in your catalog.

```bash
GET /v1/merchants/:id/products
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `active_only` | boolean | Only return active products (default: `false`) |

### Example Request

```bash
curl "https://api.dberi.com/v1/merchants/merchant-abc123/products?active_only=true" \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
[
  {
    "id": "product-xyz789",
    "merchant_id": "merchant-abc123",
    "name": "Conch Fritters",
    "price": 1200,
    "category": "appetizers",
    "is_available": true,
    "is_active": true
  },
  {
    "id": "product-abc456",
    "merchant_id": "merchant-abc123",
    "name": "Grilled Mahi Mahi",
    "price": 2800,
    "category": "entrees",
    "is_available": true,
    "is_active": true
  }
]
```

## Get a Product

Retrieve a specific product.

```bash
GET /v1/merchants/:id/products/:product_id
```

### Example Request

```bash
curl https://api.dberi.com/v1/merchants/merchant-abc123/products/product-xyz789 \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "id": "product-xyz789",
  "merchant_id": "merchant-abc123",
  "name": "Conch Fritters",
  "description": "Crispy fried conch fritters with spicy mayo",
  "price": 1200,
  "currency": "BSD",
  "category": "appetizers",
  "is_available": true,
  "is_active": true,
  "created_at": "2026-03-25T10:00:00Z",
  "updated_at": "2026-03-25T10:00:00Z"
}
```

## Update a Product

Update product details.

```bash
PATCH /v1/merchants/:id/products/:product_id
```

### Parameters

All parameters are optional. Only provided fields will be updated.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Product name |
| `description` | string | Product description |
| `price` | integer | Price in cents |
| `category` | string | Product category |
| `image_url` | string | Product image URL |
| `sku` | string | Product SKU |
| `stock_quantity` | integer | Available stock |
| `is_available` | boolean | Whether product is available for ordering |
| `is_active` | boolean | Whether product is active in catalog |
| `metadata` | object | Custom product options |

### Example Request

```bash
curl -X PATCH https://api.dberi.com/v1/merchants/merchant-abc123/products/product-xyz789 \
  -H "Authorization: Bearer sk_live_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1400,
    "is_available": false
  }'
```

### Example Response

```json
{
  "id": "product-xyz789",
  "merchant_id": "merchant-abc123",
  "name": "Conch Fritters",
  "price": 1400,
  "is_available": false,
  "updated_at": "2026-03-25T11:30:00Z"
}
```

## Delete a Product

Soft delete a product (removes from catalog but preserves data).

```bash
DELETE /v1/merchants/:id/products/:product_id
```

::: warning Soft Delete
This sets `is_active` to `false`. The product is hidden from listings but data is preserved for order history.
:::

### Example Request

```bash
curl -X DELETE https://api.dberi.com/v1/merchants/merchant-abc123/products/product-xyz789 \
  -H "Authorization: Bearer sk_live_your_api_key"
```

### Example Response

```json
{
  "message": "Product deleted successfully"
}
```

## Use Cases

### Restaurant Menu

```javascript
// Create full menu
const appetizers = [
  { name: "Conch Fritters", price: 1200, category: "appetizers" },
  { name: "Coconut Shrimp", price: 1500, category: "appetizers" }
]

const entrees = [
  { name: "Grilled Mahi Mahi", price: 2800, category: "entrees" },
  { name: "Lobster Tail", price: 4500, category: "entrees" }
]

const drinks = [
  { name: "Bahama Mama", price: 900, category: "drinks" },
  { name: "Rum Punch", price: 800, category: "drinks" }
]

// Create all products
for (const item of [...appetizers, ...entrees, ...drinks]) {
  await createProduct(merchantId, item)
}
```

### Daily Specials

```javascript
// Mark item as unavailable when sold out
await updateProduct(merchantId, productId, {
  is_available: false
})

// Update price for happy hour
await updateProduct(merchantId, drinkId, {
  price: 600, // $6.00
  metadata: {
    happy_hour: true,
    original_price: 900
  }
}
)
```

### Inventory Management

```javascript
// Product with stock tracking
await createProduct(merchantId, {
  name: "Limited Edition T-Shirt",
  price: 2500,
  stock_quantity: 50,
  category: "retail"
})

// Auto-disable when out of stock
const product = await getProduct(merchantId, productId)
if (product.stock_quantity === 0) {
  await updateProduct(merchantId, productId, {
    is_available: false
  })
}
```

## Best Practices

### 1. Use Categories

Organize products by category for better menu display:

```
appetizers, entrees, sides, desserts, drinks, retail, etc.
```

### 2. High-Quality Images

- Use 1:1 square images (minimum 800x800px)
- Compress images for faster loading
- Host on a CDN for best performance

### 3. Detailed Descriptions

Help customers make informed choices:

```javascript
{
  "name": "Grilled Mahi Mahi",
  "description": "Fresh local mahi mahi grilled to perfection, served with rice and vegetables",
  "metadata": {
    "dietary": ["gluten-free"],
    "spice_level": "mild",
    "allergens": ["fish"]
  }
}
```

### 4. Stock Management

For limited items, use `stock_quantity`:

```javascript
// Track inventory
{
  "name": "Daily Catch",
  "stock_quantity": 12
}

// Unlimited items
{
  "name": "French Fries",
  "stock_quantity": null
}
```

### 5. Seasonal Items

Use `is_active` for seasonal products:

```javascript
// Enable for summer
await updateProduct(merchantId, productId, {
  is_active: true,
  is_available: true
})

// Disable for winter
await updateProduct(merchantId, productId, {
  is_active: false
})
```

## Errors

| Code | Description |
|------|-------------|
| `PRODUCT_NOT_FOUND` | Product ID doesn't exist |
| `INVALID_PRICE` | Price must be non-negative integer |
| `NAME_REQUIRED` | Product name is required |
| `MERCHANT_MISMATCH` | Product doesn't belong to this merchant |

## Next Steps

- [Create Payments](/api/payments) - Accept payments for orders
- [QR Code Payments](/guides/qr-payments) - Set up QR ordering
- [Merchants API](/api/merchants) - Manage your merchant account
