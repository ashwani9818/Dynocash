# Environment File Setup Guide

## ✅ You've Added Keys to `.env` File

Great! Your `.env` file is set up. Here's how it works:

---

## 📁 File Usage

### Current Setup:
- **`.env`** - Your main environment file (✅ You've added keys here)
- **`.env.local`** - Alternative for local-only overrides (optional)

### How It Works:

1. **Without Docker (Running locally):**
   - Uses `.env` file automatically
   - `dotenv.config()` in `server.ts` loads `.env`

2. **With Docker:**
   - Docker Compose is configured to use `.env` file
   - All variables from `.env` are loaded into the container

---

## 🔧 Important: Update Database Credentials for Docker

Since you're using Docker, make sure your `.env` file has these database settings:

```env
# Database Configuration (for Docker)
DB_NAME=dynopay_local
USER_NAME=postgres
PASSWORD=postgres123
HOST=postgres          # Important: Use 'postgres' (container name) for Docker
DB_PORT=5432

# Redis (for Docker)
REDIS_PUBLIC_URL=redis://redis:6379    # Use 'redis' (container name) for Docker
```

**Note:** 
- If running **with Docker**: Use `HOST=postgres` and `REDIS_PUBLIC_URL=redis://redis:6379`
- If running **without Docker**: Use `HOST=localhost` and `REDIS_PUBLIC_URL=redis://localhost:6379`

---

## ✅ Verify Your `.env` File Has:

### Required Variables:
```env
# Server
PORT=3300
NODE_ENV=development
SERVER_URL=http://localhost:3300/
CHECKOUT_URL=http://localhost:3000/

# Database (Docker)
DB_NAME=dynopay_local
USER_NAME=postgres
PASSWORD=postgres123
HOST=postgres
DB_PORT=5432

# Redis (Docker)
REDIS_PUBLIC_URL=redis://redis:6379

# Security
ACCESS_TOKEN_SECRET=your_jwt_secret
CYPHER_KEY=your_encryption_key
API_SECRET=your_api_secret

# Tatum API
TATUM_KEY=your_tatum_key
TATUM_SECRET_KEY=your_tatum_secret

# Flutterwave
FLW_PUBLIC_KEY=your_flutterwave_key
FLW_SECRET_KEY=your_flutterwave_secret
FLW_ENCRYPTION_KEY=your_encryption_key
FLW_SECRET_HASH=your_webhook_hash

# Other APIs
BLOCKCHAIR_API_KEY=your_blockchair_key
BREVO_API_KEY=your_brevo_key
FAST_FOREX_KEY=your_fastforex_key

# Smart Contracts
ETH_CONTRACT=your_eth_contract_address
TRX_CONTRACT=your_trx_contract_address

# Google Cloud (if using)
PROJECT_ID=your_project_id
LOCATION_ID=us-central1
KEY_RING_ID=your_key_ring_id
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_CLIENT_KEY=your_private_key
XPUB_KEY_ID=your_xpub_key_id
TEMP_KEY_ID=your_temp_key_id
```

---

## 🚀 Running the Application

### Option 1: With Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run migrations
docker-compose exec backend npm run migrate
```

### Option 2: Without Docker (Local)
```bash
# Make sure PostgreSQL and Redis are running locally
# Then:
npm install
npm start
```

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:** Check your `HOST` in `.env`:
- Docker: `HOST=postgres`
- Local: `HOST=localhost`

### Issue: "Cannot connect to Redis"
**Solution:** Check your `REDIS_PUBLIC_URL`:
- Docker: `REDIS_PUBLIC_URL=redis://redis:6379`
- Local: `REDIS_PUBLIC_URL=redis://localhost:6379`

### Issue: "Environment variable not found"
**Solution:** 
1. Check variable name spelling
2. Make sure `.env` file is in root directory
3. Restart the application after changing `.env`

---

## ✅ Next Steps

1. **Verify all keys are in `.env`** ✅ (You've done this)
2. **Update database credentials** for Docker (if using Docker)
3. **Start the application:**
   ```bash
   docker-compose up -d
   ```
4. **Check logs:**
   ```bash
   docker-compose logs -f backend
   ```
5. **Run migrations:**
   ```bash
   docker-compose exec backend npm run migrate
   ```

---

## 🔐 Security Reminder

✅ Your `.env` file is in `.gitignore` - it won't be committed to Git
✅ Never share your `.env` file
✅ Use test/sandbox keys for local development

---

**You're all set!** Your `.env` file is configured and ready to use. 🎉

