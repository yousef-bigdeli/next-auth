import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectDatabase, getDocument } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        let client, user;

        try {
          client = await connectDatabase();
        } catch (error) {
          console.log(error.message);
          throw new Error("Authentication faliled.");
        }

        try {
          user = await getDocument(client, "users", {
            email: credentials.email,
          });
        } catch (error) {
          console.log(error.message);
          client.close();
          throw new Error("Authentication faliled.");
        }

        if (user.length === 0) {
          client.close();
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user[0].password
        );

        if (!isValid) {
          client.close();
          throw new Error("Password is not correct.");
        }

        client.close();
        return { email: user[0].email };
      },
    }),
  ],
};

export default NextAuth(authOptions);
