# ShopEZ E-Commerce Application

ShopEZ is a production-ready, full-stack MERN (MongoDB, Express, React, Node.js) e-commerce web application built using Vite, Tailwind CSS, Axios, and JWT authentication. It implements an MVC architecture on the backend and uses React Context API for state management on the client.

## Features

- **MVC Architecture**: Codebase is clean, modular, and separated into models, views, controllers, and routes.
- **JWT Authentication**: Secured registration, logins, and session persistence.
- **Role-Based Access Control**: Separate customer and administrator routes and controls.
- **Dynamic Catalog Filters**: Live search, category selectors, sorting, and price range filters.
- **Interactive Shopping Cart**: Quantity adjustments synchronized with live inventory stocks.
- **Sandbox Checkout**: Mock checkout flow supporting shipping details and order creation.
- **Admin Dashboard**: Store analytics,SVG fulfillment graphs, inventory management (CRUD), and order updates.
- **Responsive Premium Theme**: Styled with modern gradients, Inter typography, scrollbar modifications, and glassmorphic blurs.

---

## Folder Structure

```text
ShopEZ/
│
├── Client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── components/          # Reusable interface elements (Navbar, Footer, Cards)
│   │   ├── context/             # Global contexts (AuthContext, CartContext)
│   │   ├── pages/               # Views (Home, Catalog, Cart, Dashboard, Checkout)
│   │   ├── routes/              # Client side router mapping
│   │   ├── services/            # Axios API wrappers
│   │   ├── App.jsx              # Main React layout
│   │   ├── main.jsx             # React DOM entry
│   │   └── index.css            # Global CSS styles & Tailwind imports
│   ├── package.json
│   └── vite.config.js
│
├── Server/                      # Node.js + Express API
│   ├── config/                  # Database connections
│   ├── controllers/             # REST controller handlers
│   ├── middleware/              # JWT verification, Role guards, and Error loggers
│   ├── models/                  # Mongoose MongoDB schemas
│   ├── routes/                  # Express Router definitions
│   ├── seed/                    # Database seeding scripts
│   ├── .env                     # Environment variables
│   ├── index.js                 # Server entry point
│   └── package.json
│
└── README.md                    # Documentation
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Database Configuration
1. Change into the server folder:
   ```bash
   cd Server
   ```
2. Inspect the `.env` file containing environment configurations. Update `MONGODB_URI` if connecting to a cloud Atlas cluster:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/shopez
   JWT_SECRET=shopez_secret_key_2026_safe_and_secure
   NODE_ENV=development
   ```

### 2. Backend Setup & Seeding
1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Seed the database with sample products and default users:
   ```bash
   npm run seed
   ```
3. Start the Express backend:
   ```bash
   npm run dev
   ```
   The backend server runs on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal tab and change into the client folder:
   ```bash
   cd Client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React client dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## Seeding & Test Accounts

Running `npm run seed` creates two default test accounts:

### 1. Customer User
- **Email**: `customer@shopez.com`
- **Password**: `customer123`
- **Role**: Customer (Accesses catalog, profile, cart, checkouts, and order histories)

### 2. Admin User
- **Email**: `admin@shopez.com`
- **Password**: `admin123`
- **Role**: Admin (Full access to product inventory editing and customer orders modification)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create customer account
- `POST /api/auth/login` - Authenticate credentials, return token
- `POST /api/auth/logout` - Clear session cookies/tokens
- `PUT /api/auth/profile` - Update customer profile credentials

### Products
- `GET /api/products` - List products (supports query search, category, sort, price min/max)
- `GET /api/products/:id` - Fetch single product specifications
- `POST /api/products` - Add product (Admin only)
- `PUT /api/products/:id` - Modify product values (Admin only)
- `DELETE /api/products/:id` - Delete product from catalog (Admin only)

### Cart
- `GET /api/cart/:userId` - Get user cart items
- `POST /api/cart/add` - Add product row to cart
- `PUT /api/cart/update` - Adjust item quantity (minimum 1)
- `DELETE /api/cart/remove/:id` - Delete item from shopping cart

### Orders
- `GET /api/orders` - Get current user orders (Admin returns all orders)
- `GET /api/orders/:id` - Inspect invoice particulars
- `POST /api/orders` - Place order, deduct catalog stocks, empty cart
- `PUT /api/orders/:id` - Update status from pending to shipped or delivered (Admin only)

### Admin Statistics
- `GET /api/admin/dashboard` - Fulfill sales totals, customer sizes, order quantities, and recent invoices
- `GET /api/admin/orders` - Pull list of customer checkouts
- `POST /api/admin/product` - Map product adding
- `PUT /api/admin/product/:id` - Map product edits
- `DELETE /api/admin/product/:id` - Map product deletions
