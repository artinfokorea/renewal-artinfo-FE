import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface User {
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: Date
    refreshTokenExpiresIn: Date
  }
}
