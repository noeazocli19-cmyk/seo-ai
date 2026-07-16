/**
 * Better Auth — Catch-all API Route Handler
 * All auth endpoints are served under /api/auth/*
 * (sign-in, sign-up, sign-out, forgot-password, reset-password, session, etc.)
 */
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
