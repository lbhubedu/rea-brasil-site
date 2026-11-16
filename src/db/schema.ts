import { pgTable, text, timestamp, uuid, integer, uniqueIndex, index } from "drizzle-orm/pg-core";

export const generatedPrompts = pgTable(
  "generated_prompts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appName: text("app_name").notNull(),
    appType: text("app_type").notNull(),
    feature: text("feature").notNull(),
    objective: text("objective").notNull(),
    audience: text("audience").notNull().default("iniciante"),
    deliverable: text("deliverable").notNull().default("explicacao"),
    details: text("details").notNull().default(""),
    provider: text("provider").notNull(),
    model: text("model").notNull().default(""),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("generated_prompts_created_at_idx").on(table.createdAt)],
);

export const buildVotes = pgTable(
  "build_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    buildSlug: text("build_slug").notNull(),
    voterKey: text("voter_key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("build_votes_slug_voter_idx").on(table.buildSlug, table.voterKey),
    index("build_votes_slug_idx").on(table.buildSlug),
  ],
);

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull().default(""),
  email: text("email").notNull().default(""),
  status: text("status").notNull().default("pendente"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const promptCopies = pgTable("prompt_copies", {
  id: uuid("id").primaryKey().defaultRandom(),
  promptId: text("prompt_id").notNull(),
  copies: integer("copies").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
