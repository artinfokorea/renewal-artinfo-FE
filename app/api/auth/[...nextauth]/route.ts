import { User } from "next-auth"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { cookies } from "next/headers"

const handleRefreshToken = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string
  refreshToken: string
}) => {
  const result = await fetch(`${process.env.REST_API_BASE_URL}/auths/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken,
      refreshToken,
    }),
  })
    .then(res => res.json())
    .catch(error => console.log("refreshToken error", error))

  if (result.item) {
    return {
      accessToken: result.item.accessToken,
      refreshToken: result.item.refreshToken,
      accessTokenExpiresIn: result.item.accessTokenExpiresIn,
      refreshTokenExpiresIn: result.item.refreshTokenExpiresIn,
    }
  }

  return null
}

const handler = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "signin-email",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const response = await fetch(
          `${process.env.REST_API_BASE_URL}/auths/login/email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        )

        const result = await response.json()

        if (result.item) {
          return {
            id: "",
            accessToken: result.item.accessToken,
            refreshToken: result.item.refreshToken,
            accessTokenExpiresIn: result.item.accessTokenExpiresIn,
            refreshTokenExpiresIn: result.item.refreshTokenExpiresIn,
          }
        }
        return null
      },
    }),
    CredentialsProvider({
      id: "sns",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        type: { label: "SNS Type", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.accessToken || !credentials.type) {
          return null
        }

        try {
          const response = await fetch(
            `${process.env.REST_API_BASE_URL}/auths/login/sns`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: credentials.type,
                token: credentials.accessToken,
              }),
            },
          )

          if (!response.ok) {
            throw new Error("Network response was not ok")
          }

          const result = await response.json()

          if (result.item) {
            return {
              id: "",
              accessToken: result.item.accessToken,
              refreshToken: result.item.refreshToken,
              accessTokenExpiresIn: result.item.accessTokenExpiresIn,
              refreshTokenExpiresIn: result.item.refreshTokenExpiresIn,
            }
          } else {
            console.error("Unexpected API response structure:", result)
            return null
          }
        } catch (error) {
          console.error("SNS sign-in error", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: User }) {
      if (user) {
        cookies().set({
          name: "accessToken",
          value: user.accessToken,
          httpOnly: true,
          path: "/",
          expires: new Date(user.accessTokenExpiresIn),
        })
        token.accessToken = user?.accessToken
        token.refreshToken = user?.refreshToken
        token.accessTokenExpiresIn = user?.accessTokenExpiresIn
        token.refreshTokenExpiresIn = user?.refreshTokenExpiresIn
      }

      if (new Date() > new Date(token.accessTokenExpiresIn)) {
        const result = await handleRefreshToken({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        })

        if (result) {
          token.accessToken = result.accessToken
          token.refreshToken = result.refreshToken
          token.accessTokenExpiresIn = result.accessTokenExpiresIn
          token.refreshTokenExpiresIn = result.refreshTokenExpiresIn
        }

        return token
      }

      return token
    },

    async session({ session, token }: any) {
      session.token = token

      return session
    },
  },
})

export { handler as GET, handler as POST }
