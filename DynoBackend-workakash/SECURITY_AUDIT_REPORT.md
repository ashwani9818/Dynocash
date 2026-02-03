# Security Audit Report
**Date:** $(date)  
**Codebase:** DynoBackend-workakash  
**Auditor:** Security Review

---

## Executive Summary

This is a **Node.js/TypeScript backend application** for a payment processing system (DynoPay) that handles:
- Cryptocurrency payments (USDT, BTC, ETH, etc.)
- Traditional payment processing via Flutterwave
- User wallet management
- Payment links and subscriptions
- Admin and company management

**Overall Assessment:** The codebase appears to be **genuine application code** for a payment processing platform. However, **several critical security vulnerabilities** were identified that must be addressed before production deployment.

---

## 🔴 CRITICAL SECURITY ISSUES

### 1. **Hardcoded API Key (CRITICAL)**
**Location:** `apis/blockchairApi.ts:33`

```typescript
`https://api.blockchair.com/${baseCurrency}/dashboards/address/${address}?transaction_details=true&key=B___E6TK21VaUFalTaRHHZFIAA041zhk`
```

**Risk:** API key is hardcoded in source code. This key is exposed in version control and can be used by anyone to make API calls on your behalf, potentially leading to:
- Unauthorized API usage and billing charges
- Rate limit exhaustion
- Service disruption

**Recommendation:**
- Move the API key to environment variables: `process.env.BLOCKCHAIR_API_KEY_ALT` or use the same `BLOCKCHAIR_API_KEY`
- Rotate the exposed key immediately
- Ensure `.env` files are in `.gitignore`

---

### 2. **Server-Side Request Forgery (SSRF) Vulnerability (CRITICAL)**
**Location:** `controller/paymentController.ts:1751-1762`

```typescript
const callWebHook = async (customerData, transferDetails) => {
  await axios.post(
    customerData?.redirect_uri,  // ⚠️ No validation!
    {
      ...transferDetails,
      meta_data: customerData?.meta_data
        ? JSON.parse(customerData?.meta_data)
        : null,
    },
    {
      timeout: 30000,
    }
  );
```

**Risk:** An attacker can control `redirect_uri` to make the server send requests to:
- Internal services (localhost, 127.0.0.1, private IPs)
- Cloud metadata endpoints (AWS, GCP, Azure)
- Internal network resources
- Port scanning internal networks

**Recommendation:**
- Validate `redirect_uri` against an allowlist of domains
- Block private IP ranges (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
- Block localhost and metadata endpoints
- Use URL parsing and validation library
- Example:
```typescript
const allowedDomains = ['https://yourdomain.com', 'https://partner.com'];
const url = new URL(customerData.redirect_uri);
if (!allowedDomains.some(domain => url.origin === domain)) {
  throw new Error('Invalid redirect URI');
}
```

---

### 3. **File Upload Security Issues (HIGH)**
**Location:** `middleware/uploadImage.ts`

**Issues:**
- Only checks `mimetype` which can be spoofed
- No file size limits enforced
- No file content validation (magic bytes)
- Extension extraction from filename is vulnerable to path traversal

**Risk:**
- Malicious file uploads (executables, scripts)
- Path traversal attacks
- DoS via large file uploads

**Recommendation:**
- Validate file content using magic bytes, not just mimetype
- Enforce file size limits
- Whitelist allowed extensions
- Sanitize filenames
- Store files outside web root or use object storage
- Scan uploaded files for malware

---

### 4. **Test/Debug Endpoints Exposed (MEDIUM)**
**Location:** `routes/index.ts:37-43`

```typescript
router.post("/test-webhook", (req: express.Request, res: express.Response) => {
  console.log(req.body, JSON.stringify(req.body));
  const tempData = req.body;
  console.log("from test-webhook==========tempData==============>", tempData);
  res.status(200).end();
});
```

**Risk:**
- Test endpoints should not be in production
- No authentication/authorization
- Could leak sensitive data in logs

**Recommendation:**
- Remove test endpoints or guard with environment checks:
```typescript
if (process.env.NODE_ENV === 'development') {
  router.post("/test-webhook", ...);
}
```

---

## ⚠️ MEDIUM PRIORITY ISSUES

### 5. **CORS Configuration Too Restrictive for Production**
**Location:** `utils/constants.ts:1`

```typescript
const allowedOrigins = ["http://localhost:3000"];
```

**Issue:** Only allows localhost, which will break in production.

**Recommendation:**
- Use environment variables for allowed origins
- Support multiple environments (dev, staging, prod)

---

### 6. **Sensitive Data in Console Logs**
**Location:** Multiple files

**Examples:**
- `webhooks/index.ts:24,31,48` - Logs webhook payloads
- `routes/index.ts:38,40` - Logs request bodies
- Various controllers log sensitive data

**Risk:**
- Sensitive data (tokens, payment info) in logs
- Logs may be accessible to unauthorized users
- Compliance issues (PCI-DSS, GDPR)

**Recommendation:**
- Remove or sanitize sensitive data from logs
- Use structured logging with redaction
- Never log:
  - Passwords
  - API keys
  - Credit card numbers
  - JWT tokens
  - Personal information

---

### 7. **No Rate Limiting**
**Location:** `server.ts`

**Issue:** No rate limiting middleware found.

**Risk:**
- Brute force attacks on authentication
- API abuse
- DoS attacks

**Recommendation:**
- Implement rate limiting (e.g., `express-rate-limit`)
- Different limits for different endpoints
- IP-based and user-based rate limiting

---

### 8. **Hardcoded Localhost URLs**
**Location:** `controller/walletController.ts:931,1058`

```typescript
redirect_url: "http://localhost:3000/payment/verify",
```

**Issue:** Hardcoded localhost URLs will break in production.

**Recommendation:**
- Use environment variables for all URLs

---

## ✅ GOOD SECURITY PRACTICES FOUND

1. **Uses Helmet.js** - Security headers configured
2. **JWT Authentication** - Token-based auth implemented
3. **Sequelize ORM** - Uses parameterized queries (prevents SQL injection)
4. **Environment Variables** - Most secrets stored in env vars
5. **Webhook Signature Verification** - Flutterwave webhooks verify signatures
6. **Encryption Utilities** - AES encryption for sensitive data
7. **Input Validation** - Uses Joi for validation in some places
8. **HTTPS APIs** - External API calls use HTTPS

---

## 📋 CODE ANALYSIS SUMMARY

### Dangerous Functions Check:
- ✅ **No `eval()` usage** found
- ✅ **No `child_process`** usage found
- ✅ **No shell command execution** found
- ✅ **File system operations** are legitimate (image uploads, migrations)

### External API Calls:
All external API calls are to legitimate services:
- ✅ Blockchair API (blockchain data)
- ✅ Flutterwave API (payment processing)
- ✅ Tatum API (crypto services)
- ✅ Brevo API (email)
- ✅ Telegram API (notifications)
- ✅ FastForex API (currency conversion)

### Obfuscated Code:
- ✅ **No obfuscated code** found
- ✅ Base64 encoding is legitimate (used for encoding/decoding utilities)
- ✅ Code is readable and well-structured

### Authentication & Authorization:
- ✅ JWT-based authentication implemented
- ✅ Middleware for route protection
- ⚠️ Some endpoints may need additional authorization checks

### Database Security:
- ✅ Uses Sequelize ORM (parameterized queries)
- ✅ No raw SQL string concatenation found
- ✅ SQL injection risk is low

---

## 🎯 RECOMMENDATIONS PRIORITY LIST

### Immediate (Before Production):
1. **Fix hardcoded API key** - Move to environment variable
2. **Fix SSRF vulnerability** - Validate redirect_uri
3. **Remove test endpoints** or guard with environment checks
4. **Fix file upload security** - Add proper validation
5. **Update CORS configuration** for production

### Short Term:
6. **Remove sensitive data from logs**
7. **Implement rate limiting**
8. **Replace hardcoded URLs** with environment variables
9. **Add input validation** for all user inputs
10. **Implement request size limits**

### Long Term:
11. **Security headers audit** - Review Helmet configuration
12. **Dependency audit** - Check for vulnerable packages (`npm audit`)
13. **Penetration testing** - Professional security testing
14. **Security monitoring** - Implement logging and alerting
15. **Regular security reviews** - Schedule periodic audits

---

## 🔒 SAFETY ASSESSMENT

### Is this code safe to run?

**Development:** ⚠️ **CAUTION ADVISED**
- Code appears genuine and functional
- Critical vulnerabilities present but may be acceptable for local development
- Ensure `.env` files are not committed

**Production:** ❌ **NOT SAFE**
- **DO NOT deploy to production** until critical issues are fixed:
  1. Hardcoded API key must be removed
  2. SSRF vulnerability must be patched
  3. File upload security must be improved
  4. Test endpoints must be removed/guarded

---

## 📝 WHAT THE CODE DOES

This is a **legitimate payment processing backend** that:

1. **Payment Processing:**
   - Handles cryptocurrency payments (USDT, BTC, ETH, BCH, DOGE, LTC)
   - Integrates with Flutterwave for card/bank payments
   - Manages payment links and subscriptions

2. **User Management:**
   - User registration and authentication
   - Wallet management
   - Transaction history

3. **Admin Features:**
   - Admin dashboard
   - Fee management
   - Company management
   - API key management

4. **Background Jobs:**
   - Cron jobs for payment verification
   - USDT balance checking
   - Fee balance monitoring

5. **Webhooks:**
   - Flutterwave payment webhooks
   - Tatum blockchain webhooks

**Conclusion:** This is **genuine application code** for a payment platform, not malicious software. However, it has **security vulnerabilities** that need to be addressed.

---

## 📞 NEXT STEPS

1. Review and fix all critical issues
2. Run `npm audit` to check for vulnerable dependencies
3. Set up proper environment variable management
4. Implement security best practices
5. Consider professional security audit before production launch

---

**Report Generated:** Security Audit  
**Status:** ⚠️ Requires fixes before production deployment

