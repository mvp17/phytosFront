import { signToken } from '@/app/utils/signToken'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

interface IPropsSession {
  session: any,
  token: any
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: IPropsSession) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      session.user.id = token.id
      session.jwtToken = token.loggedUser
      
      return session
    },
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.loggedUser = await signToken(user?.id as string);
      }
      return token
    }
  }
})

export { handler as GET, handler as POST };
