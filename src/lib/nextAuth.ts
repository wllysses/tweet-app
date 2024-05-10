import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import { prismaClient } from "./prisma";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = { ...session.user, id: user.id };
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
