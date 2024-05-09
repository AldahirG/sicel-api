import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export async function UserSeeder() {
    const hashedPassword = await bcrypt.hash("password", 10);

    const data = [
        {
            name: "Ximena",
            email: "admin@example.com",
            paternalSurname: 'Martínez',
            password: hashedPassword
        }
    ]
    const users = await prisma.user.createMany({
        data
    })
}