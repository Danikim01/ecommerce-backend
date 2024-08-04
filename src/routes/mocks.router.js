import {Router} from 'express';
import { generateProduct } from '../utils/fakerUtil.js';

const router = Router();

router.get("/", (req, res) => { 
    res.send(generateProduct())
})

export default router;