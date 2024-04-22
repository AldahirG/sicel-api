import { prisma } from "../../src/db.js";

export async function campaigns() {
  await prisma.campaign.createMany({
    data: [
      { name: "LIC_MAYO_24", type_campaign: "Campaña 1" },
      { name: "EJECUTIVAS_ABRIL_24", type_campaign: "Campaña 1" },
      { name: "HalloweenFest 2024", type_campaign: "Campaña 1" },
    ],
  });
}
