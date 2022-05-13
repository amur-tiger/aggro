import { Request } from "express";
import { BadRequestException } from "./bad-request-exception";
import { UnauthorizedException } from "./unauthorized-exception";

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

export function getAuthToken(req: Request): string {
  const header = req.header("Authorization");
  if (!header) {
    throw new UnauthorizedException("No authorization header was given.");
  }
  if (!header.match(/^Bearer \w+/i)) {
    throw new UnauthorizedException("Invalid authorization header");
  }
  return header.substring(6).trim();
}
