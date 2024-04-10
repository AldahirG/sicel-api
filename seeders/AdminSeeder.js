import { prisma } from '../src/db.js';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    const userData = [
      {
        name: 'Ximena Martínez',
        email: 'admin@example.com',
        tel: '7333398473',
        password: 'password',
      },
    ];

    for (const { name, email, tel, password } of userData) {
      // Verificar si el email ya está en uso
      const existingUserEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUserEmail) {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        await prisma.user.create({
          data: {
            name,
            email,
            tel,
            password: hashedPassword,
            roles: {
              createMany: {
                data: [
                  { roleId: 1 },
                  { roleId: 2 }
                ]
              }
            },
          },
        });
      }
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during user seeding:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await prisma.$disconnect();
  }
}

seed();