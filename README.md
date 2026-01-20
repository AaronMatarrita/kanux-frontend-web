# KÁNUX Frontend Web

A Next.js 14 application using the App Router for the KÁNUX platform.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Route Groups** for organizing routes (public, company, talent)
- **HTTP Client** with JWT authentication support
- **Modular Architecture** with clear separation of concerns

## Project Structure

```
kanux-frontend-web/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (accessible without auth)
│   ├── (company)/         # Company-specific routes
│   ├── (talent)/          # Talent-specific routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Reusable UI components
├── guards/               # Route guards and authentication logic
├── layouts/              # Layout components
├── modules/              # Feature modules
├── services/             # API services
│   └── httpClient.ts    # HTTP client with JWT support
├── store/                # State management
└── .env.example          # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AaronMatarrita/kanux-frontend-web.git
cd kanux-frontend-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure your environment variables.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_JWT_SECRET=your-secret-key-here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## HTTP Client Usage

The application includes an HTTP client with JWT authentication support:

```typescript
import { httpClient } from '@/services'

// GET request
const response = await httpClient.get('/endpoint')

// POST request
const response = await httpClient.post('/endpoint', { data })

// The client automatically adds JWT token from localStorage
// and handles 401 unauthorized responses
```

## Route Groups

The application uses Next.js route groups for organization:

- **(public)**: Publicly accessible routes (login, register, etc.)
- **(company)**: Company-specific authenticated routes
- **(talent)**: Talent-specific authenticated routes

## License

Private - All rights reserved