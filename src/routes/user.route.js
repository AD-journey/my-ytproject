import { Router } from "express";
import {
  getUserChannelProfile,
  logoutUser,
  refreshAcessToken,
  updateUserAvatar,
  updateUserCoverImage,
  userRegister,
  userlogin,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
  getWatchHistory
} from "../Controller/user.controler.js";
import { upload } from "../middlewares/multer.js";
import { verifyjwt } from "../middlewares/auth.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegister
);

router.route("/login").post(userlogin);

//secured route
router.route("/logout").post(verifyjwt, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);
router
  .route("/avatar")
  .patch(verifyjwt, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-coverImg")
  .patch(verifyjwt, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyjwt, getUserChannelProfile);
router
  .route("/change-password")
  .post(upload.none(), verifyjwt, changeCurrentPassword);
router.route("/current-user").get(verifyjwt, getCurrentUser);

router.route("/update-user").patch(upload.none(), verifyjwt, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(verifyjwt, upload.single("avatar"), updateUserAvatar);
  router.route("/watch-history").get(verifyjwt, getWatchHistory);

export { router };
