## 💻 Local Development

### Prerequisites
- Node.js installed.
- **SQLite** is used by default for local development (no setup required).

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your `.env` file looks like this for local dev:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_secret_here"
   ```
4. Initialize the local database:
   ```bash
   npx prisma db push
   ```
5. Run the application:
   ```bash
   npm run dev
   ```

## 🚀 Ready for Vercel Deployment?

When you are ready to push to production, follow these steps to switch to PostgreSQL:

1. **Change Provider**: In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
2. **Setup Vercel**: Connect your repo to Vercel and add your `DATABASE_URL` (PostgreSQL) and `JWT_SECRET` in the dashboard.
3. **Deploy**: Vercel will handle the rest!


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
