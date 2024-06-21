import { DetailApiResponse } from '@/interface';
import { USER } from '@/types/users';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-in',
    error: '/auth/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'signin-email',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        const signInResult = await fetch(
          `${process.env.REST_API_BASE_URL}/auths/login/email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        )
          .then((res) => res.json())
          .catch((error) => console.log('signIn error', error));
        if (signInResult.item) {
          return {
            accessToken: signInResult.item.accessToken,
            refreshToken: signInResult.item.refreshToken,
            accessTokenExpiresIn: signInResult.item.accessTokenExpiresIn,
            refreshTokenExpiresIn: signInResult.item.refreshTokenExpiresIn,
          };
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: 'signup',
      credentials: {
        name: { label: 'name', type: 'text' },
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        const signUpResult = await fetch(
          `${process.env.REST_API_BASE_URL}/auths/sign-up`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              name: credentials?.name,
              clinicId: 1,
            }),
          }
        )
          .then((res) => res.json())
          .catch((error) => console.log('signUp error', error));
        if (signUpResult.data) {
          return {
            accessToken: signUpResult.data.accessToken.token,
            refreshToken: signUpResult.data.refreshToken.token,
            accessTokenExpiresIn: signUpResult.data.accessToken.expiresIn,
            refreshTokenExpiresIn: signUpResult.data.refreshToken.expiresIn,
          };
        }

        return null;
      },
    }),
    CredentialsProvider({
      id: 'sns',
      credentials: {
        name: { label: 'name', type: 'text' },
        phone: { label: 'phone', type: 'text' },
        smsAuthCode: {
          label: 'smsAuthCode',
          type: 'password',
          placeholder: '000000',
        },
      },
      async authorize({ accessToken, snsType }: any) {
        const verifySns = await fetch(
          `${process.env.NEXT_PUBLIC_REST_API}/verification/sns/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              snsType,
              accessToken: accessToken,
              deviceType: 'WEB',
              idToken: '',
            }),
          }
        )
          .then((res) => res.json())
          .catch((e) => console.log('e', e));

        if (verifySns.data) {
          const snsSignIn = await fetch(
            `${process.env.NEXT_PUBLIC_REST_API}/sign-in/by-sns`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                snsVerifiedToken: verifySns.data.snsVerifiedToken,
                device: {
                  deviceType: 'WEB',
                },
              }),
            }
          )
            .then((res) => res.json())
            .catch((e) => console.log('e', e));

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

      // if (new Date() > new Date(token.accessTokenExpiresIn)) {
      //   const result = await handleRefreshToken({
      //     accessToken: token.accessToken,
      //     refreshToken: token.refreshToken,
      //   });

      //   if (result) {
      //     token.accessToken = result.token;
      //     token.accessTokenExpiresIn = result.expiresIn;
      //   }

      //   return token;
      // }

      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.token = token;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
