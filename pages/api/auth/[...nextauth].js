import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { exclude } from "../../../utils/helpers";

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
        let { email, password } = credentials;
        let user = await prisma.user.findFirst({
          where: {
            email: email,
          },
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
    async session({ session }) {
      let sessionUser = await prisma.user.findFirst({
        where: {
          email: session.email,
        },
      });
      session._id = sessionUser.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
export default NextAuth(authOptions);
