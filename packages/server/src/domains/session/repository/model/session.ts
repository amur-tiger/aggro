export interface Session {
  id: string;
  userid: string;
  token: string;
  created: Date;
  accessed: Date | null;
}
