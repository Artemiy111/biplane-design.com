/* eslint-disable no-console */
import * as v from 'valibot'

type GroupEntityId = number

export interface ICategoryEntity {
  validate: () => void
}

interface IGroupEntityProps {
  id: GroupEntityId
  title: string
  uri: string
  // categories: ICategoryEntity[]
  order: number
}

export class GroupEntityValidationError extends Error {
  constructor() {
    super('GroupEntity validation error')
  }
}

const GroupEntitySchema = v.object({
  id: v.optional(v.number()),
  title: v.string([v.minLength(3)]),
  uri: v.string([v.minLength(3)]),
  // categories: v.array(v.any()),
  order: v.number([v.minValue(1)]),
})

type _GroupEntityValidatedFields = v.Input<typeof GroupEntitySchema>

export interface IGroupEntity extends IGroupEntityProps {
  validate: () => void
}

export class GroupEntity implements IGroupEntity {
  private _id: GroupEntityId
  private _title: string
  private _uri: string
  // private _categories: ICategoryEntity[]
  private _order: number

  constructor(props: IGroupEntityProps) {
    this.validate()
    this._id = props.id
    this._title = props.title
    this._uri = props.uri
    // this._categories = props.categories
    this._order = props.order
  }

  public validate() {
    const validated = v.safeParse(GroupEntitySchema, {
      id: this.id,
      title: this.title,
      uri: this.uri,
      // categories: this.categories,
      order: this.order,
    })

    if (!validated.success) {
      console.log(validated.issues[0].path?.[0].key)
      throw new GroupEntityValidationError()
    }
  }

  get id() {
    return this._id
  }

  get title() {
    return this._title
  }

  get order() {
    return this._order
  }

  // get categories() {
  //   return structuredClone(this._categories)
  // }

  get uri() {
    return this._uri
  }

  setTitle(title: IGroupEntityProps['title']) {
    this._title = title
  }

  setUri(uri: IGroupEntityProps['uri']) {
    this._uri = uri
  }

  setOrder(order: IGroupEntityProps['order']) {
    if (order < 1) throw new GroupEntityValidationError()
  }
}
