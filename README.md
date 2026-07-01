# SA University Management Portal - Client

## Overview

This is the frontend application for the SA University Management Portal, built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React 19 with TypeScript 6.0
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand 5
- **Server State**: TanStack Query 5
- **Forms**: React Hook Form 7
- **Validation**: Zod 4
- **Routing**: React Router 7

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
client/
├── src/
│   ├── app/              # App entry, providers, routing
│   ├── components/       # UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   ├── students/     # Student components
│   │   ├── faculty/      # Faculty components
│   │   ├── courses/      # Course components
│   │   └── finance/      # Finance components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   ├── stores/           # Zustand stores
│   ├── services/         # API service functions
│   ├── types/            # TypeScript interfaces
│   ├── validations/      # Zod schemas
│   └── pages/            # Route pages
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter
- `npm run type-check` - Run TypeScript type checking
