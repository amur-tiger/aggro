import type { Readable } from "svelte/store";

export interface PaginatedList<T> {
  isLoading: Readable<boolean>;
  totalCount: Readable<number>;
  items: Readable<T[]>;
  refresh: () => Promise<void>;
  nextPage: () => Promise<void>;
  previousPage: () => Promise<void>;
}

export interface WritablePaginatedList<T, TAdd = T, TEdit = T>
  extends PaginatedList<T> {
  addItem: (item: TAdd) => Promise<void>;
  editItem: (item: TEdit) => Promise<void>;
  deleteItem: (item: T) => Promise<void>;
}
