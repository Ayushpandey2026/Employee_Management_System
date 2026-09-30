# Employee Management System

A full-stack employee management app built with **Next.js (App Router)**, **Express**, and **MongoDB**. Admins and HR users can sign in, manage employee records, and view workforce stats on a dashboard.

## Features

- JWT authentication stored in an httpOnly cookie (register, login, logout)
- Password hashing with bcryptjs
- Employee CRUD (add, view, edit, delete)
- Server-side search, department and status filters, and pagination
- Dashboard with total, active, inactive and department counts (Mongoose aggregation)
- Protected dashboard routes on the frontend
- Debounced search input (400ms)
- Add/Edit employee modal and delete confirmation
- Responsive UI with Tailwind CSS

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend  | Node.js, Express 4                             |
| Database | MongoDB with Mongoose                          |
| Auth     | JWT (httpOnly cookie), bcryptjs                |

## Project Structure

```
employee-management-system/
├── server/
│   └── src/
│       ├── config/          # MongoDB connection
│       ├── controllers/     # auth, employee, dashboard logic
│       ├── middleware/      # verifyToken, error handling
│       ├── models/          # User, Employee schemas
│       ├── routes/          # API routes
│       ├── app.js
│       └── server.js
└── client/
    └── src/
        ├── app/
        │   ├── login/
        │   ├── register/
        │   └── dashboard/   # protected layout, stats, employees table
        ├── components/      # Navbar, Modal, Pagination, StatCard, EmployeeFormModal
        ├── context/         # AuthContext
        ├── hooks/           # useDebounce
        └── lib/             # API fetch wrapper
```

## Prerequisites

- Node.js 18 or later
- MongoDB running locally, or a MongoDB Atlas connection string

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ayushpandey2026/Employee_Management_System
cd employee-management-system
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/employee_management
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Start the API:

```bash
npm run dev
```

The server runs on `http://localhost:5000`.

### 3. Set up the client

Open a new terminal:

```bash
cd client
npm install
cp .env.example .env.local
```

`client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev
```

The app runs on `http://localhost:3000`. Register an account to get started.

## API Endpoints

All employee and dashboard routes require authentication.

### Auth

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Create an account              |
| POST   | `/api/auth/login`    | Log in and set the auth cookie |
| POST   | `/api/auth/logout`   | Clear the auth cookie          |
| GET    | `/api/auth/me`       | Get the current user           |

### Employees

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| POST   | `/api/employees`             | Add an employee              |
| GET    | `/api/employees`             | List employees (paginated)   |
| GET    | `/api/employees/departments` | List distinct departments    |
| GET    | `/api/employees/:id`         | Get employee details         |
| PUT    | `/api/employees/:id`         | Update an employee           |
| DELETE | `/api/employees/:id`         | Delete an employee           |

**Query params for `GET /api/employees`:**

| Param        | Description                                        |
| ------------ | -------------------------------------------------- |
| `search`     | Matches full name, email or designation            |
| `department` | Filter by department                               |
| `status`     | `ACTIVE` or `INACTIVE`                             |
| `page`       | Page number (default `1`)                          |
| `limit`      | Items per page (default `10`, max `100`)           |

### Dashboard

| Method | Endpoint               | Description                                               |
| ------ | ---------------------- | --------------------------------------------------------- |
| GET    | `/api/dashboard/stats` | Total, active, inactive employees and department count   |

## Employee Schema

| Field           | Type   | Notes                     |
| --------------- | ------ | ------------------------- |
| `fullName`      | String | Required                  |
| `email`         | String | Required, unique          |
| `phone`         | String | Required                  |
| `department`    | String | Required                  |
| `designation`   | String | Required                  |
| `salary`        | Number | Required, minimum 0       |
| `dateOfJoining` | Date   | Required                  |
| `status`        | String | `ACTIVE` (default) or `INACTIVE` |

## Notes

- New accounts are created with the `hr` role. To make an admin, change the user's `role` to `admin` directly in MongoDB.
- If the frontend and API are deployed on different domains, set `sameSite: 'none'` (with `secure: true`) in the cookie options in `server/src/controllers/authController.js`, and update `CLIENT_URL` and `NEXT_PUBLIC_API_URL`.
- Never commit your `.env` files. Use a strong, unique `JWT_SECRET` in production.

## Scripts

| Location | Command         | Description              |
| -------- | --------------- | ------------------------ |
| server   | `npm run dev`   | Start with nodemon       |
| server   | `npm start`     | Start in production mode |
| client   | `npm run dev`   | Start the dev server     |
| client   | `npm run build` | Production build         |
| client   | `npm start`     | Serve the production build |

## License

This project is open source and available under the [MIT License](LICENSE).
