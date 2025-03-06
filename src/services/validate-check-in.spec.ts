import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { ValidateCheckInService } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-exists-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let checkInsRepository: inMemoryCheckInsRepository
let checkInsService: ValidateCheckInService
describe('validate check-In Service', () => {

  beforeEach(async () => {
    checkInsRepository = new inMemoryCheckInsRepository
    checkInsService = new ValidateCheckInService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await checkInsService.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {

    expect(() =>
      checkInsService.execute({
        checkInId: 'inexistent-check-in-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      checkInsService.execute({
        checkInId: createdCheckIn.id
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })

})
