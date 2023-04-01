import { Container } from "../container";

export interface Factory<T = unknown> {
  (container: Container): T;
}
