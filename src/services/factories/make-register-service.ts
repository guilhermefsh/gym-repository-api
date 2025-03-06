import { PrismaUserRepository } from "@/repositories/prisma/prisma-users.repository";
import { RegisterUserService } from "../register-user";

export function makeRegisterService() {
  const usersRepository = new PrismaUserRepository()
  const registerService = new RegisterUserService(usersRepository)

  return registerService
}
