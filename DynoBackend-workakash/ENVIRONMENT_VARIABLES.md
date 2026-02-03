# Environment Variables Configuration

## ✅ Yes, the code uses environment variables!

The backend uses `dotenv` package and loads environment variables from a `.env` file.

**Location:** `server.ts:33` - `dotenv.config()`

---

## 📋 Required Environment Variables

### 🔧 Server Configuration
```env
PORT=3300
NODE_ENV=development
SERVER_URL=http://localhost:3300/
CHECKOUT_URL=http://localhost:3000/
```

### 🗄️ Database (PostgreSQL)
```env
DB_NAME=your_database_name
USER_NAME=your_db_username
PASSWORD=your_db_password
HOST=localhost
DB_PORT=5432
```

### 🔴 Redis Cache
```env
REDIS_PUBLIC_URL=redis://localhost:6379
```

### 🔐 Authentication & Security
```env
ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
CYPHER_KEY=your_encryption_key_here
API_SECRET=your_api_secret_key_here
```

### 💳 Flutterwave Payment Gateway
```env
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_ENCRYPTION_KEY=your_flutterwave_encryption_key
FLW_SECRET_HASH=your_flutterwave_webhook_secret_hash
```

### ⛓️ Tatum API (Blockchain)
```env
TATUM_KEY=your_tatum_api_key
TATUM_SECRET_KEY=your_tatum_secret_key
```

### ☁️ Google Cloud Services
```env
PROJECT_ID=your_google_cloud_project_id
LOCATION_ID=your_google_cloud_location_id
KEY_RING_ID=your_google_cloud_key_ring_id
GOOGLE_CLIENT_EMAIL=your_google_service_account_email
GOOGLE_CLIENT_KEY=your_google_service_account_private_key
```

### 🔑 Google Cloud KMS Key IDs
```env
XPUB_KEY_ID=your_xpub_key_id
TEMP_KEY_ID=your_temp_key_id
```

### 💰 Smart Contract Addresses
```env
ETH_CONTRACT=your_ethereum_contract_address
TRX_CONTRACT=your_tron_contract_address
```

### 🌐 Third-Party APIs
```env
BLOCKCHAIR_API_KEY=your_blockchair_api_key
BREVO_API_KEY=your_brevo_api_key
FAST_FOREX_KEY=your_fastforex_api_key
CRYPTO_SECRET_KEY=your_crypto_secret_key
```

### 📱 Optional Services
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
PROFILE_ID=your_verification_profile_id
ACCESS_TOKEN=your_verification_access_token
```

### 💵 Fee Configuration
```env
TRANSACTION_FEE_PERCENT=2.0
BLOCKCHAIN_FEE_TIERS={"tier1": {"min": 0, "max": 100, "fee": 5}}
```

---

## 📝 Complete .env Template

Create a `.env` file in the root directory with this template:

```env
# Server Configuration
PORT=3300
NODE_ENV=development
SERVER_URL=http://localhost:3300/
CHECKOUT_URL=http://localhost:3000/

# Database Configuration
DB_NAME=dynopay_db
USER_NAME=postgres
PASSWORD=your_password
HOST=localhost
DB_PORT=5432

# Redis Configuration
REDIS_PUBLIC_URL=redis://localhost:6379

# Authentication & Security
ACCESS_TOKEN_SECRET=generate_random_32_char_string
CYPHER_KEY=generate_random_32_char_string
API_SECRET=generate_random_32_char_string

# Flutterwave
FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxx
FLW_SECRET_KEY=FLWSECK-xxxxxxxxxxxxx
FLW_ENCRYPTION_KEY=xxxxxxxxxxxxx
FLW_SECRET_HASH=xxxxxxxxxxxxx

# Tatum API
TATUM_KEY=xxxxxxxxxxxxx
TATUM_SECRET_KEY=xxxxxxxxxxxxx

