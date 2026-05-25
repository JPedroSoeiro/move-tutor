import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type JWT } from "next-auth/jwt";

interface User {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

interface CustomSession extends Session {
  accessToken?: string;
}

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "MoveTutor",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        if (res.ok && data.user) {
          return {
            id: data.user.id,
            name: data.user.full_name,
            email: data.user.email,
            accessToken: data.session?.access_token
          } as User;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as User).accessToken;
      }
      return token;
    },
    async session({ session, token }): Promise<CustomSession> {
      return {
        ...session,
        accessToken: token.accessToken as string
      };
    }
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };