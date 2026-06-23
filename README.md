# PropConnect - Property Sales Platform

PropConnect is a modern, full-stack real estate platform built with Next.js, allowing administrators to manage property listings, capture leads, and provide a seamless property search experience for users. 

## 🚀 Features

- **Property Listings**: Browse residential and commercial properties with advanced filtering options (property type, possession, pricing).
- **Locality-based Discovery**: Dedicated pages to explore properties in specific localities (e.g., Mumbai, Navi Mumbai, Thane).
- **Lead Generation**: Capture leads via custom forms, direct WhatsApp integration, and call-to-actions.
- **Admin Dashboard**: Secure administrative portal to manage properties, view/track leads, and update content.
- **SEO Optimized**: Server-Side Rendering (SSR) and dynamic metadata generation for improved search engine visibility.
- **Responsive Design**: Mobile-first, fully responsive UI built with Tailwind CSS.

## 🛠 Tech Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/) (Headless Components)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js (v5)](https://nextauth.js.org/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Media Storage**: Cloudflare R2 (S3 Compatible)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets (images, fonts, etc.)
├── src/
│   ├── app/            # Next.js App Router (Pages, Layouts, API routes)
│   │   ├── admin/      # Admin dashboard routes
│   │   ├── contact/    # Contact page
│   │   ├── localities/ # Locality specific pages
│   │   └── properties/ # Property listing and detail pages
│   ├── components/     # Reusable React components (UI, Forms, Cards)
│   ├── lib/            # Utility functions, Prisma client, and helpers
│   └── proxy.ts        # Edge middleware for route protection
├── .env.local          # Local environment variables
└── next.config.ts      # Next.js configuration
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL Database
- Cloudflare R2 Account (for image uploads)

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd property-sales-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Copy `.env.example` to `.env.local` (or create it) and configure the variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/property_sales_db"

   # Auth.js
   AUTH_SECRET="your-secret-key"
   AUTH_URL="http://localhost:3000"

   # Cloudflare R2
   R2_ACCOUNT_ID="your-r2-account-id"
   R2_ACCESS_KEY_ID="your-r2-access-key-id"
   R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
   R2_BUCKET_NAME="property-sales-media"
   NEXT_PUBLIC_R2_PUBLIC_URL="https://pub-xxxx.r2.dev"

   # Contact Details
   NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
   NEXT_PUBLIC_CONTACT_PHONE="+91 98765 43210"
   NEXT_PUBLIC_CONTACT_EMAIL="info@yourdomain.com"
   ```

4. **Initialize the Database**:
   Push the Prisma schema to your PostgreSQL database.
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase using ESLint.

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2. Import your project into Vercel.
3. Configure your Environment Variables in the Vercel dashboard.
4. Deploy!

For the database, you can use managed PostgreSQL services like Supabase, Neon, or Vercel Postgres.
