# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Art Info Korea (아트인포코리아) - A platform connecting classical music professionals with job opportunities, lessons, performances, and art-related content. Built with Next.js 14 App Router.

Website: https://artinfokorea.com

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run Jest tests
pnpm test:watch   # Run tests in watch mode
```

## Architecture

### Directory Structure

- `app/` - Next.js 14 App Router with route groups:
  - `(site)/` - Public routes (home, jobs, lessons, news, performances, posts)
  - `(auth)/` - Authentication routes (sign-in, sign-up)
  - `(private)/` - Protected routes requiring auth (my-profile, my-activities)
- `components/` - React components organized by feature
- `services/` - API service layer with axios instances
- `lib/` - Utilities, query definitions, auth config
- `hooks/` - Custom React hooks
- `interface/` - TypeScript interfaces for API requests
- `types/` - TypeScript type definitions

### Data Fetching Pattern

Uses TanStack Query with `@lukemorales/query-key-factory` for type-safe query keys:

```typescript
import { queries } from "@/lib/queries"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"

// Client-side
const { data } = useQuery(queries.jobs.detail(jobId))
const { data, fetchNextPage } = useInfiniteQuery(queries.jobs.infiniteList(filters))

// Server-side (RSC)
import { GetQueryClient } from "@/lib/GetQueryClient"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"

const queryClient = GetQueryClient()
await queryClient.prefetchQuery(queries.jobs.list(filters))
// Then wrap client component with HydrationBoundary
```

### API Layer

Two axios instances in `services/index.ts`:
- `publicApiRequest` - Unauthenticated requests
- `authApiRequest` - Authenticated requests with auto Bearer token injection

Service files follow the pattern:
```typescript
// services/jobs.ts
export const getJob = (id: number) => publicApiRequest.get<Job>(`/jobs/${id}`)
export const createJob = (data: CreateJobRequest) => authApiRequest.post<Job>("/jobs", data)
```

### Authentication

NextAuth.js with JWT strategy:
- Credentials provider (email/password)
- SNS providers (Kakao, Naver)
- Protected routes: `/my-profile/*`, `/my-activities/*`, `/*/create`
- Token auto-refresh on expiration
- 401 responses redirect to `/auth/sign-in`

### Styling

- Tailwind CSS with Material Tailwind components
- shadcn/ui components in `components/ui/`
- Custom colors: `main` (#0064FF), `error` (#EA2A2A), `green` (#449F3C)
- Mobile-first responsive design with `useBreakPoint` hook

### Form Handling

React Hook Form with Yup validation:
```typescript
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { signUpSchema } from "@/lib/schemas"

const { register, handleSubmit } = useForm({
  resolver: yupResolver(signUpSchema)
})
```

## Key Patterns

### Adding a New Feature Page

1. Create route in `app/(site)/feature-name/page.tsx`
2. Add service functions in `services/feature-name.ts`
3. Define query keys in `lib/queries.ts`
4. Create components in `components/feature-name/`
5. Add TypeScript types in `types/feature-name.ts` and request interfaces in `interface/feature-name.ts`

### Infinite Scroll Lists

Most list pages use `useInfiniteQuery` with page-based pagination:
```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  ...queries.jobs.infiniteList(filters),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.page + 1 : undefined
})
```

### URL-based Filtering

Filter state is managed via URL search params for shareable/bookmarkable URLs. Mobile and desktop have separate filter UIs but share the same URL state.
