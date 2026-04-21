# FinFlow - Production Deployment Guide

Complete instructions for deploying FinFlow with invoice and payment processing capabilities to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Email Service Setup](#email-service-setup)
4. [Payment Processing (Stripe)](#payment-processing-stripe)
5. [Database Setup (Supabase)](#database-setup-supabase)
6. [Deployment to Netlify](#deployment-to-netlify)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All dependencies installed (`pnpm install`)
- [ ] Build succeeds locally (`pnpm build`)
- [ ] All environment variables documented
- [ ] Stripe account created and keys obtained
- [ ] Email service configured (SendGrid, Mailgun, or SMTP)
- [ ] Supabase project created with database schema
- [ ] SSL/HTTPS enabled on production domain
- [ ] CORS configured for production domain
- [ ] Backup strategy in place
- [ ] Monitoring/alerting configured

---

## Environment Configuration

### Configuration File Structure

FinFlow uses a centralized configuration system in `config/app.config.ts`. All environment variables must be set before deployment.

### Environment Variables

Create a `.env.production` file in the project root:

```bash
# Application
NODE_ENV=production
APP_URL=https://your-domain.com
API_BASE_URL=https://your-domain.com/api
PORT=8080

# Database (Supabase)
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
# OR individual components:
DB_HOST=db.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=24h

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration
EMAIL_SERVICE=sendgrid  # Options: sendgrid, mailgun, nodemailer
EMAIL_FROM=noreply@your-domain.com
EMAIL_FROM_NAME=FinFlow

# SendGrid Configuration (if using SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_api_key

# Mailgun Configuration (if using Mailgun)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mg.your-domain.com

# Nodemailer Configuration (if using SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Invoice Configuration
INVOICE_CURRENCY=USD
INVOICE_TAX_RATE=0.08
INVOICE_DAYS_UNTIL_OVERDUE=30
INVOICE_PREFIX=INV

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### Configuration Validation

The app validates required environment variables at startup. To test:

```bash
pnpm build
NODE_ENV=production node dist/server/index.js
```

---

## Email Service Setup

### Option 1: SendGrid (Recommended)

#### Setup Steps:

1. **Create SendGrid Account**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up for a free account
   - Verify domain ownership

2. **Generate API Key**
   - Navigate to Settings → API Keys
   - Click "Create API Key"
   - Name it "FinFlow Production"
   - Select "Full Access" for permissions
   - Copy the key

3. **Update .env**
   ```bash
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.your_key_here
   EMAIL_FROM=noreply@your-domain.com
   EMAIL_FROM_NAME=FinFlow
   ```

4. **Install Dependency**
   ```bash
   pnpm add @sendgrid/mail
   ```

5. **Verify Setup**
   ```bash
   # Test sending email
   curl -X POST "https://api.sendgrid.com/v3/mail/send" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "personalizations": [{"to": [{"email": "test@example.com"}]}],
       "from": {"email": "noreply@your-domain.com"},
       "subject": "Test Email",
       "content": [{"type": "text/plain", "value": "Test"}]
     }'
   ```

### Option 2: Mailgun

#### Setup Steps:

1. **Create Mailgun Account**
   - Go to [mailgun.com](https://mailgun.com)
   - Sign up and verify domain

2. **Get API Key**
   - Navigate to API → Private Key
   - Copy the key

3. **Update .env**
   ```bash
   EMAIL_SERVICE=mailgun
   MAILGUN_API_KEY=key-xxxxx
   MAILGUN_DOMAIN=mg.your-domain.com
   EMAIL_FROM=noreply@your-domain.com
   EMAIL_FROM_NAME=FinFlow
   ```

4. **Install Dependency**
   ```bash
   pnpm add mailgun.js
   ```

### Option 3: SMTP (Gmail, Office365, etc.)

#### Setup Steps for Gmail:

1. **Enable 2FA on Google Account**
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password

3. **Update .env**
   ```bash
   EMAIL_SERVICE=nodemailer
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=FinFlow
   ```

4. **Install Dependency**
   ```bash
   pnpm add nodemailer
   ```

---

## Payment Processing (Stripe)

### Stripe Setup

#### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for an account
3. Verify email and complete onboarding

#### 2. Get API Keys

1. Navigate to Dashboard → Developers → API Keys
2. Copy **Secret Key** (starts with `sk_live_`)
3. Copy **Publishable Key** (starts with `pk_live_`)

#### 3. Configure Webhook

1. In Stripe Dashboard, go to Developers → Webhooks
2. Click "Add Endpoint"
3. Set Endpoint URL to: `https://your-domain.com/api/payments/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the Signing Secret (starts with `whsec_`)

#### 4. Update .env

```bash
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### 5. Implement Webhook Handler

Update `server/routes/payments.ts` to verify webhook signature:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handleStripeWebhook: RequestHandler = async (req, res) => {
  const signature = req.headers['stripe-signature'] as string;
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle events
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Update payment status
        break;
      case 'payment_intent.payment_failed':
        // Handle failure
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: 'Webhook error' });
  }
};
```

#### 6. Update Payment Processing

Update `server/routes/payments.ts` to actually charge cards:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const processPayment: RequestHandler = async (req, res) => {
  const { amount, paymentMethod } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethod,
      confirm: true,
    });

    // Update database with Stripe response
    res.json({
      success: true,
      data: {
        stripePaymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Payment failed' });
  }
};
```

---

## Database Setup (Supabase)

### Supabase Configuration

#### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Choose a region close to your users
4. Save the database password

#### 2. Get Connection Details

1. In Supabase Dashboard, go to Settings → Database
2. Copy **Connection String** or individual details:
   - Host
   - Port: 5432
   - Database: postgres
   - User: postgres
   - Password: (as set during creation)

#### 3. Update .env

```bash
DATABASE_URL=postgresql://postgres:your-password@db.supabase.co:5432/postgres
# OR
DB_HOST=db.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
```

#### 4. Initialize Database Schema

1. Go to SQL Editor in Supabase Dashboard
2. Execute the SQL from `DATABASE_SCHEMA.md`
3. Create indexes and views as documented

#### 5. Enable Row Level Security (RLS)

```sql
-- Enable RLS for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies (examples)
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view their invoices" ON invoices
  FOR SELECT USING (user_id = auth.uid());
```

#### 6. Connect from Application

Install Supabase client:

```bash
pnpm add @supabase/supabase-js
```

Update database service (`server/services/database.ts`):

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default supabase;
```

---

## Deployment to Netlify

### Netlify Deployment Steps

#### 1. Connect GitHub Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your FinFlow repository
5. Configure build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (or higher)

#### 2. Set Environment Variables

1. In Netlify, go to Site settings → Environment
2. Add all variables from `.env.production`:

```
NODE_ENV=production
APP_URL=https://your-site.netlify.app
API_BASE_URL=https://your-site.netlify.app/api
DATABASE_URL=postgresql://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
SENDGRID_API_KEY=...
EMAIL_FROM=...
```

#### 3. Configure Domain

1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS instructions
4. Verify SSL (automatic)

#### 4. Setup Netlify Functions

For Express server, Netlify will automatically wrap it:

```bash
# Build will create serverless functions
pnpm build
```

Or manually update `netlify.toml`:

```toml
[build]
  command = "pnpm build"
  functions = "netlify/functions"
  publish = "dist/spa"

[dev]
  command = "pnpm dev"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 5. Deploy

```bash
# Using Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod

# OR simply push to GitHub
git push origin main  # Auto-deploys if connected
```

---

## Post-Deployment Verification

### Testing Payment Flow

1. **Navigate to Invoices**
   ```
   https://your-domain.com/invoices
   ```

2. **Create Test Invoice**
   - Fill in client details
   - Add line items
   - Click "Create Invoice"

3. **Send Invoice**
   - Click "Send" on the invoice
   - Verify email was sent to client email

4. **Test Payment**
   - Copy payment link
   - Open in incognito window
   - Use Stripe test card: `4242 4242 4242 4242`
   - Complete payment

5. **Verify Confirmation**
   - Check payment succeeded
   - Verify receipt email sent
   - Check invoice status changed to "Paid"

### Verification Checklist

- [ ] Invoice creation works
- [ ] Email delivery successful
- [ ] Payment page loads correctly
- [ ] Stripe test payment processes
- [ ] Receipt email sent
- [ ] Database records updated
- [ ] Invoice status updated to "paid"
- [ ] Dashboard shows paid invoice
- [ ] No errors in logs

---

## Monitoring & Troubleshooting

### Logging Setup

#### Environment Variables

```bash
LOG_LEVEL=info      # debug, info, warn, error
LOG_FORMAT=json     # json or text
```

#### Implement Logging

Add logging service (`server/services/logger.ts`):

```typescript
import config from '../../config/app.config';

class Logger {
  log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    };

    if (config.logging.format === 'json') {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`[${timestamp}] [${level}] ${message}`, data || '');
    }
  }

  info(message: string, data?: any) { this.log('INFO', message, data); }
  error(message: string, data?: any) { this.log('ERROR', message, data); }
  warn(message: string, data?: any) { this.log('WARN', message, data); }
  debug(message: string, data?: any) { this.log('DEBUG', message, data); }
}

