# 🧠 Bitespeed Backend Task – Identity Reconciliation

This is a solution to the [Bitespeed Backend Task](https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-1fb21bb2a930802eb896d4409460375c) where we implement a customer identity reconciliation service.

## 📌 Problem Statement

FluxKart.com collects customer data (email/phone) for personalization. A single customer may use multiple contact details. We solve this by linking related contacts (based on email/phone) and returning a unified view using the `/identify` API.

---

## 🚀 Live API

**POST** `/api/identify`  
👉 Hosted on: [https://bitespeed-backend-vfom.onrender.com](https://bitespeed-backend-vfom.onrender.com)

> Replace with actual deployed link

---

## 📬 Sample Request

```http
POST /api/identify
Content-Type: application/json

{
  "email": "doc@brown.com",
  "phoneNumber": "1234567890"
}
```

### Sample cURL

```bash
curl -X POST https://bitespeed-backend-vfom.onrender.com/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc@brown.com", "phoneNumber": "1234567890"}'
```

---

## 📦 Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (or SQLite for dev)
- Deployed via [Render](https://render.com/)

---

## 🛠️ Running Locally

```bash
git clone https://github.com/imankii01/bitespeed-backend
cd bitespeed-backend

# Install dependencies
npm install

# Set up .env file
cp .env.example .env
# Add your DATABASE_URL to .env

# Run Prisma migrations
npx prisma migrate dev --name init

# Start dev server
npm run dev
```

---

## ✅ Features

- 🔗 Links multiple contact records by email or phone
- 📌 Ensures oldest record is treated as `primary`
- 🔁 Returns unified contact info with all linked records

---

## 🧪 Testing

You can use Postman, Thunder Client, or `curl` to hit the `/api/identify` endpoint with various inputs and observe how it manages linked contacts.

---

## 📁 Folder Structure

```
.
├── prisma/                 # Prisma DB schema
├── src/
│   ├── controllers/        # Business logic
│   ├── routes/             # API Routes
│   ├── app.ts              # Express setup
│   ├── server.ts           # Server setup
│   └── prismaClient.ts     # Prisma client setup
├── .env.example            # Example .env file
├── .env                    # DB credentials
├── package.json
└── tsconfig.json
```
