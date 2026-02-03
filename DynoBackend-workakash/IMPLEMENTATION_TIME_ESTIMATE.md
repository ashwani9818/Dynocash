# Implementation Time Estimate

## Analysis Based on Client Requirements

---

## Missing Features Breakdown & Time Estimates

### 1. Company Profile & Invoice System

#### 1.1 Company Address/Tax ID Fields
**Tasks:**
- Update `companyModel.ts` to add: address_line_1, address_line_2, city, state, country, zip_code, VAT_number, Tax_ID
- Create database migration
- Update company controller (addCompany, updateCompany, getCompany)
- Update validation middleware
- Test CRUD operations

**Estimated Time:** 4-6 hours

#### 1.2 Invoice Generation System
**Tasks:**
- Create invoice model (invoice_id, transaction_id, company_id, customer_id, invoice_date, etc.)
- Create invoice items model (description, unit_price, quantity, VAT_rate, VAT_amount, etc.)
- Implement invoice generation logic per transaction
- Calculate fees breakdown (fixed fee, transaction fee %, blockchain buffer %)
- Generate invoice number/ID
- Store provider details (Dynotech Innovations, LDA)
- Store customer details from transaction
- Calculate totals (USD & crypto)
- Payment terms field

**Estimated Time:** 12-16 hours

#### 1.3 VAT Calculation Logic
**Tasks:**
- Implement VAT calculation based on country/VAT rate
- Apply VAT to invoice items
- Calculate VAT amount
- Handle VAT-exempt scenarios
- Integration with invoice generation

**Estimated Time:** 4-6 hours

#### 1.4 VAT Rate API Integration
**Tasks:**
- Review API documentation from Google Doc
- Set up external API client (VatLayer/Vatstack or similar)
- Create API service for VAT rate lookup by country
- Create API endpoint: `GET /api/vat/rate?country=XX`
- Error handling and caching
- Rate limiting considerations

**Estimated Time:** 6-8 hours

#### 1.5 TAX ID Acronym API
**Tasks:**
- Integrate TAX ID validation API (from Google Doc)
- Create API endpoint: `GET /api/tax/acronyms?country=XX`
- TAX ID validation endpoint: `POST /api/tax/validate`
- Error handling

**Estimated Time:** 4-6 hours

**Subtotal for Company Profile & Invoice:** 30-42 hours (4-5.5 days)

---

### 2. Notification APIs

#### 2.1 Notification Preferences Model
**Tasks:**
- Create notification preferences model (user_id, email_enabled, sms_enabled, push_enabled, etc.)
- Create notification types model (transaction_alerts, payment_received, weekly_summary, etc.)
- Database migration

**Estimated Time:** 3-4 hours

#### 2.2 Notification Management APIs
**Tasks:**
- `GET /api/notifications/preferences` - Get user preferences
- `PUT /api/notifications/preferences` - Update preferences
- `GET /api/notifications/history` - Get notification history
- `POST /api/notifications/send` - Send notification (admin/system)
- Notification queue system
- Multi-channel support (email, SMS, push)

**Estimated Time:** 8-12 hours

#### 2.3 System Event Triggers
**Tasks:**
- Integrate notification triggers in existing controllers:
  - Transaction status changes
  - Payment received
  - Password changes
  - Company creation
  - API key creation/deletion
- Event-driven notification system

**Estimated Time:** 6-8 hours

**Subtotal for Notification APIs:** 17-24 hours (2-3 days)

---

### 3. Dashboard APIs Enhancement

#### 3.1 Fee Tier Naming
**Tasks:**
- Add tier names mapping (Starter, Standard, Pro, Business, Enterprise)
- Update `calculateTransactionFees()` to return tier name
- Update analytics APIs to include tier information
- Volume-based tier identification:
  - Starter: $0-$10,000
  - Standard: $10,000-$50,000
  - Pro: $50,000-$250,000
  - Business: $250,000-$1,000,000
  - Enterprise: $1,000,000+

**Estimated Time:** 3-4 hours

**Subtotal for Dashboard:** 3-4 hours (0.5 day)

---

### 4. Additional Client Requirements

#### 4.1 Authentication Improvements
**Tasks:**
- Forgot password flow with OTP only
- Google Sign-In fix
- Mobile number login (Telnyx API verification)
- User data sync across devices

**Estimated Time:** 8-12 hours

#### 4.2 Company-Level Data & Wallet Separation
**Tasks:**
- Ensure transactions scoped per company
- Separate wallet addresses per company
- Update wallet address queries to include company_id
- Validation to prevent cross-company wallet sharing

**Estimated Time:** 6-8 hours

#### 4.3 API Key & Wallet Name
**Tasks:**
- Add API Name field to API model
- Add Wallet Name field to wallet model
- Update API endpoints to accept/return names
- Update API documentation

**Estimated Time:** 3-4 hours

#### 4.4 Transaction Filters & Export
**Tasks:**
- Transaction filter API (by date, status, currency, company, etc.)
- Export transactions API (CSV/JSON)
- Pagination and sorting

**Estimated Time:** 6-8 hours

