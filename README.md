# Recipe Buddy

[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://stand-with-ukraine.pp.ua)
[![wakatime](https://wakatime.com/badge/user/43ab5910-d51d-486b-9e03-376e766a43d3/project/c2af7adc-0f49-4c92-bcaa-63bb2f09e9e2.svg)](https://wakatime.com/badge/user/43ab5910-d51d-486b-9e03-376e766a43d3/project/c2af7adc-0f49-4c92-bcaa-63bb2f09e9e2)

## Update - January 2026

**New Feature:**
* 🔑 **API Key Authentication** - Access recipes via REST API without browser sessions
* 📱 **Multi-Platform Ready** - Perfect for mobile apps, automation, and integrations
* 🐳 **Improved Docker Setup** - One-command startup with automatic migrations

## Update - April 2024

V2 of Recipe Buddy is here! V2 brings a host of improvements, including:

* An all-new architecture - SQLite replaces Mongo and Next.js replaces the massively overkill Nest.js and plain React
* Can be run in one (1) Docker container - no messing about with compose files
* A whole new UI

The only thing that hasn't really changed is the recipe scraping logic itself - that is coming (no promises on when
though)

## The problem

I am getting sick of manually importing recipes into Grocy.

## The solution

Overcomplication, naturally. Recipe Buddy is a web app which scrapes web pages for the
delicious [structured metadata](https://schema.org/Recipe) embedded therein.

Once the recipe has been extracted from the page, Recipe Buddy gives you a nice easy means to match each of its
ingredients up with a product from your Grocy stock, as well as a quantity unit. Once this is done, you simply hit the '
Add Recipe' button, and the TypeScript goblins painstakingly transcribe the recipe into your Grocy instance, ready for
meal planning!

## Quick Start

### Option 1: Docker Compose (Recommended for Development)

```bash
# Clone the repository
git clone https://github.com/georgegebbett/recipe-buddy.git
cd recipe-buddy

# Run the startup script (creates .env and starts everything)
./start-dev.sh
```

That's it! The app will be available at http://localhost:3000

The script automatically:
- Creates `.env` with secure defaults
- Installs all dependencies
- Runs database migrations
- Starts the development server with hot reload

### Option 2: Docker (Single Container - Production)

```bash
docker run \
  -p 3000:3000 \
  -v rb_data:/home/node/app/data \
  --env GROCY_API_KEY=YOUR_GROCY_API_KEY \
  --env GROCY_BASE_URL=YOUR_GROCY_BASE_URL \
  --env NEXTAUTH_SECRET=$(openssl rand -base64 32) \
  --env NEXTAUTH_URL=http://localhost:3000 \
  ghcr.io/georgegebbett/recipe-buddy
```

### Option 3: Local Development (No Docker)

If you prefer to run without Docker:

1. **Install dependencies:**
   ```bash
   corepack enable
   corepack prepare pnpm@10.6.3 --activate
   pnpm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   # Edit .env and set NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
   ```

3. **Run migrations:**
   ```bash
   npm run db:migrate:dev
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## First-Time Setup

1. **Visit** http://localhost:3000
2. **Create your first user** (you'll be prompted on first visit)
3. **Generate an API key** (Settings → API Keys)
4. **Configure Grocy** (Settings → Grocy Integration) - Optional!

## 🔑 API Key Authentication

Access your recipes programmatically without browser sessions!

### Generate an API Key

1. Go to Settings → API Keys
2. Click "Generate API Key"
3. Name it and copy the key (shown only once!)

### Use Your API Key

```bash
# Using X-API-Key header
curl -H "X-API-Key: rbk_your_key_here" \
  http://localhost:3000/api/trpc/recipe.list

# Or using Authorization header
curl -H "Authorization: Bearer rbk_your_key_here" \
  http://localhost:3000/api/trpc/recipe.list
```

Perfect for:
- Mobile apps
- Home automation
- CLI tools
- CI/CD integrations
- Third-party clients

See [API_KEYS.md](./API_KEYS.md) for more examples (Python, JavaScript, etc.)

## ⚙️ Grocy Integration

Grocy integration is **required** for full functionality (products and units selection).

Add to your `.env` file:

```env
GROCY_BASE_URL=https://your-grocy-instance.com
GROCY_API_KEY=your_grocy_api_key_here
```

Find your Grocy API key in your Grocy instance under **Settings → Manage API keys**.

## 📚 Documentation

- **[API_KEYS.md](./API_KEYS.md)** - Complete API key usage guide with examples
- **[CHANGELOG.md](./docs/CHANGELOG.md)** - Version history and changes

## Docker Usage

### Production (Default)
```bash
docker compose up -d
```

Runs the optimized production build. Data persists in a Docker volume.

### Development (Hot Reload)
```bash
docker compose --profile dev up -d
```

Mounts source code for instant hot reload on file changes.

### Common Commands
```bash
# View logs
docker logs recipe-buddy-recipe-buddy-1 -f          # Production
docker logs recipe-buddy-recipe-buddy-dev-1 -f      # Development

# Stop services
docker compose down

# Rebuild and restart
docker compose up -d --build

# Clean up everything (including volumes)
docker compose down -v
```

### Switching Between Profiles
```bash
# Switch from prod to dev
docker compose down
docker compose --profile dev up -d

# Switch from dev to prod
docker compose down
docker compose up -d
```

## A disclaimer from the original upstream creator:

I am apparently a professional software engineer, however I certainly do not profess to be any good at this stuff. I
hereby abdicate any responsibility for the misbehaviour of the TypeScript goblins. If you think you can do better, then
open a PR and I will almost certainly merge it without question.

Lots of love, George xoxoxoxo
