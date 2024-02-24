/* eslint-disable ts/no-use-before-define */
import { integer, pgTable, serial, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().unique(),
  urlFriendly: text('url_friendly').notNull().unique(),
  order: serial('order').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Theme = typeof themes.$inferSelect

export const themesRelations = relations(themes, ({ many }) => ({
  categories: many(categories),
}))

export const categories = pgTable('categories', {
  themeId: integer('theme_id').notNull().references(() => themes.id),
  id: serial('id').primaryKey(),
  title: text('title').notNull().unique(),
  urlFriendly: text('url_friendly').notNull().unique(),
  order: serial('order').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Category = typeof categories.$inferSelect
export type CategoryCreate = typeof categories.$inferSelect

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  theme: one(themes, {
    fields: [categories.themeId],
    references: [themes.id],
    relationName: 'theme',
  }),
  projects: many(projects),
}))

export const projects = pgTable('projects', {
  categoryId: integer('category_id').notNull().references(() => categories.id),
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  urlFriendly: text('url_friendly').notNull().unique(),
  status: text('status').notNull(),
  yearStart: integer('year_start'),
  yearEnd: integer('year_end'),
  location: text('location'),
  order: serial('order').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Project = typeof projects.$inferSelect
export type ProjectCreate = typeof projects.$inferInsert

export const projectsRelations = relations(projects, ({ one, many }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
    relationName: 'category',
  }),
  images: many(images),
}))

export const images = pgTable('images', {
  projectId: integer('project_id').notNull().references(() => projects.id),
  id: serial('id').primaryKey(),
  filename: text('url').notNull(),
  title: text('title'),
  order: serial('order').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => {
  return {
    uniqueFilenameForProject: unique('unique_filename_for_project').on(t.projectId, t.filename),
  }
})

export type Image = typeof images.$inferSelect
export type ImageCreate = typeof images.$inferInsert

export const imageRelations = relations(images, ({ one }) => ({
  project: one(projects, {
    fields: [images.projectId],
    references: [projects.id],
    relationName: 'project',
  }),
}))

export type ThemeRec = Theme & { categories: CategoryRec[] }
export type CategoryRec = Category & { projects: ProjectRec[] }
export type ProjectRec = Project & { images: Image[] }
