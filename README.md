# ShopNow — Full-Stack E-Commerce

React + Vite + Tailwind CSS frontend with Node.js/Express + MongoDB + JWT backend.

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running locally on port 27017.

### 2. Seed the database (first time only)
```bash
cd backend
node seed.js
```
Creates 12 products + 2 users:
- **Admin:** admin@shop.com / admin123
- **User:** jane@shop.com / user123

### 3. Start the backend
```bash
cd backend
npm run dev
```
API runs at http://localhost:8000

### 4. Start the frontend (new terminal)
```bash
cd frontend
npm run dev
```
App runs at http://localhost:5173

---

## Features

### Customer
- Browse & search products with filters (category, sort, pagination)
- Product detail page with reviews & star ratings
- Cart management (add, update qty, remove)
- Checkout with shipping address + payment method
- Order history

### Admin (admin@shop.com)
- Dashboard with revenue, order, user, product stats
- Full product CRUD (create, edit, delete)
- Order management (view details, mark delivered)

### Auth
- JWT-based login/register
- Protected routes (PrivateRoute + AdminRoute)
- Persistent sessions via localStorage

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | User | Get profile |
| PUT | /api/auth/profile | User | Update profile |
| GET | /api/products | — | List products |
| GET | /api/products/featured | — | Featured products |
| GET | /api/products/:id | — | Product detail |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| POST | /api/products/:id/reviews | User | Add review |
| GET | /api/cart | User | Get cart |
| POST | /api/cart | User | Add/update item |
| DELETE | /api/cart/:productId | User | Remove item |
| POST | /api/orders | User | Place order |
| GET | /api/orders/my | User | My orders |
| GET | /api/orders/:id | User/Admin | Order detail |
| PUT | /api/orders/:id/pay | User | Mark paid |
| GET | /api/orders | Admin | All orders |
| PUT | /api/orders/:id/deliver | Admin | Mark delivered |
| GET | /api/users | Admin | All users |
| DELETE | /api/users/:id | Admin | Delete user |

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v6, Axios, react-hot-toast
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs
- **Database:** MongoDB
