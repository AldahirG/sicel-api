import { prisma } from "../../src/db.js";

export async function grades() {
  await prisma.grade.createMany({
    data: [
        { name: "SECUNDARIA" },
        { name: "BACHILLERATO" },
        { name: "PREPA-A" },
        { name: "LIC/ING" },
        { name: "ESPECIALIDAD" },
        { name: "DIPLOMADO" },
        { name: "MAESTRIA" },
        { name: "DOCTORADO" },
        { name: "NO ESPECIFICA" },
    ],
  });
}