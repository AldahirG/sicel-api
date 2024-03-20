import { prisma } from "../src/db.js";

async function seed() {
  try {
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

    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Error durante el seeding:", error);
  } finally {
    // Cerrar la conexión a la base de datos
    await prisma.$disconnect();
  }
}

seed();
