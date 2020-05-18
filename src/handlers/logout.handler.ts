import { ServerResponse } from "http";
import { Users } from "../DAO/Users.dao";
import { FastifyRequest, FastifyReply } from "fastify";
import jsonwebtoken from "jsonwebtoken";
import { JwtPayload } from "../interfaces/JwtPayload.interface";

export async function logoutHandler(
  request: FastifyRequest,
  response: FastifyReply<ServerResponse>
): Promise<void> {
  let token: any;
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

  try {
    await Users.removeSessions(token.email, request.session.sessionId);
  } catch (err) {
    console.error(`Could not remove session from user. Error: ${err}`);
    response.status(500).send("Server error");
    return;
  }
  request.destroySession((err) => {
    if (err) {
      console.error(
        `An error occurred while destroying user session: Error: ${err}`
      );
      response.status(500).send("Server error");
    }

    response.clearCookie("sessionId");
    response.clearCookie("accessToken");
    response.status(200).send("Logged out");
  });
}
