import expresss from "express"

import {register, login, me} from "../../controllers/authControllers.js"
import { validate } from "../../middleware/validate.js";
import { registerSchema,loginSchema } from "../../validators/authValidators.js";
import { protect } from "../../middleware/auth.js";

const router = expresss.Router();

// Auth Routes
router.post("/register",validate(registerSchema),register)
router.post("/login",validate(loginSchema),login)
router.get("/me",protect,me)

export default router