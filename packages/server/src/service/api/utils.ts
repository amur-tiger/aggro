import { Request } from "express";
import { BadRequestException } from "./exceptions/bad-request-exception";

export function getParameter<T = string>(req: Request, name: string): T | null {
  if (req.body == null || typeof req.body !== "object" || !(name in req.body)) {
    return null;
  }
  return req.body[name];
}

export function getRequiredParameter<T = string>(
  req: Request,
  name: string
): T {
  if (req.body == null || typeof req.body !== "object" || !(name in req.body)) {
    throw new BadRequestException(`Parameter "${name}" is required.`);
  }
  return req.body[name];
}
