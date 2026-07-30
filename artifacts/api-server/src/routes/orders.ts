import { Router, type IRouter } from "express";
import { db, fallOrdersTable } from "@workspace/db";
import { SubmitFallOrderBody, SubmitFallOrderResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = SubmitFallOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db
    .insert(fallOrdersTable)
    .values({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      address: parsed.data.address ?? null,
      serviceType: parsed.data.serviceType,
      notes: parsed.data.notes ?? null,
      propertySize: parsed.data.propertySize ?? null,
    })
    .returning();

  req.log.info({ id: order.id, serviceType: order.serviceType }, "Fall order created");
  res.status(201).json(SubmitFallOrderResponse.parse(order));
});

export default router;
