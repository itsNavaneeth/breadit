import { getServerSession, NextAuthOptions } from "next-auth";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";

async function generateUniqueUsername(name?: string | null) {
  if (!name) {
    return nanoid(10);
  }
  // Convert name to lowercase and remove spaces
  let baseUsername = name.toLowerCase().replace(/\s+/g, "");

  let username = baseUsername;
  let userExists = await db.user.findFirst({
    where: { username },
  });

  let counter = 1;

  // If the username exists, keep modifying it until we find a unique one
  while (userExists) {
    username = `${baseUsername}${counter}`;
    userExists = await db.user.findFirst({
      where: { username },
    });
    counter++;
  }

  return username;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      if (!dbUser.username) {
        // Generate a unique username based on their name
        // dummy commit
        const uniqueUsername = await generateUniqueUsername(user.name);

        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            username: uniqueUsername,
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
