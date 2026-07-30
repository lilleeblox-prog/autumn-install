import { Router, type IRouter } from "express";
import healthRouter from "./health";
import waitlistRouter from "./waitlist";
import ordersRouter from "./orders";
import portfolioRouter from "./portfolio";

const router: IRouter = Router();

router.use(healthRouter);
router.use(waitlistRouter);
router.use(ordersRouter);
router.use(portfolioRouter);

export default router;
