export interface SourceEntity {
  id: string;
  userid: string;
  type: string;
  title: string;
  url: string;
  added: Date;
  lastupdate: Date | null;
}
