import { PrismaClient } from "@prisma/client";

import { RoleSeeder } from "./roles.seeder";
import { UserSeeder } from "./users.seeder";

const prisma = new PrismaClient();

async function main() {
    await RoleSeeder();
    await UserSeeder();
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
