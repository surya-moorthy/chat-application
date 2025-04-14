

// packages/db/src/index.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = {
  prisma
};