export default new Logger();
```

### Common Issues & Solutions

#### Issue: Emails Not Sending

**Check:**
1. Email credentials in `.env`
2. Email service API key valid
3. `sendEmail` function called with correct parameters
4. Domain verified with email service

**Debug:**
```bash
# Test SendGrid
curl -X POST "https://api.sendgrid.com/v3/mail/send" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"to": [...], "from": {...}, "subject": "test"}'
```

#### Issue: Stripe Webhook Not Triggering

**Check:**
1. Webhook URL correct in Stripe dashboard
2. Signature secret matches `STRIPE_WEBHOOK_SECRET`
3. Event types selected in webhook config
4. Raw request body passed to `constructEvent`

**Debug:**
```typescript
// Log webhook events
console.log('Webhook received:', event.type, event.id);
```

#### Issue: Database Connection Failed

**Check:**
1. Connection string correct (include `postgresql://`)
2. IP whitelist configured (if required)
3. Database user has correct permissions
4. SSL enabled if required

**Debug:**
```bash
# Test connection
psql "postgresql://user:password@host:5432/dbname" -c "SELECT 1;"
```

### Monitoring Recommendations

#### 1. Error Tracking (Sentry)

```bash
pnpm add @sentry/node @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Use in error handler
app.use(Sentry.Handlers.errorHandler());
```

