# API Key Authentication

This document describes how to use API keys to access tRPC endpoints without browser-based authentication.

## Overview

API keys allow programmatic access to Recipe Buddy's tRPC endpoints. This is useful for:
- Automation scripts
- CI/CD pipelines
- External integrations
- Command-line tools

## Generating an API Key

1. Log in to Recipe Buddy
2. Navigate to **Settings**
3. Click **Generate API Key**
4. Enter a descriptive name for your key
5. Copy the generated key immediately (it won't be shown again)

## Using an API Key

### HTTP Headers

Include your API key in requests using either format:

**Option 1: X-API-Key header**
```bash
curl -X POST https://your-domain.com/api/trpc/recipes.list \
  -H "X-API-Key: rbk_your_api_key_here" \
  -H "Content-Type: application/json"
```

**Option 2: Authorization Bearer header**
```bash
curl -X POST https://your-domain.com/api/trpc/recipes.list \
  -H "Authorization: Bearer rbk_your_api_key_here" \
  -H "Content-Type: application/json"
```

### TypeScript/JavaScript Example

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './path-to-your-router';
import superjson from 'superjson';

const client = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'https://your-domain.com/api/trpc',
      headers: {
        'X-API-Key': 'rbk_your_api_key_here',
      },
    }),
  ],
});

// Use the client
const recipes = await client.recipes.list.query();
```

### Python Example

```python
import requests

url = "https://your-domain.com/api/trpc/recipes.list"
headers = {
    "X-API-Key": "rbk_your_api_key_here",
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers)
recipes = response.json()
```

## Managing API Keys

### Viewing Keys

Go to **Settings** to see all your API keys with:
- Key name
- Masked key value
- Creation date
- Last used date

### Revoking Keys

Click the **Delete** button next to any key to revoke it immediately. Revoked keys cannot be recovered.

## Security Best Practices

1. **Keep keys secret**: Never commit API keys to version control
2. **Use environment variables**: Store keys in `.env` files or secure vaults
3. **Rotate regularly**: Generate new keys and revoke old ones periodically
4. **Use descriptive names**: Name keys by their purpose (e.g., "CI Pipeline", "Backup Script")
5. **Revoke unused keys**: Delete keys that are no longer needed

## Technical Details

- API keys are prefixed with `rbk_` for easy identification
- Keys are stored securely in the database
- Each key is associated with a specific user account
- API key authentication provides the same permissions as the associated user
- The `lastUsed` timestamp is updated on each successful authentication
