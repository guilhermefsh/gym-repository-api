import { PrismaUserRepository } from "@/repositories/prisma/prisma-users.repository";
import { AuthenticatedService } from "../authenticate";

export function makeAuthenticateService() {
  const usersRepository = new PrismaUserRepository()
  const authenticateService = new AuthenticatedService(usersRepository)

  return authenticateService
}