#### 2. Uptime Monitoring

Use services like:
- Uptime Robot (free)
- Better Uptime
- Pingdom

Monitor endpoint: `https://your-domain.com/api/ping`

#### 3. Log Aggregation

- Netlify Logs (built-in)
- Papertrail
- LogRocket
- Datadog

#### 4. Payment Reconciliation

Regularly reconcile Stripe transactions:

```bash
# Monthly reconciliation script
# Check that all Stripe charges are recorded in database
```

### Health Check Endpoint

Keep the health check endpoint active:

```typescript
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  });
});
```

Monitor: `https://your-domain.com/api/health`

---

## Security Best Practices

### Before Going Live

1. **Change All Secrets**
   - Don't use example values
   - Use strong, random strings (min 32 chars)

2. **Enable HTTPS**
   - Ensure SSL/TLS certificate valid
   - Redirect HTTP to HTTPS

3. **Configure CORS**
   ```typescript
   app.use(cors({
     origin: process.env.APP_URL,
     credentials: true,
   }));
   ```

4. **Rate Limiting**
   ```bash
   pnpm add express-rate-limit
   ```

5. **Input Validation**
   ```bash
   pnpm add zod
   ```

6. **Secure Headers**
   ```bash
   pnpm add helmet
   ```

### Sensitive Data Handling

- Never log payment card numbers
- Never store raw card data
- Use Stripe tokenization
- Encrypt database passwords
- Rotate API keys regularly

---

## Rollback Procedure

If deployment fails:

### Netlify

1. Go to Deploys
2. Click on previous successful deploy
3. Click "Restore this deploy"

### Database

1. Keep backups of database
2. Supabase provides automated backups
3. Test restore procedure monthly

---

## Support & Resources

- **Stripe Docs**: https://stripe.com/docs
- **SendGrid Docs**: https://docs.sendgrid.com
- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Express Docs**: https://expressjs.com

---

**Version**: 1.0  
**Last Updated**: January 2024  
**Maintained By**: FinFlow Team
