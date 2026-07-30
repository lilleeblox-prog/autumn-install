import { Router, type IRouter } from "express";
import { db, waitlistTable } from "@workspace/db";
import { JoinWaitlistBody, JoinWaitlistResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/waitlist", async (req, res): Promise<void> => {
  const parsed = JoinWaitlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db
    .insert(waitlistTable)
    .values({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      season: parsed.data.season,
      zipCode: parsed.data.zipCode ?? null,
      notes: parsed.data.notes ?? null,
    })
    .returning();

  req.log.info({ id: entry.id, season: entry.season }, "Waitlist entry created");
  res.status(201).json(JoinWaitlistResponse.parse(entry));
});

export default router;
