import { Prisma, User } from "@prisma/client";
import { usersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class inMemoryUSersRepository implements usersRepository {
  public items: User[] = []
  async findById(id: string) {
    const userId = this.items.find(user => user.id === id);

    if (!userId) return null;

    return userId
  }
  async findByEmail(email: string) {
    const user = this.items.find(item => item.email === email);

    if (!user) return null;

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user);

    return user
  }
}

