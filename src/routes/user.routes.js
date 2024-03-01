import { Router } from "express";

const router = Router();

router.get("/users", (req, res) => {
    res.send('produdcts');
});

export default router;