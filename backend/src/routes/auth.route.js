import express from "express";
import { signIn , signUp, logOut,onboard} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login",signIn)
router.post("/signup",signUp)
router.post("/logout",logOut)

router.post("/onboarding", protectRoute ,onboard);

router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router; 