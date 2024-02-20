import { integer, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Theme = typeof themes.$inferSelect

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),

  themeId: integer('theme_id').notNull().references(() => themes.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Caterory = typeof categories.$inferSelect

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  status: text('status').notNull(),
  yearStart: integer('year_start'),
  yearEnd: integer('year_end'),
  location: text('location'),

  categoryId: integer('category_id').notNull().references(() => categories.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Project = typeof projects.$inferSelect
