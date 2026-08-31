# Centralized Research Equipment Portal - Deployment Guide

This guide provides step-by-step instructions to deploy the **Centralized Research Equipment Portal** (comprising a React/Vite frontend and an Express/TypeScript backend) permanently to the web for free.

---

## Prerequisites
Before you start, make sure you have:
1. A **GitHub** account.
2. A **Vercel** or **Netlify** account (for hosting the frontend).
3. A **Render** account (for hosting the backend and database).
4. **Git** installed on your local machine.

---

## Step 1: Push Your Code to GitHub

1. Open your terminal at the root of the project (`c:\college\college project`).
2. Initialize Git (if not already done) and commit your changes:
   ```bash
   git init
   git add .
   git commit -m "Configure project for deployment"
   ```
3. Create a new **public or private** repository on GitHub.
4. Link your local project to your GitHub repository and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Step 2: Deploy the Backend to Render

Render will host the Node.js Express backend. Since we created a `render.yaml` file, you can deploy using a **Blueprint** or set it up manually.

### Option A: Deploy using Blueprint (Recommended & Fast)
1. Go to your **Render Dashboard** and click **New** > **Blueprint**.
2. Connect your GitHub account and select your repository.
3. Render will read `render.yaml` and configure everything automatically.
4. You will see a list of services to create. Click **Apply**.
5. Render will automatically:
   * Build the project.
   * Initialize the Prisma client.
   * Push the schema to the database.
   * Run the seed script to populate default data.
6. Once the build is complete, Render will give you a public URL (e.g., `https://smart-campus-backend.onrender.com`). **Save this URL!**

### Option B: Deploy Manually
If you prefer to configure it manually on Render:
1. Click **New** > **Web Service**.
2. Select your GitHub repository.
3. Set the following details:
   * **Name**: `smart-campus-backend`
   * **Root Directory**: `backend`
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build && npx prisma db push && npx prisma db seed`
   * **Start Command**: `npm run start`
4. Add the following **Environment Variables** in the "Environment" tab:
   * `NODE_ENV`: `production`
   * `PORT`: `5000`
   * `DATABASE_URL`: `file:./dev.db`
   * `JWT_SECRET`: `your_super_secret_jwt_key` (make it a long random string)
   * `CLIENT_URL`: Point to your frontend URL (you can update this after deploying the frontend).

---

## Step 3: Deploy the Frontend to Vercel

Vercel is the best platform for hosting Vite-based React applications.

1. Go to the **Vercel Dashboard** and click **Add New** > **Project**.
2. Select your GitHub repository.
3. Vercel will automatically detect `vercel.json` at the root and apply the correct build settings:
   * **Build Command**: `cd frontend && npm install && npm run build`
   * **Output Directory**: `frontend/dist`
4. Open the **Environment Variables** dropdown and add:
   * **Key**: `VITE_API_BASE_URL`
   * **Value**: Your Render Backend URL + `/api` (e.g., `https://smart-campus-backend.onrender.com/api`)
5. Click **Deploy**.
6. Vercel will build the frontend and provide you with a public URL (e.g., `https://centralized-research-portal.vercel.app`). **Save this URL!**

---

## Step 4: Link Frontend and Backend (CORS Configuration)

To make sure the backend accepts login and booking requests from your new Vercel website:

1. Go to your **Render Dashboard** for the `smart-campus-backend` service.
2. Navigate to the **Environment** tab.
3. Edit the `CLIENT_URL` environment variable:
   * **Old Value**: `https://rd-resource-sharing-portal.netlify.app`
   * **New Value**: Your Vercel frontend URL (e.g., `https://centralized-research-portal.vercel.app`)
4. Save the changes. Render will automatically redeploy the backend with the updated configuration.

---

## Database Management & Persistence (SQLite vs PostgreSQL)

### Ephemeral SQLite (Default)
By default, the backend uses a file-based SQLite database (`file:./dev.db`).
* **Important**: Render's free tier has an ephemeral disk. This means any bookings, issues, or new registrations created by users will be reset back to default seed data when the backend service restarts or sleeps (which happens automatically after 15 minutes of inactivity).
* **Demo-friendly**: This is actually ideal for project evaluations/demos since the database resets to a clean, seeded state automatically.

### Switching to Persistent PostgreSQL (Optional)
If you want database entries to persist permanently, follow these steps to use a PostgreSQL database:
1. Create a free PostgreSQL database on Render (click **New** > **PostgreSQL**) or Supabase/Neon.
2. Copy the database **Connection URI/String**.
3. In `backend/prisma/schema.prisma`, change the database provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Push your schema changes to GitHub.
5. In your backend Render service environment variables, update `DATABASE_URL` with your new PostgreSQL Connection String.
6. Trigger a deploy on Render. The server will run the schema migrations and seed the data onto the cloud PostgreSQL instance.

---

## Default Login Credentials (Seeded Data)

Once the application is deployed, you can log in with these pre-seeded accounts:

| Role | Email / Register No | Password | Description |
|---|---|---|---|
| **Admin** | `admin@smartcampus.edu` | `Admin@123` | Full access to labs, equipment, users and bookings |
| **Admin (ECE)** | `gopinath.ece@karpagamtech.ac.in` | `gopinathece9566` | ECE specific admin console |
| **Faculty/Staff** | `stf001` or `stf002` (Employee ID) | `Staff@123` | Lab in-charge, approve bookings, resolve issues |
| **Student** | `24ita17` (Register No) | `Student@123` | Default student dashboard |
| **Student** | `23cse001` (Register No) | `Student@123` | Default student dashboard |
