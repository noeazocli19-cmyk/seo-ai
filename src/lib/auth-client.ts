/**
 * Better Auth — Client SDK
 * Use these helpers in client components for sign-in, sign-up, sign-out,
 * session fetching, and password reset flows.
 */
import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  sendVerificationEmail,
} = authClient

/**
 * Get the current session on the server side (Server Components / API routes).
 * Uses the Better Auth server instance from `@/lib/auth`.
 */
export async function getServerSession() {
  try {
    // Lazy import to avoid pulling server code into the client bundle.
    const { auth } = await import('@/lib/auth')
    const { headers } = await import('next/headers')
    const headerList = await headers()
    return await auth.api.getSession({ headers: headerList })
  } catch {
    return null
  }
}
