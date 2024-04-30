import express from "express";
import { prisma } from "../../db.js";

const router = express.Router();

router.get("/promoter/enrollments", async (req, res) => {
  try {
    // Consulta la base de datos para obtener los leads con todos los campos llenos
    const completeLeads = await prisma.lead.findMany({
      where: {
        NOT: {
          OR: [
            { genre: null },
            { enrollmentStatus: null },
            { career: null },
            { formerSchool: null },
            { typeSchool: null },
            { country: null },
            { state: null },
            { city: null },
            { referenceType: null },
            { referenceName: null },
            { dataSource: null },
            { admissionSemester: null },
            { dateFirstContact: null },
            { scholarship: null },
            { schoolYearId: null },
            { followId: null },
            { gradeId: null },
            { userId: null },
            { contactMediumId: null },
          ],
        },
        AND: {
            telOptional: null,
            emailOptional: null,
            asetNameId: null
        }
      },
    });

    // Devuelve los leads encontrados
    res.json(completeLeads);
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir
    console.error("Error retrieving complete leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
