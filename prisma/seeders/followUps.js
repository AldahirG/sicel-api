import { prisma } from "../../src/db.js";

export async function followUps() {
  await prisma.followUp.createMany({
    data: [
      { name: "AU-ALUMNO UNINTER" },
      { name: "INSC-INSCRIPCIÓN" },
      { name: "NC-NO CONTESTA" },
      { name: "NI-NO INTERESA" },
      { name: "P-PROSPECTO" },
      { name: "PI-INSCRIPCIÓN" },
      { name: "PS-SEGUIMIENTO" },
      { name: "SC-SIN CONTACTO" },
      { name: "PU-PERSONAL UNINTER" },
      { name: "DU-DUPLICADO" },
      { name: "DI-DATO NO VALIDO" },
      { name: "BA-BAJA ALUMNO" },
      { name: "VACIO" },
    ],
  });
}
