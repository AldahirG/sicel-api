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
        });

        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const password_validation = await bcrypt.compare(password, user.password);

        if (!password_validation) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        let token = user.accessToken;

        // Generar un nuevo token JWT solo si el usuario no tiene un token de acceso existente
        if (!token) {
            token = jwt.sign({ userId: user.idUser }, process.env.JWT_SECRET);
            
            // Actualizar el token de acceso en la base de datos solo si se genera uno nuevo
            await prisma.user.update({
                where: {
                    idUser: user.idUser,
                },
                data: {
                    accessToken: token,
                },
            });
        }

        // Eliminar el campo 'password' del objeto 'user' antes de enviar la respuesta
        delete user.password;

        res.json({ mensaje: 'Inicio de sesión exitoso', user, token });
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
                idUser: user.idUser,
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


export default router;