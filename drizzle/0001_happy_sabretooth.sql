CREATE TABLE "restaurants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(200) NOT NULL,
	"cuisine" varchar(50) NOT NULL,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "restaurants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "comments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "comments" CASCADE;--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_slug_unique";--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "restaurant_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "author_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "body" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "restaurant_name";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "price_range";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "content";