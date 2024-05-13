import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

type WithoutDates<T> = Omit<T, 'createdAt' | 'updatedAt'>

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 128 }).notNull().unique(),
  uri: varchar('uri', { length: 128 }).notNull().unique(),
  order: integer('order').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type GroupDb = typeof groups.$inferSelect
export type GroupDbCreate = Omit<WithoutDates<GroupDb>, 'id'>
export type GroupDbUpdate = WithoutDates<GroupDb>

export const groupsRelations = relations(groups, ({ many }) => ({
  categories: many(categories),
}))

export const categories = pgTable(
  'categories',
  {
    groupId: integer('group_id')
      .notNull()
      .references(() => groups.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 128 }).notNull().unique(),
    uri: varchar('uri', { length: 128 }).notNull(),
    order: integer('order').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => {
    return {
      uniqueUriForGroup: unique('unique_uri_for_group').on(t.groupId, t.uri),
      uniqueOrderForGroup: unique('unique_order_for_group').on(t.groupId, t.order),
    }
  },
)

export type CategoryDb = typeof categories.$inferSelect
export type CategoryDbCreate = Omit<WithoutDates<CategoryDb>, 'id'>
export type CategoryDbUpdate = Omit<WithoutDates<CategoryDb>, 'groupId'>

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  group: one(groups, {
    fields: [categories.groupId],
    references: [groups.id],
    relationName: 'group',
  }),
  projects: many(projects),
}))

export const projects = pgTable(
  'projects',
  {
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    uri: varchar('uri', { length: 200 }).notNull().unique(),
    status: text('status').notNull(),
    yearStart: integer('year_start'),
    yearEnd: integer('year_end'),
    location: text('location').notNull(),
    order: integer('order').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => {
    return {
      uniqueOrderForCategory: unique('unique_order_for_category').on(t.categoryId, t.order),
    }
  },
)

export type ProjectDb = typeof projects.$inferSelect
export type ProjectDbCreate = Omit<WithoutDates<ProjectDb>, 'id'>
export type ProjectDbUpdate = WithoutDates<ProjectDb>

export const projectsRelations = relations(projects, ({ one, many }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
    relationName: 'category',
  }),
  images: many(images),
}))

export const images = pgTable(
  'images',
  {
    projectId: integer('project_id').notNull().references(() => projects.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: serial('id').primaryKey(),
    filename: varchar('filename', { length: 200 }).notNull(),
    alt: varchar('alt', { length: 200 }).notNull(),
    order: integer('order').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => {
    return {
      uniqueIdxFilenameForProject: uniqueIndex('unique_idx_filename_for_project').on(
        t.projectId,
        t.filename,
      ),
      uniqueOrderForProject: uniqueIndex('unique_order_for_project').on(
        t.projectId,
        t.order,
      ),
    }
  },
)

export type ImageDb = typeof images.$inferSelect
export type ImageDbCreate = Omit<WithoutDates<ImageDb>, 'id'>
export type ImageDbUpdate = Omit<WithoutDates<ImageDb>, 'projectId'>

export const imageRelations = relations(images, ({ one }) => ({
  project: one(projects, {
    fields: [images.projectId],
    references: [projects.id],
    relationName: 'project',
  }),
}))

export type GroupDbDeep = GroupDb & { categories: CategoryDbDeep[] }
export type CategoryDbDeep = CategoryDb & { projects: ProjectDbDeep[] }
export type ProjectDbDeep = ProjectDb & { images: ImageDb[] }
