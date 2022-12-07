import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { exclude } from "@/utils/helpers";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  site: process.env.NEXTAUTH_URL,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        let { nickname, password } = credentials;
        let user = await prisma.user.findUnique({
          where: { nickname },
        });
        if (!user) throw new Error("Please check your credentials.");
        let match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Please check your credentials.");
        user = exclude(user, ["password", "role", "createdAt", "updatedAt"]);
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      session.user = token.user;
      session._id = token.user.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token["user"] = user;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
export default NextAuth(authOptions);
