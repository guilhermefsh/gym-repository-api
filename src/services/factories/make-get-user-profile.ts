import { PrismaUserRepository } from "@/repositories/prisma/prisma-users.repository"
import { GetUserProfileService } from "../get-user-profile"

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUserRepository()
  const service = new GetUserProfileService(usersRepository)

  return service
}
