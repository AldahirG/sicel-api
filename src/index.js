import express from 'express';
import cors from 'cors';

// Importar rutas
import asetnameRoutes from './routes/asetname.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import authRoutes from './routes/auth.routes.js';
import campaignRoutes from './routes/campaign.routes.js';
import carreerRoutes from './routes/carreer.routes.js';
import contactmediumRoutes from './routes/contactmedium.route.js';
import followupRoutes from './routes/followup.routes.js';
import gradeRoutes from './routes/grade.routes.js';
import leadRoutes from './routes/lead.routes.js';
import promoterRoutes from './routes/promoter.route.js';
import roleRoutes from './routes/role.routes.js';
import scoolyearRoutes from './routes/schoolyear.routes.js';
import userRoutes from './routes/user.routes.js';

// Rutas de promotor
import leadPromoterRoutes from './routes/promoter/lead.routes.js';

// Gráficas
import chartRoutes from './routes/chart.routes.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: [process.env.ALLOWED_ORIGIN],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middleware para manejar preflights OPTIONS
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send({
        msg: "Sicel API"
    })
})

// Mandar a traer las rutas
app.use('/api', asetnameRoutes);
app.use('/api', assignmentRoutes);
app.use('/api', authRoutes);
app.use('/api', campaignRoutes);
app.use('/api', carreerRoutes);
app.use('/api', contactmediumRoutes)
app.use('/api', followupRoutes);
app.use('/api', gradeRoutes);
app.use('/api', leadRoutes);
app.use('/api', promoterRoutes);
app.use('/api', roleRoutes);
app.use('/api', scoolyearRoutes);
app.use('/api', userRoutes);

// Traer rutas de promotor
app.use('/api', leadPromoterRoutes);

app.use('/api', chartRoutes);

app.listen(PORT);
console.log("Servidor corriendo en puerto: ", PORT);