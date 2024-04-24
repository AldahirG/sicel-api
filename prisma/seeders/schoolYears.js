import { prisma } from "../../src/db.js";

export async function schoolYears() {
  await prisma.schoolYear.createMany({
    data: [
      { cicle: "2024-2" },
      { cicle: "2025-1" },
      { cicle: "2024-2025" },
      { cicle: "2025-2" },
      { cicle: "2025-2026" },
      { cicle: "2026-1" },
    ],
  });
}
