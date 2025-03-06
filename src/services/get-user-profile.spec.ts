import { hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest'
import { inMemoryUSersRepository } from '@/repositories/in-memory/in-memory-users.repository';
import { GetUserProfileService } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-exists-error';

let usersRepository: inMemoryUSersRepository
let sut: GetUserProfileService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new inMemoryUSersRepository
    sut = new GetUserProfileService(usersRepository)
  })
  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })


  it('should not be able to get user profile wrong id', async () => {

    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })


})
