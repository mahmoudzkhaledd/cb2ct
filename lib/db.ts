import { PrismaClient } from "@prisma/client";

function prismaSingleton() {
  return new PrismaClient();
}
let prisma: ReturnType<typeof prismaSingleton>;
declare global {
  var prisma: undefined | ReturnType<typeof prismaSingleton>;
}
if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = prismaSingleton();
  } else {
    if (!global.prisma) {
      global.prisma = prismaSingleton();
    }

    prisma = global.prisma;
  }
}

export { prisma };
