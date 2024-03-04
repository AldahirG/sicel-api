import { Router } from 'express';
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';

const router = Router();

// Consultar a todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al encontrar los usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Crear un nuevo usuario
router.post('/user', async (req, res) => {
    try {
        const { email, password, roleId } = req.body;

        // Verificar si el email ya está en uso
        const existingUserEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUserEmail) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                roles: {
                    create: {
                        role: {
                            connect: {
                                id: roleId
                            }
                        }
                    }
                }
            },

            // Muestra en el json informacion sobre la tabla pivote
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        res.status(201).json(newUser);

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Consultar un usuario por su id
router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },

            // Muestra en el json informacion sobre la tabla pivote
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Actualizar un usuario por su id
router.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, roleId } = req.body;

        // Verificar si el email ya está en uso
        if (email) {
            
            const existingUserEmail = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUserEmail) {
                return res.status(400).json({ message: 'El email ya está en uso' });
            }
        }

        // Re-encriptar la contraseña si se proporciona
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Actualizar el rol si se proporciona
        if (roleId) {
            const existingRole = await prisma.role.findUnique({
                where: { id: roleId },
            });

            if (!existingRole) {
                return res.status(404).json({ message: 'El rol proporcionado no existe.' });
            }

            // Eliminar todos los roles anteriores del usuario y asignar el nuevo rol
            await prisma.usersOnRoles.deleteMany({
                where: { userId: parseInt(id) }
            });

            await prisma.usersOnRoles.create({
                data: {
                    role: {
                        connect: {
                            id: roleId
                        }
                    },
                    user: {
                        connect: {
                            id: parseInt(id)
                        }
                    }
                }
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                email,
                password: hashedPassword,
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Eliminar a un usuario por su id
router.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el usuario existe
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        // Si el usuario no existe, retornar un mensaje de error
        if (!existingUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Eliminar todas las relaciones del usuario en la tabla pivote
        await prisma.usersOnRoles.deleteMany({
            where: { userId: parseInt(id) },
        });

        // Eliminar el usuario
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
});

export default router;