import { Router } from 'express';
import { getChannelStats , getChannelVideos} from '../Controller/dashboard.controler.js';
import { verifyjwt } from '../middlewares/auth.js';

const router = Router();

// router.use(verifyjwt); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(verifyjwt, getChannelStats);
router.route("/videos").get(verifyjwt, getChannelVideos);

export default router