import { ServerResponse } from "http";
import { Users } from "../DAO/Users.dao";
import { FastifyRequest, FastifyReply } from "fastify";
import jsonwebtoken from "jsonwebtoken";

export async function logoutHandler(
  request: FastifyRequest,
  response: FastifyReply<ServerResponse>
): Promise<void> {
  try {
    const token: any = jsonwebtoken.verify(
      request.session.accessToken,
      global.__jwt_secret__
    );
    await Users.removeSession(token.email, request.session.sessionId);
    request.destroySession((err) => {
      if (err) throw err;
      const pastTime = new Date().getTime() - 60;
      const date = new Date(pastTime);
      response.clearCookie("sessionId");
      response.clearCookie("accessToken");
      response.status(200).send("Logged out");
    });
  } catch (err) {
    console.error(err);
    response.status(400).send("Invalid token.");
  }
}
