import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, portfolioTable } from "@workspace/db";
import {
  ListPortfolioItemsResponse,
  ListFeaturedPortfolioItemsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/portfolio", async (req, res): Promise<void> => {
  const items = await db
    .select()
    .from(portfolioTable)
    .orderBy(portfolioTable.createdAt);
  res.json(ListPortfolioItemsResponse.parse(items));
});

router.get("/portfolio/featured", async (req, res): Promise<void> => {
  const items = await db
    .select()
    .from(portfolioTable)
    .where(eq(portfolioTable.featured, true))
    .orderBy(portfolioTable.createdAt);
  res.json(ListFeaturedPortfolioItemsResponse.parse(items));
});

export default router;
