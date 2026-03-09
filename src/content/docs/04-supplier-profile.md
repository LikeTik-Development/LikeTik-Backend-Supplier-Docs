---
id: supplier-profile
title: Supplier Profile Management
group: API Reference
order: 4
---

Once authenticated, pull your supplier profile to verify the integration works. The endpoint returns your account details as set up by the LikeTik admin.

### Retrieve Your Profile

```bash
curl -X GET https://backend-test.liketik.com/api/v1/supplier/profile/me \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "supplier_id": "EXTERNAL_SUP_acme-prints",
  "name": "Acme Prints",
  "email": "integration@acmeprints.example.com",
  "base_url": "https://api.acmeprints.example.com",
  "supplier_type": "EXTERNAL",
  "status": "ACTIVE",
  "discount_percent": 15.00
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `supplier_id` | String | Your unique supplier identifier (e.g., `EXTERNAL_SUP_acme-prints`) |
| `name` | String | Your business name as registered with LikeTik |
| `email` | String | Your integration contact email |
| `base_url` | String | Your system's base URL (as provided during onboarding) |
| `supplier_type` | String | Always `EXTERNAL` for third-party suppliers |
| `status` | String | Account status. Must be `ACTIVE` to use the API |
| `discount_percent` | Number | Your negotiated discount percentage |

> **Note:** Your supplier profile is read-only. To change any details, contact the LikeTik team at [suppliers@liketik.com](mailto:suppliers@liketik.com).

### Error Responses

| HTTP Status | Cause |
|-------------|-------|
| `401 Unauthorized` | Token missing or expired. See [Authentication](/docs/authentication) |
| `404 Not Found` | No supplier profile linked to your credentials. Contact LikeTik support |
