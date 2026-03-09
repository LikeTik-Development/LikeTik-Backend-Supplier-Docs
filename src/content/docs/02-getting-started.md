---
id: getting-started
title: Getting Started
group: Getting Started
order: 2
---

### How Onboarding Works

Onboarding is **admin-provisioned**. There is no self-service signup. To join as a supplier:

1. **Email LikeTik** at [suppliers@liketik.com](mailto:suppliers@liketik.com) to start the onboarding process
2. **LikeTik creates your supplier account** and sets up your access
3. **You receive your credentials** from the LikeTik team, including:
   - **Client ID** , your OAuth2 client identifier
   - **Client Secret** , your OAuth2 client secret (keep this confidential)
   - **API Base URL** , the base URL for all API requests. The current beta URL is `https://backend-test.liketik.com/`
   - **Keycloak Realm URL** , the identity provider URL for authentication (referred to as `{issuer_uri}` throughout this guide)
   - **Required Scopes** , `openid` and `products.supplier` (include both scopes in every token request)

> **Important:** You are connecting to our **testing environment** at `https://backend-test.liketik.com/`. This is not the final production system. Products you push here are for integration testing only. The production URL will be provided once your integration is verified and the API is out of beta. `{issuer_uri}` is a placeholder for the Keycloak realm URL you receive during onboarding.

### Next Steps After Receiving Credentials

1. Store your `client_id` and `client_secret` securely (never expose them in client-side code or version control)
2. Open the [Swagger UI](https://backend-test.liketik.com/docs/supplier/index.html) to see all available endpoints and try them out
3. Test connectivity by [requesting an access token](/docs/authentication#step-2-request-an-access-token)
4. Confirm your account by [retrieving your supplier profile](/docs/supplier-profile)
5. Start [creating products](/docs/product-management)
