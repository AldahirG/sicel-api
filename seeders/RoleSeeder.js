import { prisma } from '../src/db.js';

async function seed() {
  try {
    // Insertar datos en la tabla Role utilizando el cliente de Prisma
    await prisma.role.createMany({
      data: [
        { name: 'Administrador' },
        { name: 'Promotor' },
        { name: 'Coordinador' },
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
