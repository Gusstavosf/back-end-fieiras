import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function seed() {
    const cabinet = await prisma.cabinet.create({
        data: {
            name: "CTC002",
        },
    })
}

seed().catch(console.error).finally(() => prisma.$disconnect())