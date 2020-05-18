import { ServerResponse } from "http";
import { Users } from "../DAO/Users.dao";
import { FastifyRequest, FastifyReply } from "fastify";
import jsonwebtoken from "jsonwebtoken";
import { JwtPayload } from "../interfaces/JwtPayload.interface";
import { ONE_DAY } from "../App";

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

    try {
      await Users.addSession(user._id, request.session.sessionId, token);
    } catch (e) {
      console.error(e);
      throw new Error("Could not add session to user");
    }

    response.setCookie("accessToken", token, {
      domain: process.env.DOMAIN,
      path: "/",
      maxAge: ONE_DAY,
    });
    response.send();
  } else {
    request.destroySession((err) => {
      if (err) throw err;
      response.status(401).send("Unauthorized");
    });
  }
}
