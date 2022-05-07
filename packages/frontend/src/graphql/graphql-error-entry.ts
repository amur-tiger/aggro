export interface GraphQLErrorEntry {
  message: string;
  locations?: {
    line: number;
    column: number;
  }[];
  path?: (string | number)[];
  extensions?: Record<any, any>;
}
