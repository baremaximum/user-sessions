import { Collection } from "mongodb";
import bcryptjs from "bcryptjs";
import { User } from "../interfaces/User.interface";

export interface Location {
  city: string;
  country: string;
}

export interface Session {
  sessionId: string;
  startedOn: Date;
  device: string;
  location: Location;
  accessToken: string;
}

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

    if (user && (await bcryptjs.compare(user.password, password))) {
      return user;
    }

    return null;
  }

  public static async addSession(
    userId: string,
    sessionId: string,
    device: string,
    city: string,
    country: string,
    token: string
  ): Promise<void> {
    const session: Session = {
      sessionId: sessionId,
      startedOn: new Date(),
      accessToken: token,
      device: device,
      location: { city: city, country: country },
    };
    users.updateOne({ userId }, { $push: { activeSessions: session } });
  }
}
