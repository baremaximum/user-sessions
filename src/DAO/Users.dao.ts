import { Collection, Db, Cursor } from "mongodb";

export interface User {
  email: string;
  password: string;
  roles: [{ resource: string; role: string }];
}

let users: Collection<User>;
// Singleton
export class Users {
  constructor() {}

  public static injectDB(dbo: Db): void {
    if (!users) {
      users = dbo.collection("users");
    }
  }

  public static getUser(email: string): Cursor<User | null> {
    return users
      .find({ email: email })
      .limit(1)
      .project({ email: 1, password: 1, roles: 1 });
  }
}
