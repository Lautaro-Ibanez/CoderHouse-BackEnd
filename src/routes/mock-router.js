import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";
const router = Router();

router.get("/mockingproducts", mocksController.getMockProducts);

export default router;
