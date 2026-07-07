import { PrismaClient } from '@prisma/client';

// Ein einziger Prisma-Client für den Prozess. Verbindet lazy (erst beim ersten Query),
// darum kann der Server auch ohne erreichbare DB booten und Nicht-DB-Routen bedienen.
export const prisma = new PrismaClient();
