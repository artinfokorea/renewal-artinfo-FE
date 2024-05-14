import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handleRefreshToken = async (refreshToken: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_REST_API}/sign/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: "11",
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
    signIn: "/",
    signOut: "/auth",
    error: "/auth",
  },
  providers: [
    CredentialsProvider({
      id: "signin-email",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "phone", type: "password" },
      },
      async authorize(credentials) {
        const signInResult = await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/sign-in/by-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "luka5@twosun.com",
              password: "a123456!",
              device: {
                deviceType: "WEB",
              },
            }),
          }
        ).then((res) => res.json());

        if (signInResult.message) {
          throw new Error(signInResult.message);
        }
        return signInResult;
      },
    }),
    CredentialsProvider({
      id: "signup",
      credentials: {
        name: { label: "name", type: "text" },
        phone: { label: "phone", type: "text" },
        smsAuthCode: {
          label: "smsAuthCode",
          type: "password",
          placeholder: "000000",
        },
      },
      async authorize(credentials) {
        //   const signUpResult = await client.mutate({
        //     mutation: SIGNUP_USER,
        //     variables: {
        //       input: {
        //         name: credentials?.name,
        //         phone: credentials?.phone,
        //         smsAuthCode: credentials?.smsAuthCode,
        //       },
        //     },
        //   })
        //   // client.query({ query: CUREENT_USER }).then((res) => console.log(res))

        //   if (signUpResult) {
        //     return {
        //       id: "test_id",
        //       name: "test_name",
        //       email: "test@t.com",
        //       phone: credentials?.phone,
        //       token: signUpResult.data?.registerUser,
        //     }
        //   }

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
    async jwt({ token, user, account }: any) {
      // const res = NextResponse.next()

      if (user?.data) {
        token.accessToken = user?.data.accessToken;
        token.refreshToken = user?.data.refreshToken;
        token.accessTokenExpiresIn = user?.data.accessTokenExpiresIn;
        token.refreshTokenExpiresIn = user?.data.refreshTokenExpiresIn;
      }

      if (new Date() > new Date(token.accessTokenExpiresIn)) {
        const result = await handleRefreshToken(token.refreshToken);
        token.accessToken = result.accessToken;
        token.refreshToken = result.refreshToken;
        token.accessTokenExpiresIn = result.accessTokenExpiresIn;
        token.refreshTokenExpiresIn = result.refreshTokenExpiresIn;
        return token;
      }

      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.token = token;

        const getMe = await fetch(`${process.env.NEXT_PUBLIC_REST_API}/me`, {
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

    async redirect({ url, baseUrl }: any) {
      console.log("baseUrl", baseUrl);
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
