# Payment Link System - Complete Flow

## 🔄 How Payment Links Work

---

## 📋 Overview

Payment links are **self-hosted** - no external service. The system uses:
- **Node.js Crypto** for secure random generation
- **PostgreSQL** for permanent storage
- **Redis** for session management
- **JWT tokens** for authentication

---

## 🔗 Complete Payment Link Flow

### **Step 1: Create Payment Link**

**User Action:** Merchant creates a payment link via dashboard

**API Call:**
```
POST /api/pay/createPaymentLink
Headers: Authorization: Bearer {user_token}
Body: {
  email: "customer@example.com",
  base_currency: "USD",
  modes: ["CARD", "CRYPTO"],
  amount: 100
}
```

**Backend Process:**
1. **Generate Unique Reference:**
   ```typescript
   const uniqueRef = crypto.randomBytes(24).toString("hex");
   // Example: "4dbd4d3fb22e33631807356afe13c016d200548a635cd99e"
   ```

2. **Create Payment Link URL:**
   ```typescript
   payment_link: process.env.CHECKOUT_URL + "pay?d=" + uniqueRef
   // Example: "https://checkout.dynopay.com/pay?d=4dbd4d3fb22e33631807356afe13c016d200548a635cd99e"
   ```

3. **Store in Database:**
   - Save to `tbl_payment_link` table
   - Fields: transaction_id, email, base_amount, base_currency, allowedModes, payment_link, user_id

4. **Store in Redis:**
   - Key: `customer-{uniqueRef}`
   - Value: All payment link data + `pathType: "createLink"`

5. **Return Link:**
   ```json
   {
     "message": "Link Created Successfully!",
     "data": {
       "link_id": 123,
       "payment_link": "https://checkout.dynopay.com/pay?d=4dbd4d3fb22e33631807356afe13c016d200548a635cd99e",
       "transaction_id": "f02461eb-15b1-49a3-9cbc-20feaf5f0241",
       "base_amount": 100,
       "base_currency": "USD"
     }
   }
   ```

---

### **Step 2: Customer Clicks Payment Link**

**Customer Action:** Opens link in browser
```
https://checkout.dynopay.com/pay?d=4dbd4d3fb22e33631807356afe13c016d200548a635cd99e
```

**Frontend Process:**
1. Extract `d` parameter from URL: `4dbd4d3fb22e33631807356afe13c016d200548a635cd99e`
2. Call backend to get payment data

---

### **Step 3: Retrieve Payment Data**

**Frontend API Call:**
```
POST /api/pay/getData
Body: {
  data: "4dbd4d3fb22e33631807356afe13c016d200548a635cd99e"
}
```

**Backend Process (`getData` function):**
1. **Lookup in Redis:**
   ```typescript
   const item = await getRedisItem("customer-" + data);
   // Retrieves: { email, base_amount, base_currency, allowedModes, pathType, transaction_id, user_id }
   ```

2. **Check Link Type:**
   - If `pathType === "createLink"` → Payment Link
   - Otherwise → Direct Payment

3. **Generate Access Token:**
   ```typescript
   // For payment links:
   token = jwt.sign({ 
     email: item.email, 
     ref: data, 
     pathType: "createLink", 
     id: item.transaction_id 
   }, ACCESS_TOKEN_SECRET);
   ```

4. **Return Payment Data:**
   ```json
   {
     "data": {
       "amount": 100,
       "base_currency": "USD",
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "payment_mode": "createLink",
       "allowedModes": "CARD,CRYPTO"
     }
   }
   ```

**Frontend Action:**
- Store token in localStorage
- Display payment amount and currency
- Show allowed payment methods (filtered by `allowedModes`)

---

### **Step 4: Customer Selects Payment Method**

**Customer Action:** Chooses payment method (Card, Crypto, etc.)

**Frontend Process:**
- Filter payment methods based on `allowedModes`
- If only one method allowed → Auto-select
- Display payment form

---

### **Step 5: Process Payment**

**For Card Payment:**
```
POST /api/pay/addPayment
Headers: Authorization: Bearer {token_from_step3}
Body: {
  data: "{encrypted_payment_data}"
}
```

**For Crypto Payment:**
```
POST /api/pay/createCryptoPayment
Headers: Authorization: Bearer {token_from_step3}
Body: {
  currency: "BTC",
  amount: 0.001
}
```

**Authentication Flow:**
1. **Token Validation** (`customerAuthMiddleware`):
   - Extract token from Authorization header
   - Decode JWT token
   - Check `pathType`:
     - If `pathType === "createLink"`:
       - Verify payment link exists in database
       - Check `transaction_id` matches
     - Otherwise:
       - Verify customer exists

2. **Process Payment:**
   - Create transaction record
   - Process payment via Flutterwave (card) or Tatum (crypto)
   - Update payment link status
   - Send confirmation

