/* eslint-disable ts/no-use-before-define */
import { integer, pgTable, serial, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 128 }).notNull().unique(),
  urlFriendly: varchar('url_friendly', { length: 128 }).notNull().unique(),
  order: serial('order').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Group = typeof groups.$inferSelect

export const groupsRelations = relations(groups, ({ many }) => ({
  categories: many(categories),
}))

export const categories = pgTable('categories', {
  groupId: integer('group_id').notNull().references(() => groups.id),
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 128 }).notNull().unique(),
  urlFriendly: varchar('url_friendly', { length: 128 }).notNull(),
  order: serial('order').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => {
  return {
    uniqueUrlFriendlyForGroupId: unique('url_friendly_for_group_id').on(t.groupId, t.urlFriendly),
  }
})

export type Category = typeof categories.$inferSelect
export type CategoryCreate = typeof categories.$inferSelect

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  group: one(groups, {
    fields: [categories.groupId],
    references: [groups.id],
    relationName: 'group',
  }),
  projects: many(projects),
}))

export const projects = pgTable('projects', {
  categoryId: integer('category_id').notNull().references(() => categories.id),
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  urlFriendly: varchar('url_friendly', { length: 200 }).notNull().unique(),
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
  projectUrlFriendly: varchar('project_url_friendly', { length: 200 }).references(() => projects.urlFriendly).notNull(),
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 200 }).notNull(),
  title: varchar('title', { length: 200 }),
  order: serial('order').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => {
  return {
    uniqueFilenameForProject: unique('unique_filename_for_project').on(t.projectUrlFriendly, t.filename),
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

export type GroupRec = Group & { categories: CategoryRec[] }
export type CategoryRec = Category & { projects: ProjectRec[] }
export type ProjectRec = Project & { images: Image[] }
