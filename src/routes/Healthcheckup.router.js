import { Router } from "express";
import { healthcheck } from "../Controller/healthCheck.controler.js";
import { verifyjwt } from '../middlewares/auth.js';

const router = Router();


router.route("/").get( verifyjwt,healthcheck);

export default router;