import { prisma } from "../../src/db.js";

export async function contactMediums() {
  await prisma.contactMedium.createMany({
    data: [
      { type: 'PAUTA' },
      { type: 'LANDING' },
      { type: 'WHATSAPP DIRECTO' },
      { type: 'MARKETING DIGITAL' },
      { type: 'CLIENGO' },
      { type: 'APOYO TRABAJADOR' },
      { type: 'BASE BAJAS' },
      { type: 'BASE EGRESADOS' },
      { type: 'BASE PERSONAL PROMOTOR' },
      { type: 'BASE EN FRIO' },
      { type: 'VISITA UNINTER' },
      { type: 'LLAMADA ENTRANTE' },
      { type: 'FERIA ESCUELA' },
      { type: 'SESION ESCUELA' },
      { type: 'VISITA ESCUELA' },
      { type: 'VISITA EMPRESA' },
      { type: 'EVENTO INTERNO' },
      { type: 'EVENTO EXTERNO' },
      { type: 'PUBLICIDAD EMPRESA' },
      { type: 'ALIANZA FRANCESA' },
      { type: 'REFERIDO' },
      { type: 'MAILING' },
      { type: 'SICAP' },
      { type: 'UNINTER INFORMA' },
    ],
  });
}

contactMediums()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
