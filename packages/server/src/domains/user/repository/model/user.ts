export interface User {
  id: string;
  username: string;
  mail: string;
  password: string;
  registered: Date;
  lastlogin: Date | null;
}
