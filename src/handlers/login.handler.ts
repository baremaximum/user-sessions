import { ServerResponse } from "http";
import { Users } from "../DAO/Users.dao";
import { FastifyRequest, FastifyReply } from "fastify";
import bcryptjs from "bcryptjs";

export async function loginHandler(
  request: FastifyRequest,
  response: FastifyReply<ServerResponse>
): Promise<void> {
  const user = await Users.getUser(request.body.username);

  if (user && (await bcryptjs.compare(request.body.password, user.password))) {
    response.send("OK");
  }
}
