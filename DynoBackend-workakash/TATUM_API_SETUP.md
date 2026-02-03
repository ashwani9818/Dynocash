# Tatum API Key Setup Guide

## 🎯 Answer: You Need **ONE** Tatum API Key for **ALL** Blockchains

**Important:** Tatum provides a **single API key** that gives you access to **all supported blockchains**. You don't need separate keys for each blockchain.

---

## 📋 Supported Blockchains in This Application

Based on the codebase analysis, your application uses Tatum API for the following **7 blockchains**:

### 1. **Bitcoin (BTC)**
- Used for: Bitcoin wallet generation, transactions, fee estimation
- Code reference: `tatumSdk.blockchain.bitcoin.*`

### 2. **Ethereum (ETH)**
- Used for: Ethereum wallet generation, transactions, fee estimation
- Also used for: **USDT-ERC20** (USDT on Ethereum network)
- Code reference: `tatumSdk.blockchain.eth.*`

### 3. **Tron (TRX)**
- Used for: Tron wallet generation, transactions
- Also used for: **USDT-TRC20** (USDT on Tron network)
- Code reference: `tatumSdk.blockchain.tron.*`

### 4. **Litecoin (LTC)**
- Used for: Litecoin wallet generation, transactions, fee estimation
- Code reference: `tatumSdk.blockchain.ltc.*`

### 5. **Dogecoin (DOGE)**
- Used for: Dogecoin wallet generation, transactions, fee estimation
- Code reference: `tatumSdk.blockchain.doge.*`

### 6. **Bitcoin Cash (BCH)**
- Used for: Bitcoin Cash transactions, fee estimation
- Code reference: `tatumSdk.blockchain.bcash.*` or direct API calls

### 7. **USDT (Both Networks)**
- **USDT-ERC20**: Uses Ethereum network via Tatum
- **USDT-TRC20**: Uses Tron network via Tatum

---

## 🔑 How to Get Tatum API Key

### Step 1: Sign Up for Tatum
1. Go to [https://tatum.io/](https://tatum.io/)
2. Click **"Get Started"** or **"Sign Up"**
3. Create an account (free tier available)

### Step 2: Get Your API Key
1. Log in to Tatum Dashboard
2. Navigate to **API Keys** section
3. Generate a new API key
4. Copy the API key

### Step 3: Choose the Right Plan

**For Local Development:**
- Use **Free/Test API Key** (if available)
- Or **Testnet API Key** for testing

**For Production:**
- Use **Mainnet API Key**
- Choose appropriate plan based on your needs:
  - Free tier (limited requests)
  - Pay-as-you-go
  - Enterprise plan

---

## 📝 Environment Variables

Add your Tatum API key to `.env.local`:

```env
# Tatum API (Single key for all blockchains)
TATUM_KEY=your_tatum_api_key_here
TATUM_SECRET_KEY=your_tatum_secret_key_here
```

**Note:** The code uses both `TATUM_KEY` and `TATUM_SECRET_KEY`. Check which one is actually used in your setup.

---

## 🔍 How Tatum API Works

### Single API Key = Multiple Blockchains

Tatum's API is designed so that:
- ✅ **One API key** provides access to **all supported blockchains**
- ✅ You specify the blockchain in the API call (e.g., `chain: "BTC"`, `chain: "ETH"`)
- ✅ No need to generate separate keys for each blockchain

### Example Usage in Code:

```typescript
// Same API key, different blockchain methods
const tatumSdk = TatumApi(process.env.TATUM_KEY);

// Bitcoin
await tatumSdk.blockchain.bitcoin.btcGenerateWallet();

// Ethereum
await tatumSdk.blockchain.eth.ethGenerateWallet();

// Tron
await tatumSdk.blockchain.tron.generateTronwallet();

// Litecoin
await tatumSdk.blockchain.ltc.ltcGenerateWallet();

// Dogecoin
await tatumSdk.blockchain.doge.dogeGenerateWallet();
```

---

## 🧪 Testing Your API Key

### Test with Bitcoin (Simplest):
```bash
# Using curl
curl -X GET "https://api.tatum.io/v3/bitcoin/info" \
  -H "x-api-key: YOUR_TATUM_KEY"
```

### Test with Ethereum:
```bash
curl -X GET "https://api.tatum.io/v3/ethereum/info" \
  -H "x-api-key: YOUR_TATUM_KEY"
```

---

## ⚠️ Important Notes

### 1. **Testnet vs Mainnet**
- **Testnet keys**: For development/testing (free, no real money)
- **Mainnet keys**: For production (real transactions, costs money)

### 2. **Rate Limits**
- Free tier has request limits
- Check your plan's rate limits
- Consider upgrading for production use

### 3. **Security**
- Never commit API keys to Git
- Use environment variables (`.env.local`)
- Rotate keys if compromised

### 4. **Network Selection**
- Tatum automatically uses the correct network based on:
  - Your API key type (testnet/mainnet)
  - The blockchain you specify in calls

---

## 📚 Tatum API Documentation

- **Official Docs**: [https://docs.tatum.io/](https://docs.tatum.io/)
- **Supported Blockchains**: [https://docs.tatum.io/supported-blockchains](https://docs.tatum.io/supported-blockchains)
- **API Reference**: [https://apidoc.tatum.io/](https://apidoc.tatum.io/)

---

## ✅ Summary

**You need:**
- ✅ **1 Tatum API Key** (covers all blockchains)
- ✅ Access to: BTC, ETH, TRX, LTC, DOGE, BCH, USDT-ERC20, USDT-TRC20

**You don't need:**
- ❌ Separate API keys for each blockchain
- ❌ Multiple Tatum accounts

**Next Steps:**
1. Sign up at [tatum.io](https://tatum.io/)
2. Get your API key from dashboard
3. Add to `.env.local`:
   ```env
   TATUM_KEY=your_key_here
   TATUM_SECRET_KEY=your_secret_here
   ```
4. Test the connection
5. Start developing!

---

**Need Help?**
- Tatum Support: [https://tatum.io/support](https://tatum.io/support)
- Tatum Discord: [Join Community](https://discord.gg/tatum)

