import { prisma } from '../src/db.js';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    const promoterData = [
      {
        name: 'Ximena Martínez',
        tel: '7333398473',
        email: 'ximena@gmail.com',
        password: 'password',
      },
    ];

    for (const promoter of promoterData) {
      const { name, tel, email, password } = promoter;

      // Verificar si el email ya está en uso
      const existingUserEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUserEmail) {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo promotor
        const newPromoter = await prisma.promoter.create({
          data: {
            name,
            tel,
            status: true,
            user: {
              create: {
                email,
                password: hashedPassword,
                accessToken: null,
                created_at: new Date(),
              },
            },
          },
          include: {
            user: true,
          },
        });

        // Asigna el rol 2 al nuevo promotor
        await prisma.usersOnRoles.create({
          data: {
            user: {
              connect: {
                id: newPromoter.user.id,
              },
            },
            role: {
              connect: {
                id: 2,
              },
            },
          },
        });
      }
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding of promoters:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await prisma.$disconnect();
  }
}

seed();
