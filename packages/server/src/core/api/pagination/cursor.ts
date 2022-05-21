export class Cursor {
  public readonly id: string | null;

  public constructor(id: string | null | undefined) {
    this.id = id || null;
  }
}
