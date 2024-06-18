import {Router} from 'express';


const router = Router();

router.get("/production", (req, res) => {
    req.logger.info("Mensaje de debug en la ruta /loggerTest/production")
    res.status(200).send("Mensaje de debug en la ruta /loggerTest/production")
})

router.get("/writeFile", (req, res) => {
    req.logger.error("Mensaje de error en la ruta /loggerTest/writeFile")
    res.status(200).send("Mensaje de error en la ruta /loggerTest/writeFile")
})

router.get("/development", (req, res) => {
    req.logger.debug("Mensaje de debug en la ruta /loggerTest/development")
    res.status(200).send("Mensaje de debug en la ruta /loggerTest/development")
})

export default router;
