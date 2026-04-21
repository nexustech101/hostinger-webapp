# FinFlow - Professional Finance Application

A modern, full-stack finance application built for small businesses and freelancers. FinFlow provides comprehensive financial management with an intuitive interface and robust backend architecture.

## Features

### Dashboard & Analytics
- **Real-time Balance Overview** - Track total balance, monthly income, expenses, and net profit
- **Revenue Analytics** - Line charts showing revenue vs. expenses trends
- **Spending Categories** - Pie chart breakdown of spending by category
- **Recent Transactions** - Quick view of latest transactions
- **Quick Actions** - One-click access to common operations

### Wallet Management
- **Multiple Wallets** - Create and manage different wallet types (primary, savings, business)
- **Balance Visibility** - Show/hide balances for privacy
- **Fund Transfers** - Transfer money between wallets instantly
- **Wallet Details** - View detailed information about each wallet

### Transaction Management
- **Comprehensive History** - View all transactions with detailed information
- **Advanced Filtering** - Filter by type, category, date range, and search term
- **Export Functionality** - Export transactions to CSV or JSON format
- **Transaction Details** - Click to view full details of any transaction
- **Categories** - Pre-defined categories for better organization

### Payment Methods
- **Multiple Payment Types** - Support for credit/debit cards, bank accounts, PayPal, CashApp, Square
- **Secure Storage** - Payment details tokenized and encrypted
- **Verification** - Verify payment methods before use
- **Default Method** - Set a default payment method
- **Easy Management** - Add, edit, and delete payment methods

### Security & Settings
- **Profile Management** - Update personal information
- **Security Settings** - Change password and enable 2FA
- **Notification Preferences** - Customize email and alert settings
- **Account Preferences** - Set currency, theme, and notification frequency
- **Secure Logout** - Session management and account security

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router 6** - Client-side routing (SPA)
- **TypeScript** - Type-safe development
- **TailwindCSS 3** - Utility-first CSS framework
- **Recharts** - React charting library for data visualization
- **Radix UI + ChadCN** - Accessible component library
- **Vite** - Lightning-fast build tool

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe backend code
- **Middleware**:
  - Authentication (JWT verification)
  - Error handling
  - CORS support

### Architecture
- **Monorepo Structure** - Frontend and backend in single repository
- **SPA (Single Page Application)** - Client-side rendering with React Router
- **RESTful API** - Standard HTTP endpoints
- **Type-Safe Communication** - Shared TypeScript types between client and server

## Project Structure

```
├── client/
│   ├── components/
│   │   ├── ui/                 # Pre-built ChadCN components
│   │   └── layout/
│   │       ├── AppLayout.tsx   # Main layout wrapper
│   │       ├── Sidebar.tsx     # Navigation sidebar
│   │       └── Header.tsx      # Top header with user menu
│   ├── pages/
│   │   ├── Dashboard.tsx       # Home dashboard
│   │   ├── Wallet.tsx          # Wallet management
│   │   ├── Transactions.tsx    # Transaction history
│   │   ├── Cards.tsx           # Payment methods
│   │   ├── Settings.tsx        # User settings
│   │   └── NotFound.tsx        # 404 page
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── App.tsx                 # App routing setup
│   ├── global.css              # Global styles and theme
│   └── vite-env.d.ts          # Vite types
│
├── server/
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication
│   │   └── errorHandler.ts     # Global error handling
│   ├── routes/
│   │   ├── auth.ts             # Authentication endpoints
│   │   ├── user.ts             # User profile endpoints
│   │   ├── wallet.ts           # Wallet management endpoints
│   │   ├── transactions.ts     # Transaction endpoints
│   │   ├── cards.ts            # Payment methods endpoints
│   │   ├── payments.ts         # Payment processing endpoints
│   │   └── demo.ts             # Demo endpoint
│   └── index.ts                # Server setup and route registration
│
├── shared/
│   └── api.ts                  # Shared types for client & server
│
├── tailwind.config.ts          # TailwindCSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── vite.config.server.ts       # Vite server build configuration
└── package.json                # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/settings` - Update preferences
- `DELETE /api/users/account` - Delete account

