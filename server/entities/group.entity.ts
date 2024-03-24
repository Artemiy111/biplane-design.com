import * as v from 'valibot'

type GroupId = number

export class CategoryEntity {

}

interface GroupEntityProps {
  id?: GroupId
  title: string
  uri: string
  categories: CategoryEntity[]
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
  categories: v.array(v.instance(CategoryEntity)),
  order: v.number([v.minValue(1)]),
})

type _GroupEntityValidatedFields = v.Input<typeof GroupEntitySchema>

export class GroupEntity {
  private _id?: GroupId
  private _title: string
  private _uri: string
  private _categories: CategoryEntity[]
  private _order: number

  constructor(props: GroupEntityProps) {
    const validated = this.validate(props)
    this._id = validated.id
    this._title = validated.title
    this._uri = validated.uri
    this._categories = validated.categories
    this._order = validated.order
  }

  private validate(props: GroupEntityProps): GroupEntityProps {
    const validated = v.safeParse(GroupEntitySchema, props)
    if (!validated.success) {
      console.log(validated.issues[0].path?.[0].key)
      throw new GroupEntityValidationError()
    }
    return validated.output
  }

  get id() { return this._id }
  get title() { return this._title }
  get order() { return this._order }
  get categories() { return structuredClone(this._categories) }
  get uri() { return this._uri }

  setTitle(title: GroupEntityProps['title']) { this._title = title }
}
