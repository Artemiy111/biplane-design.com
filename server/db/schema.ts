/* eslint-disable ts/no-use-before-define */
import { integer, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Theme = typeof themes.$inferSelect

export const themesRelations = relations(themes, ({ many }) => ({
  categories: many(categories),
}))

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().unique(),

  themeId: integer('theme_id').notNull().references(() => themes.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Caterory = typeof categories.$inferSelect

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  theme: one(themes, {
    fields: [categories.themeId],
    references: [themes.id],
    relationName: 'theme',
  }),
  projects: many(projects),
}))

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

export const projectsRelations = relations(projects, ({ one }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
    relationName: 'category',
  }),
}))
