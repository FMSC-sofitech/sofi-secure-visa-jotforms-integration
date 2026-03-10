Stateless Node.js microservice deployed on Google Cloud Run to handle form submissions.

- `SECURE_VISA_APIKEY`: The API Token for Sofitech AI.
- `SOFITECH_ENDPOINT_ID`: The specific bot field ID.

Deployment Settings
- Platform: Google Cloud Run
- Authentication: Allow unauthenticated (Required for Jotform Webhooks)
- Concurrency: Recommended 80+ (To handle parallel submissions)
- Memory: 256MB or 512MB

Usage
1. Provide the deployed service URL (e.g., `https://service-xyz.a.run.app/webhook`) to the Form Admin.
2. The Form Admin must add this URL to Jotform > Settings > Integrations > Webhooks.
3. The Jotform link used by users must include the `userId` parameter:
   `https://form.jotform.com/12345?userId=USER_123`
