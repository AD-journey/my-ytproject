import { Router } from "express";

import { verifyjwt } from "../middlewares/auth.js";
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../Controller/Subscrtpition.controler.js";

const router = Router()

router.use(verifyjwt)

router.route("/c/:channelId").get(getUserChannelSubscribers).post(toggleSubscription);
router.route("/u/:subscriberId").get(getSubscribedChannels);   

export default router

