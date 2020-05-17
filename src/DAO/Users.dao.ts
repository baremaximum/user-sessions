import { Collection } from "mongodb";
import bcryptjs from "bcryptjs";
import { User } from "../interfaces/User.interface";
import { Session } from "../interfaces/Session.interface";

let users: Collection<User>;
// Singleton
export class Users {
  constructor() {}

  public static injectDAO(coll: Collection) {
    if (!users) {
      users = coll;
    }
  }

  public static async getUser(email: string): Promise<User | null> {
    return await users.findOne<User | null>(
      { email: email },
      { projection: { email: 1, password: 1, roles: 1 } }
    );
  }

  public static async validatePassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.getUser(email);

    if (user && (await bcryptjs.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  public static async addSession(
    userId: string,
    sessionId: string,
    token: string
  ): Promise<void> {
    const session: Session = {
      sessionId: sessionId,
      startedOn: new Date(),
      accessToken: token,
    };
    await users.updateOne({ userId }, { $push: { activeSessions: session } });
  }

  public static async removeSession(
    email: string,
    sessionId: string
  ): Promise<void> {
    await users.updateOne(
      { email: email },
      { $pull: { activeSessions: sessionId } }
    );
  }

  public static collection(): Collection {
    return users;
  }
}
