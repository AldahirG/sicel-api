import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user.routes.js';

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware para manejar preflights OPTIONS
app.options("*", cors());

app.use(express.json());

app.use('/api', userRoutes);

app.listen(3000);
console.log("Server on port", 3000);