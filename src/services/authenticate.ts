import { PrismaUserRepository } from "@/repositories/prisma/prisma-users.repository"
import { InvalidCredencialsError } from "./errors/invalid-credencials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticatedServiceRequest {
  email: string;
  password: string;
}

interface AuthenticatedServiceResponse {
  user: User
}

export class AuthenticatedService {
  constructor(private usersRepository: PrismaUserRepository) { }

  async execute({
    email,
    password
  }: AuthenticatedServiceRequest): Promise<AuthenticatedServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredencialsError()
    }

    const isPasswordMatches = await compare(password, user.password_hash)

    if (!isPasswordMatches) {
      throw new InvalidCredencialsError()
    }

    return { user }

  }
}
