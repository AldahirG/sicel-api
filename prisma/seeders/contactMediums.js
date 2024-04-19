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
      { type: 'BASES' },
      { type: 'VISITA UNINTER' },
      { type: 'LLAMADA ENTRANTE' },
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