# Google Cloud
PROJECT_ID=your-project-id
LOCATION_ID=us-central1
KEY_RING_ID=your-key-ring-id
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_CLIENT_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# KMS Key IDs
XPUB_KEY_ID=your-xpub-key-id
TEMP_KEY_ID=your-temp-key-id

# Smart Contracts
ETH_CONTRACT=0x...
TRX_CONTRACT=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t

# APIs
BLOCKCHAIR_API_KEY=xxxxxxxxxxxxx
BREVO_API_KEY=xxxxxxxxxxxxx
FAST_FOREX_KEY=xxxxxxxxxxxxx
CRYPTO_SECRET_KEY=xxxxxxxxxxxxx

# Optional
TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxx
PROFILE_ID=xxxxxxxxxxxxx
ACCESS_TOKEN=xxxxxxxxxxxxx

# Fees
TRANSACTION_FEE_PERCENT=2.0
BLOCKCHAIN_FEE_TIERS={"tier1": {"min": 0, "max": 100, "fee": 5}}
```

---

## 🔑 How to Generate Secure Keys

### Generate JWT Secret:
```bash
openssl rand -base64 32
```

### Generate Encryption Key:
```bash
openssl rand -base64 32
```

### Generate API Secret:
```bash
openssl rand -base64 32
```

---

## 📍 Where Variables Are Used

| Variable | Used In | Purpose |
|----------|---------|---------|
| `PORT` | `server.ts` | Server port |
| `DB_NAME`, `USER_NAME`, `PASSWORD`, `HOST`, `DB_PORT` | `utils/dbInstance.ts` | Database connection |
| `REDIS_PUBLIC_URL` | `utils/redisInstance.ts` | Redis connection |
| `ACCESS_TOKEN_SECRET` | All auth middlewares | JWT token signing |
| `CYPHER_KEY` | `helper/encryption.ts` | AES encryption |
| `FLW_*` | `apis/flutterwaveApi.ts`, controllers | Payment processing |
| `TATUM_KEY`, `TATUM_SECRET_KEY` | `apis/tatumApi.ts` | Blockchain operations |
| `GOOGLE_*` | `apis/tatumApi.ts` | Google Cloud KMS |
| `ETH_CONTRACT`, `TRX_CONTRACT` | Controllers | Smart contract addresses |
| `BLOCKCHAIR_API_KEY` | `apis/blockchairApi.ts` | Blockchain data |
| `BREVO_API_KEY` | `utils/mailTransporter.ts` | Email sending |
| `FAST_FOREX_KEY` | `helper/currencyConvert.ts` | Currency conversion |
| `SERVER_URL` | Controllers | Base server URL |
| `CHECKOUT_URL` | Controllers | Frontend checkout URL |

---

## ⚠️ Important Notes

1. **Never commit `.env` file to Git!**
   - Add `.env` to `.gitignore`
   - Only commit `.env.example` (template)

2. **Required for Development:**
   - Database credentials
   - Redis URL
   - JWT secret
   - Encryption key

3. **Required for Production:**
   - All variables above
   - All API keys
   - Google Cloud credentials
   - Smart contract addresses

4. **Optional (can work without):**
   - Telegram bot token
   - Verification profile IDs
   - Some fee configurations have defaults

---

## 🚀 Setup Instructions

1. **Copy template:**
   ```bash
   cp ENVIRONMENT_VARIABLES.md .env
   ```

2. **Fill in your values:**
   - Get API keys from respective services
   - Set up database and Redis
   - Generate secure keys

3. **Verify:**
   ```bash
   npm start
   ```
   Check console for connection errors

---

## ✅ Current Status

- ✅ Code uses `dotenv.config()` 
- ✅ All secrets use environment variables
- ⚠️ **No `.env` file found** (expected - shouldn't be in repo)
- ⚠️ **No `.env.example` file found** (should create one)

**Action Required:** Create a `.env` file with your actual values before running the application!

