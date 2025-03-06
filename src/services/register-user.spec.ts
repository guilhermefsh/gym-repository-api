import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUserService } from './register-user'
import { compare } from 'bcryptjs';
import { inMemoryUSersRepository } from '@/repositories/in-memory/in-memory-users.repository';
import { UserAlreadyExistsError } from './errors/user-already-exists';

let usersRepository: inMemoryUSersRepository
let registerUserService: RegisterUserService
describe('RegisterUSer Service', () => {

  beforeEach(() => {
    usersRepository = new inMemoryUSersRepository
    registerUserService = new RegisterUserService(usersRepository)
  })

  it('should be able to register', async () => {

    const { user } = await registerUserService.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })



  it('should hash user password upon registration', async () => {

    const { user } = await registerUserService.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456', user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new inMemoryUSersRepository
    const registerUserService = new RegisterUserService(usersRepository)

    const email = '123456@example.com'

    await registerUserService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() => registerUserService.execute({
      name: 'Jane Doe',
      email,
      password: '123456',
    }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
