import express from 'express';
import cors from 'cors';

// Importar rutas
import assignmentRoutes from './routes/assignment.routes.js';
import authRoutes from './routes/auth.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import carreerRoutes from './routes/carreer.routes.js';
import followupRoutes from './routes/followup.routes.js';
import gradeRoutes from './routes/grade.routes.js';
import leadRoutes from './routes/lead.routes.js';
import promoterRoutes from './routes/promoter.route.js';
import roleRoutes from './routes/role.routes.js';
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

// Mandar a traer las rutas
app.use('/api', authRoutes);
app.use('/api', campaignRoutes);
app.use('/api', carreerRoutes);
app.use('/api', followupRoutes);
app.use('/api', gradeRoutes);
app.use('/api', leadRoutes);
app.use('/api', promoterRoutes);
app.use('/api', roleRoutes);
app.use('/api', userRoutes);
app.use('/api', assignmentRoutes);

app.listen(3000);
console.log("Servidor corriendo en puerto: ", 3000);