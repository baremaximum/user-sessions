import { ServerResponse } from "http";
import { Users } from "../DAO/Users.dao";
import { FastifyRequest, FastifyReply } from "fastify";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";

export async function loginHandler(
  request: FastifyRequest,
  response: FastifyReply<ServerResponse>
): Promise<void> {
  const { email, password } = request.body;
  const user = await Users.validatePassword(email, password);

  if (user) {
    const token = jsonwebtoken.sign(user, global.__jwt_secret__);

    response.send(token);
  }
}
