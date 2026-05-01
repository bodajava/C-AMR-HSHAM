# Fitness Coach Platform — C-AMR-HSHAM

## Project Overview

A full-stack Fitness Coach Platform where a coach manages clients, workout plans, nutrition plans, and subscriptions online. Clients can browse, subscribe, and track their progress.

---

## Design Rule (Single Source of Truth)

All UI/UX must strictly follow the Google Stitch project **C-AMR-HSHAM**.

* Do NOT define or override any UI design decisions in code.
* Do NOT specify colors, spacing, typography, layout, shadows, or visual styling in documentation or implementation notes.
* All visual and interaction design must be taken directly from Google Stitch.
* If a component/state is missing in Stitch, follow the closest existing Stitch pattern.

---

## Tech Stack

### Frontend

* React ^18
* Vite ^5
* react-router-dom ^6
* Axios
* TanStack Query (React Query)
* React Hook Form ^7
* Zod ^3
* JWT Decode ^4
* Tailwind CSS
* clsx
* tailwind-merge
* class-variance-authority
* shadcn/ui (as base components only)
* Radix UI
* Lucide React / React Icons
* GSAP ^3 (+ @gsap/react)
* Motion ^11 (Framer Motion)
* Lenis (smooth scroll)
* OGL (WebGL effects)

---

### Backend

* Node.js + Express ^4
* MongoDB + Mongoose ^8
* Redis ^4
* JWT (jsonwebtoken ^9)
* bcrypt ^5
* Google Auth Library ^9
* Multer ^1
* AWS S3 SDK (^3)
* Nodemailer ^6
* Zod ^3
* Firebase Admin ^12

---

### Infrastructure

* MongoDB (primary database)
* Redis (caching, sessions, rate limiting, OTP)
* AWS S3 (file storage for all media assets)

---

## Architecture Rules

* Frontend uses Next.js App Router architecture.
* Backend is a REST API built with Express.
* TypeScript is required across frontend and backend.
* All API requests must be validated using Zod.
* Authentication handled via NextAuth + JWT.
* Redis used for caching all public GET endpoints and temporary data.
* AWS S3 is the only storage solution for uploaded files.

---

## Project Structure

```
frontend/
  app/
  components/
  lib/
  styles/

backend/
  src/
    config/
    models/
    routes/
    controllers/
    middleware/
    utils/
```

---

## Pages & Features

### Public Website

* Home page
* Workouts listing + detail
* Nutrition listing + detail
* Pricing page
* Contact page

### Authentication

* Login
* Register
* Google OAuth support

### Dashboard (Coach)

* Overview dashboard
* Clients management
* Workout plans management
* Nutrition plans management
* Subscriptions management
* Messages system

---

## API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login
* POST /api/auth/google
* POST /api/auth/logout

### Clients

* CRUD /api/clients

### Workouts

* CRUD /api/workouts

### Nutrition

* CRUD /api/nutrition

### Subscriptions

* CRUD /api/subscriptions

### Pricing

* CRUD /api/pricing

### Messages

* GET /api/messages
* POST /api/messages

### Upload

* POST /api/upload/image (S3)

---

## Environment Variables

Frontend and backend must use environment variables for:

* API URLs
* Auth secrets
* Database connections
* Redis connection
* AWS credentials
* Email SMTP
* Firebase config

---

## Core Engineering Rules

1. Google Stitch is the **only source of UI design**.
2. No manual UI styling decisions in code or documentation.
3. Full TypeScript usage required.
4. Zod validation required on all inputs.
5. Redis used for caching and performance optimization.
6. All media handled via AWS S3.
7. GSAP for scroll/advanced animations.
8. Motion for micro-interactions.
9. Lenis only for public pages.
10. Clean separation between frontend and backend.
