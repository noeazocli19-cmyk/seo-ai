/**
 * Better Auth — Server Configuration
 * Handles: email/password auth, password reset, session management.
 *
 * Env vars required (in .env):
 *   BETTER_AUTH_SECRET="your-secret-key-min-32-chars"  (generate: openssl rand -base64 32)
 *   BETTER_AUTH_URL="http://localhost:3000"
 *   DATABASE_URL="file:./db/custom.db"  (sandbox) OR postgresql://... (Neon)
 *   RESEND_API_KEY="re_xxx"  (optional in dev)
 *
 * Models managed by Better Auth: User, Account, Session, Verification
 */
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

const dbProvider = (process.env.DATABASE_URL || '').startsWith('file:')
  ? 'sqlite'
  : 'postgresql'

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: dbProvider as 'sqlite' | 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET || 'dev-only-secret-change-in-production-xxxxxxxx',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  ],

  // Email & password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // set to true once email verification is wired
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    sendResetPassword: async ({ user, token }) => {
      await sendPasswordResetEmail(user.email, token)
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour (seconds)
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // update session every 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // User configuration
  user: {
    additionalFields: {
      phone: {
        type: 'string',
        required: false,
        input: true,
      },
      plan: {
        type: 'string',
        required: false,
        defaultValue: 'free',
        input: false,
      },
    },
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
    },
  },

  // Rate limiting (basic)
  rateLimit: {
    enabled: true,
    storage: 'memory',
    window: 60, // 60 seconds
    max: 20, // 20 requests per window per IP
  },

  // Advanced security
  advanced: {
    cookiePrefix: 'seo-ai-writer',
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
  },
})

export type Session = typeof auth.$Infer.Session
