import { relations } from 'drizzle-orm'
import { int, sqliteTable, text, unique, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { categoryLayouts, imageFits, projectStatuses } from '../shared/constants'

export const users = sqliteTable('users', {
  id: int().primaryKey(),
  username: text().notNull(),
  passwordHash: text().notNull(),
}, () => [])

export type UserDb = typeof users.$inferSelect
export type CreateUserDb = typeof users.$inferInsert

export const sessions = sqliteTable('sessions', {
  id: text().primaryKey(),
  userId: int().notNull().references(() => users.id),
  expiresAt: int({ mode: 'timestamp' }).notNull(),
}, () => [])

export type SessionId = SessionDb['id']
export type SessionDb = typeof sessions.$inferSelect

export const groups = sqliteTable('groups', {
  id: int().primaryKey(),
  title: text().notNull().unique(),
  slug: text().notNull().unique(),
  order: int().notNull().unique(),
}, () => [])

export type GroupId = GroupDb['id']
export type GroupDb = typeof groups.$inferSelect
export type GroupDbCreate = Omit<GroupDb, 'id' | 'order'>
export type GroupDbUpdate = Omit<GroupDb, 'id'>

export const groupsRelations = relations(groups, ({ many }) => ({
  categories: many(categories),
}))


export const categories = sqliteTable(
  'categories',
  {
    groupId: int().notNull().references(() => groups.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: int().primaryKey(),
    title: text().notNull().unique(),
    slug: text().notNull().unique(),
    order: int().notNull(),
    layout: text({ enum: categoryLayouts }).notNull(),
  },
  (t) => [unique('unique_order_for_group').on(t.groupId, t.order),]
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


export const projects = sqliteTable(
  'projects',
  {
    categoryId: int('category_id').notNull().references(() => categories.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: int().primaryKey(),
    title: text().notNull(),
    slug: text().notNull().unique(),
    status: text({ enum: projectStatuses }).notNull(),
    yearStart: int(),
    yearEnd: int(),
    location: text(),
    order: int().notNull(),
    isMinimal: int({ mode: 'boolean' }).notNull().default(false),
    isVisible: int({ mode: 'boolean' }).notNull().default(true),
  },
  (t) => [unique('unique_order_for_category').on(t.categoryId, t.order),]
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

export const images = sqliteTable(
  'images',
  {
    projectId: int().notNull().references(() => projects.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: text().primaryKey().notNull(),
    alt: text().notNull(),
    fit: text({ enum: imageFits }).notNull(),
    order: int().notNull(),
  },
  (t) => [uniqueIndex('unique_order_for_project').on(t.projectId, t.order)]
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
