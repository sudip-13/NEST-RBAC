import { Response } from 'express';

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: Record<string, any> | any[],
  options: Record<string, any> | undefined,
) => {
  let jsonObj = {
    status: true,
    message: message,
    data: Array.isArray(data) || typeof data === 'object' ? data : null,
  };
  if (options) {
    jsonObj = { ...(options || {}), ...jsonObj };
  }
  res.status(statusCode).json(jsonObj);
};
