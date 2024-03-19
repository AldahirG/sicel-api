import express from 'express';
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Todos los promotores
router.get('/promoters', async (req, res) => {
  try {
    // Busca todos los promotores en la base de datos
    const promotores = await prisma.promoter.findMany({
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: true
              }
            }
          }
        }
      }
    });

    // Retorna los promotores encontrados
    res.status(200).json(promotores);
  } catch (error) {
    console.error('Error al buscar promotores:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para registrar un promotor
router.post('/promoter', async (req, res) => {
  try {
    // Extrae los datos del cuerpo de la solicitud
    const { name, tel, email, password } = req.body;

    // Verificar si el usuario o el correo electrónico ya existen en la base de datos
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    // Si el usuario o el correo electrónico ya existen, retornar un error
    if (existingUser) {
      return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso.' });
    }

    // Genera el hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo promotor en la base de datos
    const newPromotor = await prisma.promoter.create({
      data: {
        name: name,
        tel: tel,
        status: true,
        user: {
          create: {
            email: email,
            password: hashedPassword,
            accessToken: null,
            created_at: new Date(),
          },
        },
      },
      include: {
        user: true
      },
    });

    // Asigna el rol 2 al nuevo promotor
    await prisma.usersOnRoles.create({
      data: {
        user: {
          connect: {
            id: newPromotor.user.id,
          },
        },
        role: {
          connect: {
            id: 2,
          },
        },
      },
    });

    res.status(201).json(newPromotor);
  } catch (error) {
    console.error('Error al registrar promotor: ', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Consultar un promotor por su ID
router.get('/promoter/:id', async (req, res) => {

  const { id } = req.params;

  try {
    const promotor = await prisma.promoter.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: true
              }
            }
          }
        }
      }
    });

    if (promotor) {
      res.status(200).json(promotor);
    } else {
      res.status(404).json({ error: 'Promotor no encontrado.' });
    }
  } catch (error) {
    console.error('Error al obtener promotor: ', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Actualizar un promotor
router.put('/promoter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tel, email, password, status } = req.body;

    // Obtener el promotor actualizado junto con los datos del usuario asociado
    const updatedPromotor = await prisma.promoter.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
      },
    });

    // Verificar si el correo electrónico se está actualizando y si ya existe en otro usuario
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { email: email },
            { id: { not: updatedPromotor.user.id } }, // Excluir el usuario actual asociado al promotor
          ],
        },
      });

      // Si se encuentra un usuario con el mismo correo electrónico, devolver un error
      if (existingUser) {
        return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso.' });
      }
    }

    // Re-encriptar la contraseña si se proporciona
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    await prisma.$transaction([
      prisma.promoter.update({
        where: {
          id: parseInt(id)
        },
        data: {
          name,
          tel,
          status
        },
      }),
      prisma.user.update({
        where: {
          id: updatedPromotor.user.id // Utilizar el ID del usuario asociado al promotor
        },
        data: {
          email,
          password: hashedPassword
        },
      }),
    ]);

    res.status(200).json(updatedPromotor);

  } catch (error) {
    console.error('Error al actualizar promotor:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Eliminar un promotor y sus relaciones
router.delete('/promoter/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el usuario asociado al promotor
    const promotor = await prisma.promoter.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!promotor) {
      return res.status(404).json({ error: 'Promotor no encontrado.' });
    }

    const userId = promotor.user.id; // ID del usuario asociado al promotor

    // Eliminar todas las relaciones de la tabla intermedia UsersOnRoles
    await prisma.usersOnRoles.deleteMany({
      where: {
        userId: userId, // Utilizamos el ID del usuario asociado al promotor
      },
    });

    // Eliminar el promotor y el usuario relacionado utilizando sus IDs respectivos
    await prisma.$transaction([
      prisma.promoter.delete({
        where: { id: parseInt(id) }, // ID del promotor
      }),
      prisma.user.delete({
        where: { id: userId }, // ID del usuario asociado al promotor
      }),
    ]);

    res.status(200).json({ message: 'Promotor eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar promotor:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
