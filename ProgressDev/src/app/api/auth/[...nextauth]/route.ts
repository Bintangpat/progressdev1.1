import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();

          if (res.ok && data.user) {
            return {
              id: data.user.id,
              name: data.user.displayName,
              email: data.user.email,
              role: data.user.role,
              accessToken: data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch("http://localhost:3001/auth/social-login", {
            method: "POST",
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (res.ok && data.access_token) {
            // Attach the NestJS token and role to the user object
            (user as any).accessToken = data.access_token;
            (user as any).role = data.user.role;
            (user as any).id = data.user.id;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Social login sync error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
