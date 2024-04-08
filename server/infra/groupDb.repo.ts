import { and, eq, getTableColumns, gt, gte, lt, lte, sql } from 'drizzle-orm'
import type { Result } from '../shared/result'
import { err, ok } from '../shared/result'
import { IGroupEntity } from './../entities/group.entity'
import { categoryDbMapper } from './categoryDb.repo'
import type {
  CreateGroupDto,
  GroupDto,
  GroupId,
  IGroupDbRepo,
  UpdateGroupDto,
} from '~/server/use-cases/types'
import type { Db, DbTransaction } from '~/server/db'
import type { GroupDbCreate, GroupDbDeep, GroupDbUpdate } from '~/server/db/schema'
import { groups } from '~/server/db/schema'

export const groupDbMapper = {
  toDto(db: GroupDbDeep): GroupDto {
    return {
      id: db.id,
      title: db.title,
      uri: db.urlFriendly,
      order: db.order,
      categories: db.categories.map(categoryDbMapper.toDto),
    }
  },
  toCreate(dto: CreateGroupDto, order: number): GroupDbCreate {
    return {
      urlFriendly: dto.uri,
      title: dto.title,
      order,
    }
  },
  toUpdate(dto: UpdateGroupDto): GroupDbUpdate {
    return {
      id: dto.id,
      order: dto.order,
      title: dto.title,
      urlFriendly: dto.uri,
    }
  },
  toUpdateWithoutOrder(db: GroupDbUpdate): Omit<GroupDbUpdate, 'order'> {
    const { order: _order, ...toUpdate } = db
    return toUpdate
  },
}

export class GroupDbRepo implements IGroupDbRepo {
  constructor(private db: Db) {}

  private async getNextOrder(tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const count = (await ctx.select().from(groups)).length
      return ok(count + 1)
    }
    catch (e) {
      return err(new Error(`Could not get next order of group`))
    }
  }

  private async updateOrder(dto: GroupDto, newOrder: number, tx?: DbTransaction) {
    if (dto.order === newOrder)
      return ok(undefined)

    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder()
        if (!nextOrder.ok)
          return err(nextOrder.error)

        if (newOrder > nextOrder.value)
          return err('New order is out of range')

        if (newOrder > dto.order) {
          await tx.update(groups).set({ order: sql`(${groups.order} - 1) * 1000` }).where(and(
            gt(groups.order, dto.order),
            lte(groups.order, dto.order),
          ))
        }
        else if (newOrder < dto.order) {
          await tx.update(groups).set({ order: sql`(${groups.order} + 1) * 1000` }).where(and(
            gte(groups.order, newOrder),
            lt(groups.order, dto.order),
          ))
        }

        await tx.update(groups).set({ order: dto.order }).where(eq(groups.urlFriendly, dto.uri))
        await tx.update(groups).set({ order: sql`${groups.order} / 1000` }).where(gte(groups.order, 1000))
      })
    }
    catch (_e) {
      return err(new Error(`Could not update order of group with id \`${dto.id}\``))
    }
  }

  async getOne(id: GroupId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const group
      = (await ctx.query.groups.findFirst({
        where: eq(groups.id, id),
        with: {
          categories: {
            with: {
              projects: {
                with: {
                  images: { orderBy: images => images.order },
                },
                orderBy: projects => projects.order,
              },
            },
            orderBy: categories => categories.order,
          },
        },
        orderBy: groups => groups.order,
      }))
      if (!group)
        return err(new Error(`Group with id \`${id}\ does not exist`))

      return ok(groupDbMapper.toDto(group))
    }
    catch (_e) {
      return err(new Error(`Could not get group with id \`${id}\``))
    }
  }

  async getAll(tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      const groups = await ctx.query.groups.findMany({
        with: {
          categories: {
            with: {
              projects: {
                with: {
                  images: { orderBy: images => images.order },
                },
                orderBy: projects => projects.order,
              },
            },
            orderBy: categories => categories.order,
          },
        },
        orderBy: groups => groups.order,
      })
      return ok(groups.map(groupDbMapper.toDto))
    }
    catch (_e) {
      return err(new Error(`Could not get groups`))
    }
  }

  async create(dto: CreateGroupDto, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      return ctx.transaction(async (tx) => {
        const nextOrder = await this.getNextOrder(tx)
        if (!nextOrder.ok)
          return tx.rollback()

        const toCreate = groupDbMapper.toCreate(dto, nextOrder.value)

        const createdInDb = (await tx.insert(groups).values(toCreate).returning())[0]
        const created = await this.getOne(createdInDb.id, tx)
        if (!created.ok)
          return tx.rollback()

        return ok(created.value!)
      }, {
        isolationLevel: 'read committed',
      })
    }
    catch (e) {
      return err(new Error(`Could not create group`))
    }
  }

  async update(dto: UpdateGroupDto, tx?: DbTransaction): Promise<Result<GroupDto, Error>> {
    const ctx = tx || this.db

    try {
      return await ctx.transaction(async (tx) => {
        const group = await this.getOne(dto.id, tx)
        if (!group.ok)
          return tx.rollback()

        await tx.update(groups)
          .set(groupDbMapper.toUpdateWithoutOrder(groupDbMapper.toUpdate(dto)))
          .where(eq(groups.id, dto.id))

        await this.updateOrder(group.value, dto.order, tx)

        const updatedGroup = await this.getOne(dto.id, tx)
        if (!updatedGroup.ok)
          return tx.rollback()

        return ok(updatedGroup.value)
      })
    }
    catch (e) {
      return err(new Error(`Could not update group with id \`${dto.id}\``))
    }
  }

  async delete(id: GroupId, tx?: DbTransaction) {
    const ctx = tx || this.db
    try {
      return await ctx.transaction(async (tx) => {
        const toDelete = await tx.query.groups.findFirst({ where: eq(groups.id, id) })
        if (!toDelete)
          return tx.rollback()

        const deletedInDb = (await tx.delete(groups).where(eq(groups.id, id)).returning())[0]
        if (!deletedInDb)
          return tx.rollback()

        const remain = await tx.select(({ ...getTableColumns(groups), newOrder: sql<number>`row_number() over (order by ${groups.order})`.mapWith(Number).as('new_order') })).from(groups)
        await Promise.all(
          remain.map((group) => {
            return tx.update(groups).set({ order: group.newOrder * 1000 }).where(
              eq(groups.id, group.id),
            )
          }),
        )
        await Promise.all(
          remain.map((group) => {
            return tx.update(groups).set({ order: group.newOrder }).where(
              eq(groups.id, group.id),
            )
          }),
        )
        return ok(undefined)
      })
    }
    catch (_e) {
      return err(new Error(`Could not delete group with id \`${id}\``))
    }
  }
}
