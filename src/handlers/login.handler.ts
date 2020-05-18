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
  // Returns user object if password is valid. Else is null
  const user = await Users.validatePassword(email, password);

  if (user) {
    const payload: JwtPayload = {
      email: user.email,
      roles: user.roles,
    };

    // Attach JWT token to session to give access to user permission data on client side.
    const token = jsonwebtoken.sign(payload, global.__jwt_secret__);
    request.session.accessToken = token;
    // Add session data to user document in database.
    // Abort sign in and return error if this fails.
    try {
      await Users.addSession(user._id, request.session.sessionId, token);
    } catch (err) {
      console.error(`Could not add session to user. Error: ${err}`);
      request.destroySession((err) => {
        if (err) throw err;
      });
      response.status(500).send("Server error");
      return;
    }

    response.setCookie("accessToken", token, {
      domain: process.env.DOMAIN,
      path: "/",
      maxAge: ONE_DAY,
    });
    response.send();
  } else {
    // Else destroy session and return error.
    request.destroySession((err) => {
      if (err) throw err;
      response.status(401).send("Unauthorized");
    });
  }
}
