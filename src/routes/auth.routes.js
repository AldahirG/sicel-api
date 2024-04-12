import { Router } from 'express';
import { prisma } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            },
        });

        if (!user) {
            return res.status(404).json({ emailNotFound: 'Correo electrónico no encontrado' });
        }

        const password_validation = await bcrypt.compare(password, user.password);

        if (!password_validation) {
            return res.status(401).json({ passwordIncorrect: 'Contraseña incorrecta' });
        }

        let token = user.accessToken;

        // Generar un nuevo token JWT solo si el usuario no tiene un token de acceso existente
        if (!token) {
            token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            
            // Actualizar el token de acceso en la base de datos solo si se genera uno nuevo
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    accessToken: token,
                }
            });
        }

        // Eliminar el campo 'password' del objeto 'user' antes de enviar la respuesta
        delete user.password;

        const roles = user.roles.map(userRole => userRole.role.name); // Obtener un array con los nombres de los roles

        res.json({ mensaje: 'Inicio de sesión exitoso', user, token, roles });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
});

router.post('/auth/logout', async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1]; // Obtener el token de acceso de las cabeceras de autorización

    if (!accessToken) {
        return res.status(401).json({ mensaje: 'No se proporcionó un token de acceso' });
    }

    try {
        // Buscar el usuario en la base de datos por el token de acceso
        const user = await prisma.user.findFirst({
            where: {
                accessToken: accessToken,
            },
        });

        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Eliminar el token de acceso de la base de datos (marcándolo como nulo)
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                accessToken: null,
            },
        });

        res.json({ mensaje: 'Sesión cerrada exitosamente' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ mensaje: 'Error al cerrar sesión' });
    }
});

router.get('/auth/redirect/role', async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1]; // Obtener el token de acceso de las cabeceras de autorización

    if (!accessToken) {
        return res.status(401).json({ mensaje: 'No se proporcionó un token de acceso' });
    }

    try {
        // Buscar el usuario en la base de datos por el token de acceso
        const user = await prisma.user.findFirst({
            where: {
                accessToken: accessToken,
            },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Devuelve los roles del usuario en la respuesta
        const roles = user.roles.map(userRole => userRole.role.name);
        res.status(200).json({ roles });

    } catch (error) {
        console.error('Acceso no autorizado:', error);
        res.status(500).json({ mensaje: 'Acceso no autorizado' });
    }
});

// Obtener id de usuario por token de acceso
router.get('/auth/user', async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1]; // Obtener el token de acceso de las cabeceras de autorización

    if (!accessToken) {
        return res.status(401).json({ mensaje: 'No se proporcionó un token de acceso' });
    }

    try {
        // Buscar el usuario en la base de datos por el token de acceso
        const user = await prisma.user.findFirst({
            where: {
                accessToken: accessToken,
            },
        });

        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json({ id: user.id });

    } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
        res.status(500).json({ mensaje: 'Error al obtener el ID del usuario' });
    }
});

export default router;