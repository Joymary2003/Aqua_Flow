# Aqua Flow 💧

A premium water tracking and leak detection application built with React, Vite, Express, and Prisma.

## 🚀 Deployment (Vercel + PostgreSQL)

This project is configured for seamless deployment on **Vercel** with a **PostgreSQL** database.

### 1. Database Setup
Create a PostgreSQL database using **Vercel Postgres**, **Supabase**, or **Neon**. Obtain your `DATABASE_URL`.

### 2. Configure Vercel
- Connect your repository to Vercel.
- Add the following **Environment Variables**:
  - `DATABASE_URL`: Your PostgreSQL connection string.
  - `JWT_SECRET`: A secure random string for authentication.

### 3. Initialize Database
Run the following locally using your production `DATABASE_URL`:
```bash
npx prisma db push
```

## 💻 Local Development

### Prerequisites
- Node.js installed.
- A local PostgreSQL instance (or use a development cloud DB).

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update your `.env` file with your local `DATABASE_URL`.
4. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```
5. Run the application:
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack
- **Frontend**: React, Framer Motion, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js (Express) served as Vercel Serverless Functions.
- **Database**: PostgreSQL with Prisma ORM.
- **State Management**: TanStack Query (React Query).
- **Authentication**: JWT & BCrypt.

## ✨ Features
- **Smart Dashboard**: Real-time water usage tracking against daily goals.
- **Advanced Analytics**: Monthly and quarterly trends with consumption breakdown.
- **Leak Detection**: AI-powered monitoring with instant alerts and system health history.
- **Refined Settings**: Personalized units, currency, and notification controls.
