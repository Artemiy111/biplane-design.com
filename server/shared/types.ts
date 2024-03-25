export type Result<Ok, Err> = { ok: Ok; err: null } | { err: Err }
