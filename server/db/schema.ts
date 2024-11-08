import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial().primaryKey(),
  username: text().notNull(),
  passwordHash: text().notNull(),
})

export type UserDb = typeof users.$inferSelect
export type CreateUserDb = typeof users.$inferInsert

export const sessions = pgTable('sessions', {
  id: text().primaryKey(),
  userId: integer().notNull().references(() => users.id),
  expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
})

export const groups = pgTable('groups', {
  id: serial().primaryKey(),
  title: text().notNull().unique(),
  uri: text().notNull().unique(),
  order: integer().notNull().unique(),
})

export type GroupId = GroupDb['id']
export type GroupDb = typeof groups.$inferSelect
export type GroupDbCreate = Omit<GroupDb, 'id' | 'order'>
export type GroupDbUpdate = Omit<GroupDb, 'id'>

export const groupsRelations = relations(groups, ({ many }) => ({
  categories: many(categories),
}))

export const categoryLayout = ['base', 'mini'] as const

export const categories = pgTable(
  'categories',
  {
    groupId: integer().notNull().references(() => groups.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: serial().primaryKey(),
    title: text().notNull().unique(),
    uri: text().notNull(),
    order: integer().notNull(),
    layout: text({ enum: categoryLayout }).notNull(),
  },
  (t) => {
    return {
      uniqueUriForGroup: unique('unique_uri_for_group').on(t.groupId, t.uri),
      uniqueOrderForGroup: unique('unique_order_for_group').on(t.groupId, t.order),
    }
  },
)

export type CategoryId = CategoryDb['id']
export type CategoryLayout = CategoryDb['layout']
export type CategoryDb = typeof categories.$inferSelect
export type CategoryDbCreate = Omit<CategoryDb, 'id' | 'order'>
export type CategoryDbUpdate = Omit<CategoryDb, 'id' | 'groupId'>

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  group: one(groups, {
    fields: [categories.groupId],
    references: [groups.id],
    relationName: 'group',
  }),
  projects: many(projects),
}))

export const projectStatus = ['завершён', 'строится', 'в разработке'] as const

export const projects = pgTable(
  'projects',
  {
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: serial().primaryKey(),
    title: text().notNull(),
    uri: text().notNull().unique(),
    status: text({ enum: projectStatus }).notNull(),
    yearStart: integer(),
    yearEnd: integer(),
    location: text(),
    order: integer().notNull(),
    isMinimal: boolean().notNull().default(false),
  },
  (t) => {
    return {
      uniqueOrderForCategory: unique('unique_order_for_category').on(t.categoryId, t.order),
    }
  },
)

export type ProjectId = ProjectDb['id']
export type ProjectStatus = ProjectDb['status']
export type ProjectDb = typeof projects.$inferSelect
export type ProjectDbCreate = typeof projects.$inferInsert
export type ProjectDbUpdate = Omit<ProjectDb, 'id'>

export const projectsRelations = relations(projects, ({ one, many }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
    relationName: 'category',
  }),
  images: many(images),
}))

export const imageFit = ['object-fill', 'object-contain', 'object-cover', 'object-none'] as const

export const images = pgTable(
  'images',
  {
    projectId: integer().notNull().references(() => projects.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: text().primaryKey().notNull(),
    alt: text().notNull(),
    fit: text({ enum: imageFit }).notNull(),
    order: integer().notNull(),
  },
  (t) => {
    return {
      uniqueOrderForProject: uniqueIndex('unique_order_for_project').on(
        t.projectId,
        t.order,
      ),
    }
  },
)

export type ImageId = ImageDb['id']
export type ImageFit = ImageDb['fit']
export type ImageDb = typeof images.$inferSelect
export type ImageDbCreate = Omit<typeof images.$inferInsert, 'order'>
export type ImageDbUpdate = Omit<ImageDb, 'id' | 'projectId'>

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
