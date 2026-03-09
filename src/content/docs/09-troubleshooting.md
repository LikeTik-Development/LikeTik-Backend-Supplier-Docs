---
id: troubleshooting
title: Troubleshooting & Error Handling
group: Reference
order: 9
---

Here are the most common errors you will run into during integration, and how to fix them.

### Error Response Format

All API errors use a standard format:

```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: 'tracking_number': must not be blank",
  "path": "/api/v1/supplier/fulfillment/F_a2b29477-1a2b-5c3d-9e4f-5a6b7c8d9e0f/ship"
}
```

### Common Errors

| HTTP Status | Error | Cause | Resolution |
|-------------|-------|-------|------------|
| `400 Bad Request` | Validation failure | One or more request fields failed validation (missing fields, invalid values, constraint violations) | Read the `message` field for field-level errors. Check [Section 8.2](/docs/constraints-limits#82-validation-constraints) for required fields and constraints |
| `401 Unauthorized` | Token expired or missing | Access token is expired, malformed, or missing from the request | Refresh your access token (see [Step 4](/docs/authentication#step-4-handle-token-expiry)). If the refresh token also expired, re-authenticate from [Step 2](/docs/authentication#step-2-request-an-access-token) |
| `403 Forbidden` | Insufficient permissions | Token is valid but lacks the `ProductSupplier` role or the `products.supplier` scope | Confirm your token includes the correct scope. Verify the `ProductSupplier` role is assigned in Keycloak. Contact [suppliers@liketik.com](mailto:suppliers@liketik.com) if your account needs reconfiguration |
| `403 Forbidden` | Resource not owned | The resource exists but belongs to a different supplier account | Confirm the resource ID belongs to your account. You can only access resources created under your supplier credentials |
| `404 Not Found` | Resource does not exist | The product, variant, fulfillment, or fulfillment item ID does not exist | Verify the ID format (e.g., `P_{UUID}`, `PV_{UUID}`, `F_{UUID}`, `FI_{UUID}`). Use the [Search Products](/docs/product-management#59-search-products) or [Retrieve Fulfillment Items](/docs/order-fulfillment#62-retrieve-fulfillment-items) endpoints to list your resources |
| `409 Conflict` | Invalid state transition | You attempted an action that conflicts with the resource's current state (e.g., publishing an already-published product, or moving a fulfillment item backward) | Check the product lifecycle state or fulfillment item status before attempting the transition. See [Product Lifecycle](/docs/product-management#product-lifecycle) and [Fulfillment Item Status Transitions](/docs/order-fulfillment#63-fulfillment-item-status-transitions) |
| `429 Too Many Requests` | Rate limit exceeded | Too many requests sent within the rate limit window | Wait the number of seconds in the `Retry-After` header before retrying. Use exponential backoff. See [Constraints & Rate Limits](/docs/constraints-limits#81-rate-limits) |
