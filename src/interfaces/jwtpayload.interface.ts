export interface JwtPayload {
  email: string;
  roles: [{ resource: string; role: string }];
}
