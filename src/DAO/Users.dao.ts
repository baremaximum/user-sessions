import { Collection } from "mongodb";

export interface User {
  email: string;
  password: string;
  roles: [{ resource: string; role: string }];
}

let users: Collection<User>;
// Singleton
export class Users {
  constructor() {}

  public static injectDB(collection: Collection): void {
    if (!users) {
      users = collection;
    }
  }

  public static async getUser(email: string): Promise<User | null> {
    return users.findOne<User | null>(
      { email: email },
      { projection: { email: 1, password: 1, roles: 1 } }
    );
  }

  get collection(): Collection {
    return users;
  }
}
