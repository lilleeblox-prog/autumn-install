import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const fallOrdersTable = pgTable("fall_orders", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  serviceType: text("service_type").notNull(), // 'waitlist' | 'order'
  notes: text("notes"),
  propertySize: text("property_size"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFallOrderSchema = createInsertSchema(fallOrdersTable).omit({
  id: true,
  createdAt: true,
});

export type InsertFallOrder = z.infer<typeof insertFallOrderSchema>;
export type FallOrder = typeof fallOrdersTable.$inferSelect;