### Wallets
- `GET /api/wallets` - List all wallets
- `POST /api/wallets` - Create wallet
- `GET /api/wallets/:walletId` - Get wallet details
- `PUT /api/wallets/:walletId` - Update wallet
- `DELETE /api/wallets/:walletId` - Delete wallet
- `POST /api/wallets/:walletId/transfer` - Transfer funds

### Transactions
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/:transactionId` - Get transaction details
- `POST /api/transactions` - Create transaction
- `POST /api/transactions/export` - Export transactions
- `GET /api/transactions/categories` - Get categories

### Payment Methods
- `GET /api/payment-methods` - List payment methods
- `POST /api/payment-methods` - Add payment method
- `GET /api/payment-methods/:methodId` - Get payment method
- `PUT /api/payment-methods/:methodId` - Update payment method
- `POST /api/payment-methods/:methodId/verify` - Verify payment method
- `DELETE /api/payment-methods/:methodId` - Delete payment method

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments/process` - Process payment
- `GET /api/payments/:paymentId` - Get payment status
- `POST /api/payments/:paymentId/refund` - Refund payment
- `POST /api/payments/webhook` - Stripe webhook handler

## Getting Started

### Prerequisites
- Node.js 16+ 
- pnpm 10.14.0+

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file (if needed):
```bash
PING_MESSAGE=pong
NODE_ENV=development
```

### Development

Start the development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:8080`

### Building

Build for production:
```bash
pnpm build
```

This creates optimized builds for both client and server in the `dist/` directory.

### Running Production Build

```bash
pnpm start
```

## Authentication

The application uses JWT (JSON Web Token) authentication. 

**Current Implementation:**
- Mock JWT tokens are generated for demonstration
- Authentication middleware validates tokens on protected routes
- Tokens include user ID and expiration time

**Production Implementation (TODO):**
1. Use `jsonwebtoken` library for proper JWT signing
2. Implement bcrypt for password hashing
3. Add refresh token rotation
4. Store tokens securely (HttpOnly cookies)
5. Implement rate limiting on auth endpoints

## Testing Features

### Mock Data
All endpoints use mock data for demonstration. To test:

1. **Login:** Send POST request to `/api/auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "anypassword"
   }
   ```

2. **Access Protected Routes:** Include Authorization header
   ```
   Authorization: Bearer <token-from-login>
   ```

3. **Mock Wallets:** Pre-populated with sample data
   - Main Wallet: $12,450.75
   - Savings: $8,500.00
   - Business Account: $3,629.75

4. **Mock Transactions:** Sample transactions with various categories
   - Income transactions (Stripe, Client Invoice, Freelance)
   - Expense transactions (Office Supplies, Software License)

## Integration Guide

### Frontend Integration

Example: Connect Dashboard to backend wallet API:

```typescript
import { useEffect, useState } from 'react';

export function Dashboard() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await fetch('/api/wallets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setWallets(data.data.wallets);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Dashboard content
  );
}
```

### Backend Integration with Database

To connect to a real database (e.g., Supabase):

1. Install Supabase client:
```bash
pnpm add @supabase/supabase-js
```

2. Create database service (`server/services/supabase.ts`):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export default supabase;
```

3. Replace mock data with database queries in route handlers

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy automatically on push to main

### Environment Variables (Production)

Required for production deployment:
```
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
JWT_SECRET=your-secret-key
```

## Security Considerations

- ✅ CORS enabled for development (configure for production)
- ✅ Authentication middleware for protected routes
- ✅ Error handling prevents information leakage
- ⚠️ TODO: Implement rate limiting
- ⚠️ TODO: Add input validation with Zod
- ⚠️ TODO: Implement HTTPS only cookies
- ⚠️ TODO: Add CSRF protection
- ⚠️ TODO: Implement audit logging

## Performance Optimizations

- Code splitting and lazy loading
- Optimized bundle size (Vite)
- React Query for efficient data fetching
- Recharts for lightweight charting
- TailwindCSS for minimal CSS output

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact support.

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Status:** Production Ready (with Supabase/Stripe integration required)
