export interface UserEntity {
  id: string;
  username: string;
  mail: string;
  password: string;
  registered: Date;
  lastlogin: Date | null;
}
