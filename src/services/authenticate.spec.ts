import { expect, describe, it, beforeEach } from 'vitest'
import { inMemoryUSersRepository } from '@/repositories/in-memory/in-memory-users.repository';
import { AuthenticatedService } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredencialsError } from './errors/invalid-credencials-error';

let usersRepository: inMemoryUSersRepository
let sut: AuthenticatedService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new inMemoryUSersRepository
    sut = new AuthenticatedService(usersRepository)
  })
  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })


  it('should not be able to authenticate with wrong email', async () => {

    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })


  it('should not be able to authenticate with wrong password', async () => {

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'john.doe@example.com',
        password: '1234562',
      }),
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })

})
