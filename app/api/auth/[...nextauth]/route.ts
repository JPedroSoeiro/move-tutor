import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "MoveTutor",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
  const res = await fetch("http://localhost:3001/auth/login", {
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
      accessToken: data.session?.access_token // <--- CONFIRME ESSE CAMINHO
    };
  }
  return null;
}
    })
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.accessToken = (user as any).accessToken;
    }
    return token;
  },
  async session({ session, token }) {
    (session as any).accessToken = token.accessToken; 
    return session;
  }
},
  pages: {
    signIn: '/login',
  }
});

export { handler as GET, handler as POST };