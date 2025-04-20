import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, { provider: "postgresql" }),
});

export const authClient = createAuthClient({
  //you can pass client configuration here
});
