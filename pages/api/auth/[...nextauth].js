import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { exclude } from "../../../utils/helpers";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
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
        let match = await bcrypt.compare(password, user.password);
        if (!user || !match) throw new Error("Please check your credentials.");
        user = exclude(user, ["password", "role", "createdAt", "updatedAt"]);
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};
export default NextAuth(authOptions);
