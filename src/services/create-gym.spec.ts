import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists';
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymService } from './create-gym';

let gymsRepository: inMemoryGymsRepository
let createGymsService: CreateGymService
describe('CreateGymService Service', () => {

  beforeEach(() => {
    gymsRepository = new inMemoryGymsRepository
    createGymsService = new CreateGymService(gymsRepository)
  })

  it('should be able to register', async () => {

    const { gym } = await createGymsService.execute({
      title: 'John Doe',
      description: 'john.doe@example.com',
      phone: '11929292929',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    expect(gym.id).toEqual(expect.any(String))
  })

})
