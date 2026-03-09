---
id: constraints-limits
title: Constraints & Rate Limits
group: Reference
order: 8
---

### 8.1 Rate Limits

The API enforces rate limits with a token-bucket algorithm. Each endpoint falls into one of three plans based on resource cost.

**Rate limit plans:**

| Plan | Burst Capacity | Sustained Rate | Refill Period |
|------|---------------|----------------|---------------|
| `light` | 20 requests | 10 req/s | 1 second |
| `standard` | 10 requests | 5 req/s | 1 second |
| `heavy` | 5 requests | 2 req/s | 1 second |

**Supplier endpoint plan assignments:**

| Endpoint | Method | Plan |
|----------|--------|------|
| `POST /api/v1/supplier/products` (create product) | POST | `heavy` |
| All other `POST`, `PUT`, `DELETE` on `/api/v1/supplier/...` | POST/PUT/DELETE | `standard` |
| All `GET` on `/api/v1/supplier/...` | GET | `light` |

**Response headers:**

Every response includes rate limit headers so you can track your usage:

| Header | Description | Example |
|--------|-------------|---------|
| `X-Rate-Limit-Limit` | Maximum tokens (burst capacity) for the applied plan | `20` |
| `X-Rate-Limit-Remaining` | Remaining tokens in the current window | `15` |
| `X-Rate-Limit-Plan` | Name of the rate limit plan applied to this request | `light` |
| `Retry-After` | Seconds to wait before retrying (only present on `429` responses) | `3` |

**Handling `429 Too Many Requests`:**

When you exceed your rate limit, the API returns a `429` response:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3

{
  "timestamp": "2025-01-15T10:30:00Z",
  "status": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 3 seconds.",
  "path": "/api/v1/supplier/products/search"
}
```

**Recommended handling:**
- Watch the `X-Rate-Limit-Remaining` header on every response. Throttle requests as it approaches zero.
- On `429` responses, wait the number of seconds in the `Retry-After` header before retrying.
- Use exponential backoff for repeated `429` responses.

### 8.2 Validation Constraints

The API validates all request bodies against standard constraints. Requests that fail validation return `400 Bad Request` with details on which fields are invalid.

**Product creation (key constraints):**

| Field | Constraint |
|-------|-----------|
| `variants` | At least one variant required |
| `variants[].supplier_variant_id` | Required, not blank |
| `variants[].sku` | Required, not blank |
| `variants[].info.names` | Required, at least one locale entry |
| `variants[].info.descriptions` | Required, at least one locale entry |
| `variants[].info.slugs` | Required, at least one locale entry |
| `variants[].purchase_price.prices` | Required, at least one entry. Amount must be positive or zero |
| `variants[].tax.rate` | Required, between 0.0 and 100.0 |
| `variants[].unit.type` | Required, not blank |
| `variants[].unit.quantity` | Required, minimum 1 |
| `variants[].origin_country` | Required, ISO 3166-1 alpha-3 |

**Fulfillment requests:**

| Endpoint | Field | Constraint |
|----------|-------|-----------|
| Forward | `external_order_id` | Required, not blank |
| Ship | `tracking_info` | Required |
| Ship | `tracking_info.carrier` | Required, not blank |
| Ship | `tracking_info.tracking_number` | Required, not blank |
| Fail / Cancel | `reason` | Required, not blank |

**Pagination:**

| Endpoint | Parameter | Constraint |
|----------|-----------|-----------|
| Product search | `supplier_id` | Required |
| Product search | `page` | Minimum 1 (default: 1) |
| Product search | `size` | Minimum 1 (default: 20) |
| Fulfillment list | `page` | Minimum 1 (default: 1) |
| Fulfillment list | `size` | Minimum 1, maximum 100 (default: 20) |

For full field-level validation details, see the [Swagger UI](https://backend-test.liketik.com/docs/supplier/index.html).

### 8.3 Image Requirements

Product images are **URL references**. You host images on your own servers or CDN and provide the URL in the product variant request. LikeTik does not host supplier product images.

**Image fields:**

| Field | Type | Description |
|-------|------|-------------|
| `url` | String | Absolute URL to the image (must be publicly accessible) |
| `mime_type` | String | MIME type (e.g., `image/jpeg`, `image/png`, `image/webp`) |
| `alt_text` | String | Accessibility text for the image |
| `position` | Integer | Sort order (lower = higher priority) |
| `width` | Integer | Width in pixels |
| `height` | Integer | Height in pixels |

> **Note:** The API does not validate image format or size. For best results:
> - **Formats:** JPEG, PNG, or WebP
> - **Resolution:** High resolution (e.g., 4500 x 5100 px for print-on-demand products)
> - **Accessibility:** Publicly accessible URLs (no authentication required to fetch)

### 8.4 Polling Recommendations

Without webhooks, you need to poll the fulfillment endpoint for new items. To stay responsive without burning through rate limits:

- **Active suppliers:** Poll `GET /api/v1/supplier/fulfillment` every **1 to 5 minutes**.
- **Watch rate limits:** Check the `X-Rate-Limit-Remaining` header and reduce polling frequency as you approach the limit.
- **Use status filters:** Pass the `status` query parameter to shrink the response payload (e.g., `?status=CREATED` to fetch only new items).
- **Off-peak:** Lower your polling frequency when you don't expect new orders.
