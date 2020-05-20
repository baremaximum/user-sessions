import { ServerResponse } from "http";
import { Users } from "../DAO/Users.dao";
import { FastifyRequest, FastifyReply } from "fastify";
import jsonwebtoken from "jsonwebtoken";
import { Session } from "../interfaces/Session.interface";

export async function logoutHandler(
  this: any, // Typescript can't recognize attributes added by plugins.
  request: FastifyRequest,
  response: FastifyReply<ServerResponse>
): Promise<void> {
  let token: any;
  // Have to use any because of issue with Mongodb types.
  let userDoc: any;
  // Check that token is valid. If not, return an error;
  try {
    token = jsonwebtoken.verify(
      request.session.accessToken,
      global.__jwt_secret__
    );
  } catch (err) {
    console.error(err);
    response.status(400).send("Invalid token.");
    return;
  }
  // Remove session from user document in DB.
  try {
    userDoc = await Users.removeSessions(token.email);
  } catch (err) {
    console.error(`Could not remove session from user. Error: ${err}`);
    response.status(500).send("Server error");
    return;
  }
  // Destroy sessions other than the one attached to the current request
  try {
    userDoc.value.activeSessions.forEach((session: Session) => {
      if (session.sessionId !== request.session.sessionId) {
        this.redis.del(session.sessionId);
      }
    });
  } catch (err) {
    console.error(`Could not delete additional sessions. Error: ${err}`);
    response.status(500).send("Server error");
    return;
  }
  // Destroy current session in redis store.
  request.destroySession((err) => {
    if (err) {
      console.error(`Could not destroy current user session: Error: ${err}`);
      response.status(500).send("Server error");
    }

    // Clear all cookies and return confirmation of success.
    response.clearCookie("sessionId");
    response.clearCookie("accessToken");
    response.status(200).send("Logged out");
  });
}
