---
id: webhooks
title: Webhooks
group: Reference
order: 7
comingSoon: true
---

LikeTik will add outbound webhook notifications for real-time event delivery. Once available, webhooks will notify you about events like:

- **New order received**, a customer placed an order containing your products
- **Order status changes**, updates to order processing state
- **Fulfillment status updates**, system-initiated changes to fulfillment items

Payload schemas, signing mechanisms, and retry behavior will be documented when the feature launches. Until then, use the [polling-based approach](/docs/order-fulfillment#62-retrieve-fulfillment-items) to retrieve new fulfillment items via `GET /api/v1/supplier/fulfillment`.

Questions about upcoming webhook support? Contact [suppliers@liketik.com](mailto:suppliers@liketik.com).
