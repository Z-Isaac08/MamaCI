import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.js";

// Plus besoin de l'import 'env' problématique
const connectionString = process.env.DATABASE_URL;

// Sécurité au cas où la variable soit manquante
if (!connectionString) {
  throw new Error("DATABASE_URL n'est pas définie dans l'environnement.");
}

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
