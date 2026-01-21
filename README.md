# Kanux Frontend Web

Frontend web application for the Kanux platform, built with Next.js 16, React 19 and TypeScript.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Code Conventions](#code-conventions)
- [Available Scripts](#available-scripts)
- [Technologies](#technologies)

## Prerequisites

Before starting, make sure you have installed:

- **Node.js** >= 20.x
- **npm** >= 10.x or **yarn** >= 1.22.x
- **Git**

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/kanux-frontend-web.git
cd kanux-frontend-web
```

### 2. Navigate to the project directory

```bash
cd kanux-web
```

### 3. Install dependencies

```bash
npm install
# or
yarn install
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root of the `kanux-web/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.kanux.com
NEXT_PUBLIC_API_VERSION=v1

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=auth.kanux.com

# Environment
NODE_ENV=development
```

> **Note**: Variables starting with `NEXT_PUBLIC_` will be available on the client side.

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

### Linter

```bash
npm run lint
```

## Project Structure

```
kanux-web/
├── public/                      # Static files
├── src/                         # Source code
│   ├── app/                     # Next.js routes directory (App Router)
│   │   ├── (public)/           # Public routes (no authentication)
│   │   ├── company/            # Company routes
│   │   ├── talent/             # Talent routes
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Main layout
│   │   └── page.tsx            # Home page
│   │
│   ├── components/             # Reusable components
│   │   └── index.ts            # Component barrel exports
│   │
│   ├── config/                 # Application configurations
│   │
│   ├── guards/                 # Authentication and authorization guards
│   │
│   ├── modules/                # Application modules
│   │   ├── auth/               # Authentication module
│   │   ├── challenges/         # Challenges module
│   │   ├── company/            # Company module
│   │   ├── messages/           # Messaging module
│   │   ├── onboarding/         # Onboarding module
│   │   │   ├── company/        # Company onboarding
│   │   │   └── talent/         # Talent onboarding
│   │   ├── subscriptions/      # Subscriptions module
│   │   ├── talent/             # Talent module
│   │   └── index.ts            # Module barrel exports
│   │
│   ├── services/               # API services
│   │   ├── auth.service.ts
│   │   ├── challenges.service.ts
│   │   ├── companies.service.ts
│   │   ├── messages.service.ts
│   │   ├── profiles.service.ts
│   │   ├── subscriptions.service.ts
│   │   └── index.ts
│   │
│   ├── store/                  # Global state (Zustand/Redux)
│   │   ├── auth.store.ts       # Authentication store
│   │   ├── plan.store.ts       # Plans store
│   │   ├── user.store.ts       # User store
│   │   └── index.ts
│   │
│   └── utils/                  # Utilities and helpers
│
├── .eslintrc.json              # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Architecture

### Module Organization

The project follows a modular architecture where each module represents a specific functionality of the application:

#### **`/app`** - Routing and Pages

- Uses Next.js 16 **App Router**
- Organized by functionality (company, talent, public)
- Each folder contains its own pages and layouts

#### **`/components`** - Reusable Components

- Shared UI components across the application
- "Dumb" components without business logic
- Exported through `index.ts` for easier imports

#### **`/modules`** - Business Modules

- Each module contains:
  - Module-specific components
  - Custom hooks
  - Types and interfaces
  - Business logic
- **Examples**: auth, challenges, company, talent, onboarding

#### **`/services`** - Service Layer

- Communication with external APIs
- Centralized HTTP calls
- Error handling and data transformation
- One service per entity/domain

#### **`/store`** - Global State Management

- Shared state between components
- Implemented with Zustand/Redux (as appropriate)
- Stores separated by domain (auth, user, plan)

#### **`/guards`** - Route Protection

- Authentication middleware
- Permission verification
- Conditional redirects

#### **`/config`** - Configurations

- Application constants
- Third-party configurations
- Typed environment variables

#### **`/utils`** - Utilities

- Helper functions
- Validators
- Formatters
- Date, text helpers, etc.

### Data Flow

```
User → Page (app/) → Module → Service → API
                 ↓
              Store (global state)
                 ↓
          Components (UI)
```

## Code Conventions

### Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Utility files**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces/Types**: PascalCase with `I` or `T` prefix (`IUser`, `TUserRole`)

### Imports

```typescript
// 1. External libraries
import React from "react";
import { useRouter } from "next/navigation";

// 2. Services
import { authService } from "@/services";

// 3. Store
import { useAuthStore } from "@/store";

// 4. Components
import { Button, Input } from "@/components";

// 5. Types
import type { IUser } from "@/types";

// 6. Styles
import styles from "./Component.module.css";
```

## Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server          |
| `npm run lint`  | Run ESLint linter                    |

## Technologies

### Core

- **[Next.js 16](https://nextjs.org/)** - React Framework
- **[React 19](https://react.dev/)** - UI Library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Static typing

### Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - CSS Framework
- **[PostCSS](https://postcss.org/)** - CSS Processor

### Development

- **[ESLint](https://eslint.org/)** - Code linter
- **[React Compiler](https://react.dev/learn/react-compiler)** - React optimization
