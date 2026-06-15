# Volunteer Registration System

A Next.js application for collecting volunteer registrations, managing approvals, and generating basic admin reports.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MongoDB Atlas with Mongoose
- JWT auth for the admin dashboard

## Setup

1. Install dependencies.
2. Copy `.env.example` to `.env.local` and fill in the values.
3. Run `npm run dev`.

## Environment variables

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Features

- Public volunteer registration form
- Admin login
- Protected admin dashboard
- Volunteer approval workflow
- CSV report export
