export interface SessionEntity {
  id: string;
  userid: string;
  token: string;
  created: Date;
  accessed: Date | null;
}
