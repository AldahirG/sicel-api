import express from 'express';
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Todos los promotores
router.get('/promoters', async (req, res) => {
    try {
        // Busca todos los promotores en la base de datos
        const promotores = await prisma.promotor.findMany({
            include: {
                user: true
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
                OR: [
                    { email: email }
                ]
            }
        });

        // Si el usuario o el correo electrónico ya existen, retornar un error
        if (existingUser) {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está en uso.' });
        }

        // Genera el hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuevo promotor en la base de datos
        const newPromotor = await prisma.promotor.create({
            data: {
                name: name,
                tel: tel,
                status: true,
                user: {
                    create: {
                        email: email,
                        password: hashedPassword,
                        accessToken: null,
                        created_at: new Date()
                    }
                }
            },
            include: {
                user: true
            }
        });

        // Retorna el nuevo promotor creado
        res.status(201).json(newPromotor);
    } catch (error) {
        console.error('Error al registrar promotor:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar un promotor por su ID
router.get('/promoter/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const degree = await prisma.promotor.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                user: true
            }
        });

        if (degree) {
            res.json(degree);
        } else {
            res.status(404).json({ error: 'Promotor no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el promotor.' });
    }
});


router.put('/promoter/:id', async (req, res) => {
    const { id } = req.params;
    const { name, tel, email, password } = req.body;
  
    try {
      // Busca el promotor en la base de datos
      const promotor = await prisma.promotor.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          user: true,
        },
      });
  
      // Si el promotor no existe, retorna un error 404
      if (!promotor) {
        return res.status(404).json({ error: 'Promotor no encontrado.' });
      }
  
      // Busca un usuario con el mismo correo electrónico
      const existingUser = await prisma.user.findFirst({
        where: { email: email },
      });
  
      // Si se encuentra otro usuario con el mismo correo electrónico pero con un ID diferente al del promotor que se está actualizando, se retorna un error
      if (existingUser && existingUser.id !== promotor.user.id) {
        return res
          .status(400)
          .json({ mensaje: 'El correo electrónico ya está en uso.' });
      }
  
      // Actualiza el usuario asociado al promotor
      const updatedUser = await prisma.user.update({
        where: {
          id: promotor.user.id,
        },
        data: {
          email: email || promotor.user.email, // Si no se proporciona el email, utiliza el email actual
          password: password
            ? await bcrypt.hash(password, 10)
            : promotor.user.password, // Si no se proporciona la contraseña, utiliza la contraseña actual
        },
      });
  
      // Actualiza el promotor en la base de datos
      const updatedPromotor = await prisma.promotor.update({
        where: {
          id: promotor.id,
        },
        data: {
          name: name || promotor.name, // Si no se proporciona el nombre, utiliza el nombre actual
          tel: tel || promotor.tel, // Si no se proporciona el teléfono, utiliza el teléfono actual
        },
        include: {
          user: true,
        },
      });
  
      // Retorna el promotor actualizado
      res.json(updatedPromotor);
    } catch (error) {
      console.error('Error al actualizar el promotor:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
  



export default router;
