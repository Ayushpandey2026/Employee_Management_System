# Employee Management System - Server

Express + MongoDB (Mongoose) backend with JWT auth (httpOnly cookie).

## Run

```bash
npm install
cp .env.example .env   # then edit values
npm run dev
```

## Endpoints

| Method | Route                       | Auth |
| ------ | --------------------------- | ---- |
| POST   | /api/auth/register          | no   |
| POST   | /api/auth/login             | no   |
| POST   | /api/auth/logout            | no   |
| GET    | /api/auth/me                | yes  |
| POST   | /api/employees              | yes  |
| GET    | /api/employees              | yes  |
| GET    | /api/employees/departments  | yes  |
| GET    | /api/employees/:id          | yes  |
| PUT    | /api/employees/:id          | yes  |
| DELETE | /api/employees/:id          | yes  |
| GET    | /api/dashboard/stats        | yes  |

`GET /api/employees` query params: `search`, `department`, `status`, `page`, `limit`.
