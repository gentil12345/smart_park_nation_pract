# ShopNow — Amazon-Style E-Commerce Platform

Full-stack e-commerce platform with React + Vite + Tailwind CSS frontend and Node.js/Express + MongoDB + JWT backend.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB running locally on port 27017

### 1. Start MongoDB
```bash
mongod
```

### 2. Seed the Database (first time only)
```bash
cd backend
node seed.js
```
Creates 12 products and 2 demo users.

### 3. Start Backend
```bash
cd backend
npm run dev
```
API runs at **http://localhost:8000**

### 4. Start Frontend
```bash
cd frontend
npm run dev
```
App runs at **http://localhost:5175** (or next available port)

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@shop.com | admin123 |
| **User** | jane@shop.com | user123 |

---

## ✨ Features

### Customer Features
- **Amazon-style UI** — Dark navy header, orange CTAs, clean product cards
- **Product catalog** with search, category filter, sort, pagination
- **Product detail** with image, reviews, star ratings, buy now
- **Shopping cart** with qty management, free shipping threshold
- **Checkout** with shipping address + payment method
- **Order history** with status tracking
- **User authentication** (JWT-based login/register)
- **Product reviews** with 5-star ratings

### Admin Features
- **📊 Dashboard with Reports & Charts:**
  - Revenue overview (last 6 months bar chart)
  - Order status breakdown (progress bars)
  - Top products by revenue
  - Products by category distribution
  - Low stock alerts (≤5 units)
  - Recent orders table
  - KPI cards (revenue, orders, users, products)
- **Product management** (CRUD: create, edit, delete)
- **Order management** (view details, mark delivered)
- **User management** (view all users)

### Technical Features
- JWT authentication with protected routes
- MongoDB with Mongoose ODM
- React Context API for state management
- Tailwind CSS v4 with Amazon color scheme
- Responsive design (mobile-first)
- Toast notifications
- Real-time cart updates
- Stock management
- Tax & shipping calculation

---

## 📊 Admin Reports

The admin dashboard (`/admin`) includes:

### Revenue Analytics
- **Monthly revenue chart** — Visual bar chart showing revenue trends over last 6 months
- **Total revenue** — Sum of all paid orders

### Order Analytics
- **Order status breakdown** — Visual progress bars showing pending, processing, shipped, delivered, cancelled
- **Total orders** — Count of all orders
- **Pending orders** — Orders awaiting processing

### Product Analytics
- **Top products by revenue** — Top 5 products ranked by total sales
- **Category distribution** — Products count per category
- **Low stock alerts** — Products with ≤5 units remaining
- **Out of stock count** — Products with 0 inventory

### User Analytics
- **Total registered users**
- **Recent orders table** — Last 8 orders with customer, items, payment status

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 8** — Build tool
- **Tailwind CSS v4** — Styling (Amazon color scheme)
- **React Router v6** — Routing
- **Axios** — HTTP client
- **react-hot-toast** — Notifications
- **Context API** — State management

### Backend
- **Node.js** — Runtime
- **Express** — Web framework
- **MongoDB** — Database
- **Mongoose** — ODM
- **JWT** — Authentication
- **bcryptjs** — Password hashing

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── models/          # User, Product, Order, Cart
│   ├── routes/          # auth, products, cart, orders, users
│   ├── middleware/      # JWT auth + admin guard
│   ├── server.js        # Express app
│   ├── seed.js          # Database seeder
│   └── .env             # Environment variables
└── frontend/
    └── src/
        ├── components/  # Navbar, Footer, ProductCard, etc.
        ├── context/     # AuthContext, CartContext
        ├── lib/         # API client (axios + JWT interceptor)
        ├── pages/       # All page components
        │   └── admin/   # Admin dashboard, products, orders
        └── App.jsx      # Main app with routes
```

---

## 🎨 Design System

### Colors (Amazon-inspired)
- **Primary:** `#FF9900` (Amazon Orange)
- **Dark:** `#131921` (Top nav)
- **Secondary:** `#232f3e` (Sub nav)
- **Link:** `#007185` (Amazon Blue)
- **Link Hover:** `#C7511F` (Orange-red)
- **Button:** `#FFD814` (Yellow CTA)
- **Background:** `#EAEDED` (Light gray)

### Typography
- Font: Amazon Ember (fallback: Arial, sans-serif)
- Headings: Bold, medium weight
- Body: Regular weight, 14px base

---

## 🔌 API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login user |
| GET | /api/auth/me | User | Get current user |
| PUT | /api/auth/profile | User | Update profile |

### Products
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/products | — | List products (search, filter, sort, paginate) |
| GET | /api/products/featured | — | Get featured products |
| GET | /api/products/:id | — | Get product by ID |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| POST | /api/products/:id/reviews | User | Add review |

### Cart
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/cart | User | Get user cart |
| POST | /api/cart | User | Add/update item |
| DELETE | /api/cart/:productId | User | Remove item |
| DELETE | /api/cart | User | Clear cart |

### Orders
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/orders | User | Create order |
| GET | /api/orders/my | User | Get user orders |
| GET | /api/orders/:id | User/Admin | Get order by ID |
| PUT | /api/orders/:id/pay | User | Mark order as paid |
| GET | /api/orders | Admin | Get all orders |
| PUT | /api/orders/:id/deliver | Admin | Mark order as delivered |

### Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/users | Admin | Get all users |
| DELETE | /api/users/:id | Admin | Delete user |

---

## 🚢 Deployment

### Backend
1. Set environment variables:
   ```
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   ```
2. Run: `npm start`

### Frontend
1. Build: `npm run build`
2. Serve `dist/` folder with any static host

---

## 📝 License

MIT

---

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.

---

## 📧 Support

For issues or questions, open a GitHub issue.
