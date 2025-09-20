import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";


export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [adminClient()],
  fetchOptions: {
    credentials: 'include' // Important pour inclure les cookies
  }
});

export const {
  signIn,
  signUp,
  signOut,
  getSession
} = authClient;

// Export de useSession directement depuis authClient
export const useSession = authClient.useSession;