import { prisma } from '../src/db.js';

async function seed() {
  try {
    // Insertar datos en la tabla Follow Up utilizando el cliente de Prisma
    await prisma.followUp.createMany({
      data: [
        { name: 'AU-ALUMNO UNINTER' },
        { name: 'INSC-INSCRIPCIÓN' },
        { name: 'NC-NO CONTESTA' },
        { name: 'NI-NO INTERESA' },
        { name: 'P-PROSPECTO' },
        { name: 'PI-INSCRIPCIÓN' },
        { name: 'PS-SEGUIMIENTO' },
        { name: 'SC-SIN CONTACTO' },
        { name: 'PU-PERSONAL UNINTER' },
        { name: 'DU-DUPLICADO' },
        { name: 'DI-DATO NO VALIDO' },
        { name: 'BA-BAJA ALUMNO' },
        { name: 'VACIO' },
      ],
    });

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error durante el seeding:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await prisma.$disconnect();
  }
}

seed();
