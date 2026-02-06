import { pgTable, text, timestamp, uuid, varchar, integer } from "drizzle-orm/pg-core";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  restaurantName: text("restaurant_name").notNull(),
  location: text("location"),
  rating: integer("rating").notNull(), // 1–5
  priceRange: varchar("price_range", { length: 10 }).notNull(), // ₱, ₱₱, ₱₱₱
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  reviewId: uuid("review_id").notNull(),
  authorName: text("author_name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
