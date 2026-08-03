import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };
const databaseUrl = process.env.DATABASE_URL?.trim() || "";
const hasValidDatabaseUrl = Boolean(databaseUrl) && !databaseUrl.includes("SENSITIVE") && !databaseUrl.includes("YOUR_DATABASE_URL");

export const prisma = hasValidDatabaseUrl
  ? (globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      }))
  : null;

if (process.env.NODE_ENV !== "production" && prisma) globalForPrisma.prisma = prisma;
