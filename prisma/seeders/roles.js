import { prisma } from "../../src/db.js";

export async function roles() {
  await prisma.role.createMany({
    data: [
      { name: "Administrador" },
      { name: "Promotor" },
      { name: "Coordinador" },
    ],
  });
}