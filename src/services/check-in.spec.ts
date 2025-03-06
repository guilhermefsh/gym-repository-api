import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInService } from './check-in';
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-numbers-of-check-ins.errors';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInsRepository: inMemoryCheckInsRepository
let gymsRepository: inMemoryGymsRepository
let checkInsService: CheckInService
describe('check-In Service', () => {

  beforeEach(async () => {
    checkInsRepository = new inMemoryCheckInsRepository
    gymsRepository = new inMemoryGymsRepository
    checkInsService = new CheckInService(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'academia typescript gym',
      description: 'Nada de any',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      phone: '1192929292'
    })

    await gymsRepository.create({
      id: 'gym-01',
      title: 'academia typescript gym',
      description: 'Nada de any',
      latitude: -27.0747279,
      longitude: -49.4889672,
      phone: '1192929292'
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {

    const { checkIn } = await checkInsService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLagitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 28, 8, 8, 0))

    await checkInsService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLagitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    await expect(() => checkInsService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLagitude: -27.0747279,
      userLongitude: -49.4889672,
    }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in but in the different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 28, 8, 8, 0))

    await checkInsService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLagitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    vi.setSystemTime(new Date(2022, 0, 29, 8, 8, 0))

    const { checkIn } = await checkInsService.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLagitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'academia typescript',
      description: 'Nada de any',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      phone: '1192929292'
    })

    expect(() => checkInsService.execute({
      gymId: 'gym-02',
      userId: 'user-01',
      userLagitude: -46.668807,
      userLongitude: -23.547566,
    }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

})