#### 4.5 Payment Link APIs
**Tasks:**
- View Payment Link endpoint
- Edit Payment Link endpoint
- Post-Payment Settings endpoint
- Link ID management

**Estimated Time:** 4-6 hours

#### 4.6 Email Notifications (Onboarding & Events)
**Tasks:**
- Onboarding email template
- Password change/reset emails
- Company profile creation email
- API key creation/deletion emails
- Email template system
- Integration with existing mailTransporter

**Estimated Time:** 6-8 hours

#### 4.7 Hosted Checkout Changes
**Tasks:**
- Remove payment method selection screen
- Route directly to crypto payment
- Remove bank transfer options
- Dynamic filtering based on saved addresses

**Estimated Time:** 4-6 hours

#### 4.8 Landing Page API Status
**Tasks:**
- Create API status endpoint
- Health check for services (DB, Redis, external APIs)
- Service status reporting

**Estimated Time:** 2-3 hours

#### 4.9 Partial Wallet Configuration
**Tasks:**
- Update API key creation logic (allow with 1+ wallets)
- Update checkout to filter by available wallets
- Validation for unsupported assets
- Dynamic payment method filtering

**Estimated Time:** 6-8 hours

#### 4.10 Admin Fee Model Implementation
**Tasks:**
- Review and implement fee structure per blockchain
- Minimum forwarding amounts per chain
- Tiered fee calculation (already partially exists)
- Forwarding logic based on minimum thresholds
- Partial payment handling (30-min wait period)
- Update existing fee calculation functions

**Estimated Time:** 12-16 hours

**Subtotal for Additional Requirements:** 56-75 hours (7-9.5 days)

---

## Total Time Estimate

### Core Missing Features (Your Question):
| Feature | Time Estimate |
|---------|---------------|
| Company Address/Tax ID | 4-6 hours |
| Invoice Generation | 12-16 hours |
| VAT Calculation | 4-6 hours |
| VAT Rate API | 6-8 hours |
| Notification APIs | 17-24 hours |
| **Subtotal** | **43-60 hours (5.5-7.5 days)** |

### All Client Requirements:
| Category | Time Estimate |
|----------|---------------|
| Company Profile & Invoice System | 30-42 hours |
| Notification APIs | 17-24 hours |
| Dashboard Enhancement | 3-4 hours |
| Additional Requirements | 56-75 hours |
| **Total** | **106-145 hours (13-18 days)** |

---

## Timeline Breakdown

### Phase 1: Core Missing Features (5.5-7.5 days)
- Days 1-2: Company Address/Tax ID + Invoice Model Setup
- Days 3-4: Invoice Generation + VAT Calculation
- Days 4-5: VAT Rate API + TAX ID API Integration
- Days 5-6: Notification APIs (Preferences + Management)
- Day 7: Notification System Event Triggers

### Phase 2: Additional Requirements (7-9.5 days)
- Days 8-9: Authentication + Company-Level Data
- Days 9-10: Transaction Filters + Export
- Days 10-11: Payment Link APIs + Email Notifications
- Days 11-12: Hosted Checkout Changes + Partial Wallets
- Days 12-13: Admin Fee Model Implementation
- Days 13-14: API Status + Testing

---

## Risk Factors & Considerations

### High Complexity Items:
1. **Invoice Generation** - Complex business logic, multiple calculations
2. **Admin Fee Model** - Complex forwarding rules, partial payments, 30-min wait
3. **Notification System** - Event-driven architecture, multiple channels

### Dependencies:
- External API integrations (VAT Rate, TAX ID) - May require API keys/credentials
- Email service (Brevo) - Already integrated, needs template expansion
- Database migrations - Need careful planning for production

### Testing Requirements:
- Unit tests for fee calculations
- Integration tests for invoice generation
- API endpoint testing
- End-to-end testing for payment flows

---

## Recommended Approach

### Sprint 1 (Week 1-2): Core Features
- Company Profile Enhancement
- Invoice System Foundation
- VAT Integration

### Sprint 2 (Week 2-3): Notifications & Enhancements
- Notification APIs
- Dashboard Enhancements
- Transaction Features

### Sprint 3 (Week 3-4): Additional Requirements
- Authentication Improvements
- Payment Link APIs
- Admin Fee Model
- Testing & Bug Fixes

---

## Final Estimate

**For Core Missing Features Only:**
- **Minimum:** 43 hours (5.5 days) - With optimal conditions
- **Realistic:** 50-55 hours (6.5-7 days) - Including testing
- **Maximum:** 60 hours (7.5 days) - With complications

**For All Client Requirements:**
- **Minimum:** 106 hours (13 days)
- **Realistic:** 120-130 hours (15-16 days)
- **Maximum:** 145 hours (18 days)

**Recommendation:** Plan for **7-8 days** for core missing features, and **15-16 days** for complete implementation including all client requirements.

---

**Note:** These estimates assume:
- Single developer working full-time
- No major blockers or API access issues
- Existing codebase familiarity
- Standard development practices (code review, testing)
- Moderate complexity in business logic





