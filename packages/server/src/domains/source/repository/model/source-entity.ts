export interface SourceEntity {
  id: string;
  userid: string;
  type: string;
  title: string;
  uri: string;
  added: Date;
  lastupdate: Date | null;
}
