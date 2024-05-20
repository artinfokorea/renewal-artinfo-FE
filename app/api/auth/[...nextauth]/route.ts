import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handleRefreshToken = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  try {
    const res = await fetch(
      `${process.env.REST_API_BASE_URL}/auths/refresh/access-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
      }
    ).then((res) => res.json());
    console.log("res", res);
    if (!res.success && res.code) {
      throw new Error(res.code);
    }

    return res.data;
  } catch (error) {
    console.log("error", error);
  }
};

const handler = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "signin-email",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "phone", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        const signInResult = await fetch(
          `${process.env.REST_API_BASE_URL}/auths/sign-in`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              deviceType: "TABLET",
            }),
          }
        ).then((res) => res.json());
        console.log("signInResult.data", signInResult.data);
        if (signInResult.data) {
          return {
            accessToken: signInResult.data.accessToken.token,
            refreshToken: signInResult.data.refreshToken.token,
            accessTokenExpiresIn: signInResult.data.accessToken.expiresIn,
            refreshTokenExpiresIn: signInResult.data.refreshToken.expiresIn,
          };
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "signup",
      credentials: {
        name: { label: "name", type: "text" },
        phone: { label: "phone", type: "text" },
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        const signUpResult = await fetch(
          `${process.env.REST_API_BASE_URL}/auths/sign-up`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              name: credentials?.name,
              phone: credentials?.phone,
              deviceType: "TABLET",
              clinicId: 1,
            }),
          }
        ).then((res) => res.json());
        console.log("signUpResult", signUpResult);
        if (signUpResult) {
          return {
            accessToken: signUpResult.accessToken.token,
            refreshToken: signUpResult.refreshToken.token,
            accessTokenExpiresIn: signUpResult.accessToken.expiresIn,
            refreshTokenExpiresIn: signUpResult.refreshToken.expiresIn,
          };
        }

        return null;
      },
    }),
    CredentialsProvider({
      id: "sns",
      credentials: {
        name: { label: "name", type: "text" },
        phone: { label: "phone", type: "text" },
        smsAuthCode: {
          label: "smsAuthCode",
          type: "password",
          placeholder: "000000",
        },
      },
      async authorize({ accessToken, snsType }: any) {
        const verifySns = await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/verification/sns/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              snsType,
              accessToken: accessToken,
              deviceType: "WEB",
              idToken: "",
            }),
          }
        )
          .then((res) => res.json())
          .catch((e) => console.log("e", e));

        if (verifySns.data) {
          const snsSignIn = await fetch(
            `${process.env.NEXT_PUBLIC_REST_API}/sign-in/by-sns`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                snsVerifiedToken: verifySns.data.snsVerifiedToken,
                device: {
                  deviceType: "WEB",
                },
              }),
            }
          )
            .then((res) => res.json())
            .catch((e) => console.log("e", e));

          return snsSignIn;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user?.accessToken;
        token.refreshToken = user?.refreshToken;
        token.accessTokenExpiresIn = user?.accessTokenExpiresIn;
        token.refreshTokenExpiresIn = user?.refreshTokenExpiresIn;
      }

      if (
        token.accessTokenExpiresIn &&
        new Date() > new Date(token.accessTokenExpiresIn)
      ) {
        const result = await handleRefreshToken(token.refreshToken);
        token.accessToken = result.accessToken;
        token.accessTokenExpiresIn = result.accessTokenExpiresIn;
        return token;
      }

      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.token = token;

        const getMe = await fetch(`${process.env.REST_API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
        }).then((res) => res.json());

        session.user = getMe.data;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
