import { PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient();
};


const prisma = global.prismaGlobal ?? prismaClientSingleton();


if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

export default prisma;
