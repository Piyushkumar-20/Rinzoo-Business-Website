# Rinzoo Website

A modern full-stack corporate website built for **Rinzoo Detergent Powder**. The project provides a professional online presence with product showcase, distributor inquiries, promotional offers, and an admin dashboard for managing website content.

## Overview

The website is designed to help customers explore Rinzoo products while enabling the company to manage products, offers, and customer inquiries through a secure admin panel.

## Features

### Public Website

- Modern responsive landing page
- Product showcase
- About company section
- Promotional offers
- Distributor inquiry form
- Contact page
- Mobile-friendly design
- SEO-friendly pages

### Admin Dashboard

- Secure authentication
- Dashboard overview
- Product management
- Offer management
- Distributor lead management
- User management
- Content management

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth/Auth.js
- Zod Validation

## Project Structure

```text
.
├── app/
├── components/
├── lib/
├── prisma/
├── public/
├── styles/
├── middleware.ts
└── package.json
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/<your-username>/rinzoo-website.git
```

### Install dependencies

```bash
pnpm install
```

### Configure environment variables

Create a `.env` file and add the required environment variables.

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### Run the development server

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Future Improvements

- Product search
- Blog section
- Image optimization
- Analytics dashboard
- Email notifications
- CMS integration

## Author

**Piyush**
