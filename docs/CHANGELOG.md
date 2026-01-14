# Changelog

## [Unreleased]

### Added - API Key Authentication

**Overview**: Added API key authentication to enable programmatic access to tRPC endpoints without browser-based authentication.

#### Features
- **API Key Management UI**: Full CRUD interface in Settings page
  - Generate new API keys with custom names
  - View existing keys (masked for security)
  - Copy keys to clipboard
  - Delete keys with confirmation
  - Track creation and last used timestamps
- **tRPC Authentication**: API keys work alongside session-based auth
  - Support for `X-API-Key` and `Authorization: Bearer` headers
  - Automatic `lastUsed` timestamp updates
  - New `apiKeyProcedure` middleware for API key-authenticated endpoints
- **Dynamic Usage Examples**: API key dialog shows actual domain from `NEXTAUTH_URL`

#### Database Changes
- **New table**: `api_key` with fields:
  - `id` (primary key, auto-increment)
  - `userId` (foreign key to users, cascade delete)
  - `name` (user-defined label)
  - `key` (unique, prefixed with `rbk_`)
  - `createdAt` (timestamp)
  - `lastUsed` (timestamp, nullable)
- **Migration**: `0002_add_api_keys.sql`

#### API Endpoints
- `apiKeys.generate` - Create new API key (returns key once)
- `apiKeys.list` - List user's API keys (keys are masked)
- `apiKeys.delete` - Delete API key (with ownership verification)

#### Security
- Keys generated using UUID v4 (cryptographically secure)
- Keys prefixed with `rbk_` for identification
- Keys shown only once during generation
- Ownership verification prevents unauthorized deletion
- API keys inherit user permissions

#### Docker Support
- **Single `docker-compose.yml`** with profiles:
  - Production (default): `docker compose up`
  - Development (hot reload): `docker compose --profile dev up`
- Automatic database migrations on container startup
- Volume-based data persistence
- Environment variable configuration

#### Documentation
- `API_KEYS.md` - Complete usage guide with examples (cURL, TypeScript, Python)
- `README.md` - Updated with Docker Compose instructions and API key feature

#### Technical Details
- Service layer architecture for clean separation of concerns
- Type-safe database queries with Drizzle ORM
- Proper error handling and validation
- Alert dialog component for confirmations
- No breaking changes to existing functionality

#### Files Added (14)
```
src/server/db/drizzle/0002_add_api_keys.sql
src/server/api/modules/apiKeys/procedures/generateApiKey.ts
src/server/api/modules/apiKeys/procedures/listApiKeys.ts
src/server/api/modules/apiKeys/procedures/deleteApiKey.ts
src/server/api/modules/apiKeys/service/generateApiKey.ts
src/server/api/modules/apiKeys/service/listApiKeys.ts
src/server/api/modules/apiKeys/service/deleteApiKey.ts
src/server/api/routers/apiKey.ts
src/components/api-key-table.tsx
src/components/ui/alert-dialog.tsx
docker-compose.yml
docs/CHANGELOG.md
API_KEYS.md
```

#### Files Modified (8)
```
src/server/db/schema.ts - Added apiKeys table and relations
src/server/api/trpc.ts - Added API key authentication logic
src/server/api/root.ts - Registered apiKeyRouter
src/app/(dashboard)/settings/page.tsx - Added API key management UI
src/components/grocy-status.tsx - Added env var setup note
README.md - Updated with Docker Compose and API key docs
Dockerfile - Fixed migration compilation and file paths
package.json - Added uuid dependency
```

#### Dependencies Added
- `uuid@9.0.1` - For generating secure API keys
- `@types/uuid@9.0.8` (dev) - TypeScript types for uuid

#### Future Enhancements (Not in this release)
- Key expiration dates
- Per-key permissions/scopes
- Rate limiting per key
- Key usage analytics
- Hashed key storage (currently plain text)
- Key rotation workflow

---

## Previous Releases

See git history for previous changes.
