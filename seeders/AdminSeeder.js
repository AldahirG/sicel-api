import { prisma } from '../src/db.js';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    const userData = [
      {
        email: 'admin@example.com',
        password: 'password',
        roleId: 1,
      },
    ];

    for (const user of userData) {
      const { email, password, roleId } = user;

      // Verificar si el email ya está en uso
      const existingUserEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUserEmail) {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            roles: {
              create: {
                role: {
                  connect: {
                    id: roleId,
                  },
                },
              },
            },
          },
        });
      }
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error durante el seeding de usuarios:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await prisma.$disconnect();
  }
}

seed();
