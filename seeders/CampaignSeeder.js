import { prisma } from "../src/db.js";

async function seed() {
  try {
    await prisma.campaign.createMany({
      data: [
        { name: "Verano 2024", type_campaign: "Campaña 1" },
        { name: "Otoño 2024", type_campaign: "Campaña 1" },
        { name: "HalloweenFest 2024", type_campaign: "Campaña 1" },
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
