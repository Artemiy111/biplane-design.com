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
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  passwordHash: text('password_hash').notNull(),
})

export type UserDb = typeof users.$inferSelect
export type CreateUserDb = typeof users.$inferInsert

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().unique(),
  uri: text('uri').notNull().unique(),
  order: integer('order').notNull().unique(),
})

export type GroupId = GroupDb['id']
export type GroupDb = typeof groups.$inferSelect
export type GroupDbCreate = Omit<GroupDb, 'id' | 'order'>
export type GroupDbUpdate = Omit<GroupDb, 'id'>

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
    title: text('title').notNull().unique(),
    uri: text('uri').notNull(),
    order: integer('order').notNull(),
    layout: text('layout', { enum: ['base', 'mini'] }).notNull(),
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

export const projects = pgTable(
  'projects',
  {
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    uri: text('uri').notNull().unique(),
    status: text('status', { enum: ['завершён', 'строится', 'в разработке'] }).notNull(),
    yearStart: integer('year_start'),
    yearEnd: integer('year_end'),
    location: text('location'),
    order: integer('order').notNull(),
    isMinimal: boolean('is_minimal').notNull().default(false),
  },
  (t) => {
    return {
      uniqueOrderForCategory: unique('unique_order_for_category').on(t.categoryId, t.order),
    }
  },
)

export type ProjectId = ProjectDb['id']
export type ProjectDb = typeof projects.$inferSelect
export type ProjectDbCreate = typeof projects.$inferInsert
export type ProjectDbUpdate = Omit<ProjectDb, 'id'>
export type ProjectStatus = ProjectDb['status']

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
    id: text('id').primaryKey().notNull(),
    alt: text('alt').notNull(),
    fit: text('fit', { enum: ['object-fill', 'object-contain', 'object-cover', 'object-none'] }).notNull(),
    order: integer('order').notNull(),
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
