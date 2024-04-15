import { Router } from 'express';
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';

const router = Router();

// Consultar a todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            skip: +req.query.skip,
            take: +req.query.take,
            orderBy: {
                id: 'desc'
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            },
        });

        const excludePassword = users.map(user => {
            delete user.password;
            return user;
        });

        res.status(200).json(excludePassword);
    } catch (error) {
        console.error('Error al encontrar los usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Crear un nuevo usuario
router.post('/user', async (req, res) => {
    try {
        const { name, email, password , tel, status, roles } = req.body;

        // Verificar si el email ya está en uso
        const existingUserEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUserEmail) {
            return res.status(400).json({ message: 'El email ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario con los roles proporcionados
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                tel,
                status,
                roles: {
                    create: roles.map(roleId => ({
                        role: {
                            connect: { id: roleId }
                        }
                    }))
                }
            },
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

        delete user.password;

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, tel, status, roles } = req.body;

        // Verificar si el usuario existe
        const existingUser = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Construir el objeto de datos a actualizar
        let dataToUpdate = {};

        if (name !== undefined) {
            dataToUpdate.name = name;
        }

        if (email) {
            dataToUpdate.email = email;
        }

        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        if (tel !== undefined) {
            dataToUpdate.tel = tel;
        }

        if (status !== undefined) {
            dataToUpdate.status = status;
        }

        if (roles) {
            // Borrar todos los roles existentes
            dataToUpdate.roles = {
                deleteMany: {},
                // Crear los nuevos roles seleccionados
                create: roles.map(roleId => ({
                    role: {
                        connect: { id: roleId }
                    }
                })),
            };
        }

        // Actualizar el usuario
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
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

// Contador de registros
router.get('/users/total', async (req, res) => {
    try {
        const total = await prisma.user.count();

        res.status(200).json(total);
    } catch (error) {
        console.error('Error obtener el total de usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Obtener el listado de usuarios
router.get('/users/list', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al encontrar los usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;