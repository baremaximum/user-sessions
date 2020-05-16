import { ServerResponse } from "http";
import { Users } from "../DAO/Users.dao";
import { FastifyRequest, FastifyReply } from "fastify";
import jsonwebtoken from "jsonwebtoken";
import { JwtPayload } from "../interfaces/jwtpayload.interface";

export async function loginHandler(
  request: FastifyRequest,
  response: FastifyReply<ServerResponse>
): Promise<void> {
  const { email, password } = request.body;
  const user = await Users.validatePassword(email, password);

  if (user) {
    const payload: JwtPayload = {
      email: user.email,
      roles: user.roles,
    };
    const token = jsonwebtoken.sign(payload, global.__jwt_secret__);
    request.session.accessToken = token;
    Users.addSession(user._id, sessionId: request.session.sessionId, request.city, request.country, token)
    response.setCookie("accessToken", token, {
      domain: process.env.DOMAIN,
      path: "/",
    });
    response.send();
  } else {
    request.destroySession((err) => {
      if (err) throw err;
      response.status(401).send("Unauthorized");
    });
  }
}
