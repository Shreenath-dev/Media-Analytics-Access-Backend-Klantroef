import express from "express";
import * as controller from "@/controllers";
import { limiter } from "@/security/limiter";
import { upload } from "../../middleware/uploadMiddleware";
import { userAuthenticate as userAuth } from "@/security/passport";


const router = express.Router();

router.route("/media").post(limiter,userAuth, upload.single("file_key"), controller.v1.users.media);
router.route("/media/:id/stream-url").get(limiter,userAuth, controller.v1.users.getMedia);
router.route("/media/:id/view").get(limiter,userAuth, controller.v1.users.viewMedia);
router.route("/media/:id/analytics").get(limiter,userAuth, controller.v1.users.analyticsView);


export default router;