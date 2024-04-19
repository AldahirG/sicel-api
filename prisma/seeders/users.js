import { prisma } from "../../src/db.js";
import bcrypt from "bcrypt";

export async function users() {
  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.user.create({
    data: {
      name: "Ximena Martínez",
      email: "admin@example.com",
      tel: "7333398473",
      password: hashedPassword,
      roles: {
        create: [
          { role: { connect: { id: 1 } } },
          { role: { connect: { id: 2 } } },
        ],
      },
    },
  });

  await prisma.$disconnect();
}