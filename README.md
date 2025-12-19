# Interest Calculator

# Application Overview

**Interest Calculator** is a comprehensive web application for managing loan transactions, tracking payments, and calculating interest for both lending and borrowing activities.

### Key Features:

- Secure user authentication (JWT)
- Customer/Investor account management
- Transaction management (Lent/Borrowed)
- Simple and Compound interest calculations
- Payment tracking with automatic status updates
- Notifications for overdue and upcoming payments
- Dashboard with analytics and charts
- PDF and Excel export functionality
- Responsive design (works on all devices)

---

## Application Access

**Web Application URL:** `http://localhost:3000`  
**Backend API URL:** `http://localhost:5000/api`

### Test Credentials:

```
Email: john@test.com
Password: Test@123
```

_(Create your own account via registration page)_

---

## Technology Stack

### Frontend:

- **Framework:** React 18.2.0
- **Routing:** React Router DOM 7.10.1
- **Forms:** React Hook Form 7.68.0
- **Charts:** Recharts 3.6.0
- **Styling:** Tailwind CSS 3.4.17
- **HTTP Client:** Fetch API
- **Export:** jsPDF 2.5.1, xlsx 0.18.5

### Backend:

- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.21.2
- **Database:** MongoDB 6.0+
- **Authentication:** JWT (jsonwebtoken 9.0.2)
- **Password:** bcrypt 5.1.1
- **Validation:** express-validator 7.2.1
- **File Upload:** multer 1.4.5-lts.1

---

## Quick Start Guide

### For End Users:

1. **Access Application:**

   ```
   Open browser → Navigate to http://localhost:3000
   ```

2. **Register/Login:**

   ```
   Click "Register" → Fill details → Create account
   OR
   Login with existing credentials
   ```

3. **Start Using:**
   ```
   Dashboard → View summary
   Accounts → Add customers/investors
   Add Transaction → Create loan records
   Transactions → Track all loans
   Notifications → Stay updated
   ```

### For Administrators:

1. **Start Backend:**

   ```bash
   cd interest-app/backend
   npm start
   ```

   Backend runs on http://localhost:5000

2. **Start Frontend:**

   ```bash
   cd interest-app
   npm start
   ```

   Frontend runs on http://localhost:3000

3. **Database:**
   ```bash
   # MongoDB should be running on:
   mongodb://localhost:27017/interest_calculator
   ```

---
