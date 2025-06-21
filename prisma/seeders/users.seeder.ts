import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export async function UserSeeder() {
  const users: Prisma.UserCreateInput[] = [
    {
      id: '0717205d-d703-4d87-b7d0-33cc5437e977',
      name: 'Keren',
      paternalSurname: 'Gomez',
      email: 'kgomez@uninter.edu.mx',
      password: await bcrypt.hash('Keren@Uninter2025!', 10),
      roles: { create: [{ roleId: 2 }] },
    },
    {
      id: '127212ba-9d93-4a0c-aade-e60647af369e',
      name: 'Adrian',
      paternalSurname: 'Molina',
      email: 'mmolina@uninter.edu.mx',
      password: await bcrypt.hash('Adrian@Uninter2025!', 10),
      roles: { create: [{ roleId: 2 }] },
    },
    {
      id: '2f7653df-6f01-4a2b-904d-8cf1155e2f50',
      name: 'Jesus',
      paternalSurname: 'Trillo',
      email: 'jmoreno@uninter.edu.mx',
      password: await bcrypt.hash('Jesus@Uninter2025!', 10),
      roles: { create: [{ roleId: 2 }] },
    },

    {
      id: '45780b72-5b79-44e1-8f94-887da9cc1173',
      name: 'Javier',
      paternalSurname: 'Espinoza',
      email: 'fjalducin@uninter.edu.mx',
      password: await bcrypt.hash('Javier@Uninter2025!', 10),
      roles: { create: [{ roleId: 2 }] },
    },
    {
      id: '514201f3-b254-45ae-8d88-f49c2e5bd19c',
      name: 'Aldahir',
      paternalSurname: 'Gomez',
      email: 'agomez@uninter.edu.mx',
      password: await bcrypt.hash('Aldahir@Uninter2025!', 10),
      roles: { create: [{ roleId: 1 }] },
    },
    {
      id: '6359cd7d-d79d-4f6b-8618-ddf196fdf209',
      name: 'Raul',
      paternalSurname: 'Castilleja',
      email: 'jcastilleja@uninter.edu.mx',
      password: await bcrypt.hash('Raul@Uninter2025!', 10),
      roles: { create: [{ roleId: 2 }] },
    },
    {
      id: '76919a27-9fd0-40be-89e8-2b3c71d73eae',
      name: 'Ximena',
      paternalSurname: 'Martínez',
      email: 'xmartinez@uninter.edu.mx',
      password: await bcrypt.hash('Ximena@Uninter2025!', 10),
      roles: { create: [{ roleId: 1 }, { roleId: 2 }] },
    },
    {
      id: 'd9552804-d666-4e9b-ad95-f846c294a379',
      name: 'Yanin',
      paternalSurname: 'Vazquez',
      email: 'yvazquez@uninter.edu.mx',
      password: await bcrypt.hash('Yanin@Uninter2025!', 10),
      roles: { create: [{ roleId: 2 }] },
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }

  console.log('✅ Users seeded correctly');
}
