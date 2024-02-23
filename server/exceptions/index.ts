export enum HttpErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  InternalServerError = 500,
}

export const httpErrorMessages = {
  [HttpErrorCode.BadRequest]: 'Неверный запрос',
  [HttpErrorCode.Unauthorized]: 'Несанкционированный доступ',
  [HttpErrorCode.Forbidden]: 'Доступ запрещен',
  [HttpErrorCode.NotFound]: 'Ресурс не найден',
  [HttpErrorCode.MethodNotAllowed]: 'Метод не разрешен',
  [HttpErrorCode.InternalServerError]: 'Внутренняя ошибка сервера',
} as const

export const httpErrors = {
  [HttpErrorCode.BadRequest]: createError(
    { statusCode: HttpErrorCode.BadRequest, message: httpErrorMessages[HttpErrorCode.BadRequest] },
  ),
  [HttpErrorCode.Unauthorized]: createError(
    { statusCode: HttpErrorCode.Unauthorized, message: httpErrorMessages[HttpErrorCode.Unauthorized] },
  ),
  [HttpErrorCode.Forbidden]: createError(
    { statusCode: HttpErrorCode.Forbidden, message: httpErrorMessages[HttpErrorCode.Forbidden] },
  ),
  [HttpErrorCode.NotFound]: createError(
    { statusCode: HttpErrorCode.NotFound, message: httpErrorMessages[HttpErrorCode.NotFound] },
  ),
  [HttpErrorCode.MethodNotAllowed]: createError(
    { statusCode: HttpErrorCode.MethodNotAllowed, message: httpErrorMessages[HttpErrorCode.MethodNotAllowed] },
  ),
  [HttpErrorCode.InternalServerError]: createError(
    { statusCode: HttpErrorCode.InternalServerError, message: httpErrorMessages[HttpErrorCode.InternalServerError] },
  ),
} as const

export function createHttpError(statusCode: HttpErrorCode) {
  return createError({
    statusCode,
    message: httpErrorMessages[statusCode],
  })
}
