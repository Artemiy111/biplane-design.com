export type Result<Ok, Err> = ResultOk<Ok> | ResultErr<Err>

export interface ResultOk<Ok> { ok: true, value: Ok }
export interface ResultErr<Err> { ok: false, error: Err }

export function ok<Ok>(ok: Ok): ResultOk<Ok> {
  return {
    ok: true,
    value: ok,
  }
}

export function err<Err>(err: Err): ResultErr<Err> {
  return {
    ok: false,
    error: err,
  }
}
