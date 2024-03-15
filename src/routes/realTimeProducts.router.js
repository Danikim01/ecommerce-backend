import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => { 
    res.render(
        "realTimeProducts",
        {
            title: "Productos a tiempo real",
            style: "index.css",
        }
    )
});

export default router;