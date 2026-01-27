import expresss from "express"

import {register, login} from "../../controllers/authControllers.js"
import { validate } from "../../middleware/validate.js";
import { registerSchema,loginSchema } from "../../validators/authValidators.js";

const router = expresss.Router();

router.post("/register",validate(registerSchema),register)
router.post("/login",validate(loginSchema),login)

export default router