---

### **Step 6: Payment Verification**

**Card Payment:**
```
POST /api/pay/verifyPayment
Headers: Authorization: Bearer {token}
Body: { transaction_reference: "flw_ref_123" }
```

**Crypto Payment:**
```
POST /api/pay/verifyCryptoPayment
Headers: Authorization: Bearer {token}
Body: { address: "0x123...", currency: "BTC" }
```

**Backend Process:**
- Verify payment status
- Update transaction records
- Update payment link status to "successful"
- Credit merchant wallet
- Send confirmation emails

---

## 🔐 Security & Authentication

### **Token-Based Authentication:**

**Payment Link Token Structure:**
```typescript
{
  email: "customer@example.com",
  ref: "4dbd4d3fb22e33631807356afe13c016d200548a635cd99e",
  pathType: "createLink",
  id: "f02461eb-15b1-49a3-9cbc-20feaf5f0241"
}
```

**Token Validation:**
- Token signed with `ACCESS_TOKEN_SECRET`
- Validated on each payment API call
- Payment link existence verified in database

---

## 📊 Data Storage

### **PostgreSQL (`tbl_payment_link`):**
```sql
- link_id (Primary Key)
- transaction_id (UUID)
- user_id (Merchant ID)
- email (Customer email)
- base_amount
- base_currency
- allowedModes (Comma-separated: "CARD,CRYPTO")
- payment_link (Full URL)
- status (pending/successful/failed)
- created_at
- updated_at
```

### **Redis (`customer-{uniqueRef}`):**
```json
{
  "email": "customer@example.com",
  "base_amount": "100",
  "base_currency": "USD",
  "allowedModes": "CARD,CRYPTO",
  "pathType": "createLink",
  "transaction_id": "f02461eb-15b1-49a3-9cbc-20feaf5f0241",
  "user_id": "1",
  "payment_link": "https://checkout.dynopay.com/pay?d=..."
}
```

---

## 🔄 Complete Flow Diagram

```
┌─────────────────┐
│  Merchant       │
│  Creates Link   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend        │
│  1. Generate    │
│     uniqueRef   │
│  2. Create URL  │
│  3. Save to DB  │
│  4. Save Redis  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Payment Link   │
│  Returned       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Customer       │
│  Clicks Link    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend       │
│  Calls getData  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend        │
│  1. Redis Lookup│
│  2. Generate    │
│     Token       │
│  3. Return Data │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Customer       │
│  Selects Method│
│  & Pays        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend        │
│  1. Verify Token│
│  2. Process     │
│     Payment     │
│  3. Update DB   │
│  4. Send Email  │
└─────────────────┘
```

---

## 🎯 Key Features

### **1. Stateless Link Generation:**
- No external service dependency
- Secure random generation
- Unique per transaction

### **2. Session Management:**
- Redis for fast lookup
- Database for persistence
- Token-based authentication

### **3. Flexible Payment Methods:**
- Configurable allowed modes
- Dynamic filtering
- Multiple currency support

### **4. Security:**
- JWT token authentication
- Link validation
- Encrypted payment data

---

## 📝 Example Scenarios

### **Scenario 1: Card Payment via Link**

1. Merchant creates link: `$100 USD, Card only`
2. Link: `https://checkout.dynopay.com/pay?d=abc123...`
3. Customer opens link
4. Frontend calls `getData` → Gets amount, token, allowedModes
5. Customer enters card details
6. Payment processed via Flutterwave
7. Transaction verified
8. Merchant receives funds

### **Scenario 2: Crypto Payment via Link**

1. Merchant creates link: `$100 USD, Crypto only`
2. Link: `https://checkout.dynopay.com/pay?d=xyz789...`
3. Customer opens link
4. Frontend calls `getData` → Gets amount, token
5. Customer selects BTC
6. Crypto address generated
7. Customer sends crypto
8. Payment verified via blockchain
9. Merchant receives funds

---

## 🔧 Technical Details

### **Unique Reference Generation:**
```typescript
crypto.randomBytes(24).toString("hex")
// 24 bytes = 48 hex characters
// Collision probability: Extremely low
```

### **Link URL Format:**
```
{CHECKOUT_URL}/pay?d={uniqueRef}
```

### **Token Expiration:**
- JWT tokens don't expire (no `exp` claim)
- Link validity checked via database lookup
- Can be enhanced with expiration dates

---

## ✅ Summary

**Payment links work by:**
1. ✅ Generating secure unique references
2. ✅ Storing data in Redis + Database
3. ✅ Using JWT tokens for authentication
4. ✅ Retrieving data when link is accessed
5. ✅ Processing payments with token validation
6. ✅ Updating status and completing transactions

**No external service needed** - everything is self-hosted and controlled!





